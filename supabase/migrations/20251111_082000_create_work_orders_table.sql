-- Create work_orders table
-- This table manages work order lifecycle and status tracking

CREATE TABLE IF NOT EXISTS work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  work_type VARCHAR(50) CHECK (work_type IN ('corrective', 'preventive', 'predictive', 'emergency', 'modification')),
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  scheduled_date DATE,
  start_time TIMESTAMPTZ,
  completion_time TIMESTAMPTZ,
  completion_notes TEXT,
  tools_required TEXT[], -- array of required tools
  spare_parts_required TEXT[], -- array of required spare parts
  safety_notes TEXT,
  cost DECIMAL(12,2),
  created_by UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approval_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ck_work_orders_duration CHECK (
    (estimated_duration IS NULL OR estimated_duration > 0) AND
    (actual_duration IS NULL OR actual_duration >= 0)
  ),
  CONSTRAINT ck_work_orders_dates CHECK (
    (completion_time IS NULL OR start_time IS NULL OR completion_time >= start_time)
  ),
  CONSTRAINT ck_work_orders_status_transition CHECK (
    (status = 'draft' AND approved_by IS NULL) OR
    (status IN ('pending', 'in_progress') AND approved_by IS NOT NULL) OR
    (status = 'completed' AND completion_time IS NOT NULL) OR
    (status = 'cancelled')
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_work_orders_equipment_id ON work_orders(equipment_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_assigned_to ON work_orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_priority ON work_orders(priority);
CREATE INDEX IF NOT EXISTS idx_work_orders_work_type ON work_orders(work_type);
CREATE INDEX IF NOT EXISTS idx_work_orders_scheduled_date ON work_orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_by ON work_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_at ON work_orders(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_work_orders_status_priority ON work_orders(status, priority);
CREATE INDEX IF NOT EXISTS idx_work_orders_equipment_status ON work_orders(equipment_id, status);
CREATE INDEX IF NOT EXISTS idx_work_orders_assigned_status ON work_orders(assigned_to, status);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE work_orders IS 'Work orders for maintenance tasks and equipment repair activities';
COMMENT ON COLUMN work_orders.id IS 'Unique identifier for each work order';
COMMENT ON COLUMN work_orders.title IS 'Brief title describing the work order';
COMMENT ON COLUMN work_orders.description IS 'Detailed description of the work to be performed';
COMMENT ON COLUMN work_orders.equipment_id IS 'Equipment that requires maintenance';
COMMENT ON COLUMN work_orders.assigned_to IS 'User assigned to perform the work';
COMMENT ON COLUMN work_orders.status IS 'Current status: draft, pending, in_progress, completed, cancelled';
COMMENT ON COLUMN work_orders.priority IS 'Priority level: low, medium, high, critical';
COMMENT ON COLUMN work_orders.work_type IS 'Type of maintenance work: corrective, preventive, predictive, emergency, modification';
COMMENT ON COLUMN work_orders.estimated_duration IS 'Estimated time to complete work in minutes';
COMMENT ON COLUMN work_orders.actual_duration IS 'Actual time taken to complete work in minutes';
COMMENT ON COLUMN work_orders.scheduled_date IS 'Date when work is scheduled to be performed';
COMMENT ON COLUMN work_orders.start_time IS 'Actual start time of the work';
COMMENT ON COLUMN work_orders.completion_time IS 'Actual completion time of the work';
COMMENT ON COLUMN work_orders.completion_notes IS 'Notes about work completion and results';
COMMENT ON COLUMN work_orders.tools_required IS 'List of tools required for the work';
COMMENT ON COLUMN work_orders.spare_parts_required IS 'List of spare parts required for the work';
COMMENT ON COLUMN work_orders.safety_notes IS 'Safety precautions and notes';
COMMENT ON COLUMN work_orders.cost IS 'Cost of the work order';
COMMENT ON COLUMN work_orders.created_by IS 'User who created the work order';
COMMENT ON COLUMN work_orders.approved_by IS 'User who approved the work order';
COMMENT ON COLUMN work_orders.approval_date IS 'Date when work order was approved';

-- Create a function to validate work order status transitions
CREATE OR REPLACE FUNCTION validate_work_order_status_transition()
RETURNS TRIGGER AS $$
DECLARE
    valid_transitions TEXT[][] := ARRAY[
        ARRAY['draft', 'pending'],
        ARRAY['draft', 'cancelled'],
        ARRAY['pending', 'in_progress'],
        ARRAY['pending', 'cancelled'],
        ARRAY['in_progress', 'completed'],
        ARRAY['in_progress', 'cancelled'],
        ARRAY['completed', 'cancelled'] -- Allow reopening in special cases
    ];
    transition_valid BOOLEAN := FALSE;
    i INTEGER;
BEGIN
    -- If status is not changing, allow
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- Check if transition is valid
    FOR i IN 1..array_length(valid_transitions, 1) LOOP
        IF OLD.status = valid_transitions[i][1] AND NEW.status = valid_transitions[i][2] THEN
            transition_valid := TRUE;
            EXIT;
        END IF;
    END LOOP;

    IF NOT transition_valid THEN
        RAISE EXCEPTION 'Invalid work order status transition from % to %', OLD.status, NEW.status;
    END IF;

    -- Auto-set timestamps for status changes
    IF NEW.status = 'in_progress' AND OLD.status != 'in_progress' THEN
        NEW.start_time = COALESCE(NEW.start_time, NOW());
    END IF;

    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completion_time = COALESCE(NEW.completion_time, NOW());
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate status transitions
CREATE TRIGGER validate_work_order_status_transition_trigger
    BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION validate_work_order_status_transition();