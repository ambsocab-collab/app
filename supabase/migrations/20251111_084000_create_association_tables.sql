-- Create association and audit tables
-- This migration creates tables for tracking work order audit trail and spare parts usage

-- Create work_order_audit table for tracking changes
CREATE TABLE IF NOT EXISTS work_order_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'updated', 'assigned', 'status_changed', 'completed', 'cancelled')),
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  old_assigned_to UUID,
  new_assigned_to UUID,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  changed_by UUID NOT NULL REFERENCES users(id),
  change_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for work_order_audit
CREATE INDEX IF NOT EXISTS idx_work_order_audit_work_order_id ON work_order_audit(work_order_id);
CREATE INDEX IF NOT EXISTS idx_work_order_audit_action ON work_order_audit(action);
CREATE INDEX IF NOT EXISTS idx_work_order_audit_changed_by ON work_order_audit(changed_by);
CREATE INDEX IF NOT EXISTS idx_work_order_audit_created_at ON work_order_audit(created_at);

-- Create spare_part_usage table for tracking parts consumption
CREATE TABLE IF NOT EXISTS spare_part_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  spare_part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE RESTRICT,
  quantity_used INTEGER NOT NULL CHECK (quantity_used > 0),
  unit_cost DECIMAL(10,2), -- Cost at time of usage (may differ from current cost)
  total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity_used * COALESCE(unit_cost, 0)) STORED,
  used_by UUID NOT NULL REFERENCES users(id),
  usage_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure we don't use more parts than available (will be enforced by application logic)
  CONSTRAINT ck_spare_part_usage_positive CHECK (quantity_used > 0),
  CONSTRAINT ck_spare_part_usage_cost CHECK (unit_cost IS NULL OR unit_cost >= 0)
);

-- Create indexes for spare_part_usage
CREATE INDEX IF NOT EXISTS idx_spare_part_usage_work_order_id ON spare_part_usage(work_order_id);
CREATE INDEX IF NOT EXISTS idx_spare_part_usage_spare_part_id ON spare_part_usage(spare_part_id);
CREATE INDEX IF NOT EXISTS idx_spare_part_usage_usage_date ON spare_part_usage(usage_date);
CREATE INDEX IF NOT EXISTS idx_spare_part_usage_used_by ON spare_part_usage(used_by);

-- Create equipment_spare_parts association table
CREATE TABLE IF NOT EXISTS equipment_spare_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  spare_part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE RESTRICT,
  quantity_required INTEGER DEFAULT 1 CHECK (quantity_required > 0),
  is_standard BOOLEAN DEFAULT true, -- Whether this is a standard spare part for this equipment
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  -- Unique constraint to prevent duplicate associations
  UNIQUE(equipment_id, spare_part_id)
);

-- Create indexes for equipment_spare_parts
CREATE INDEX IF NOT EXISTS idx_equipment_spare_parts_equipment_id ON equipment_spare_parts(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_spare_parts_spare_part_id ON equipment_spare_parts(spare_part_id);
CREATE INDEX IF NOT EXISTS idx_equipment_spare_parts_is_standard ON equipment_spare_parts(is_standard);

-- Comments for documentation
COMMENT ON TABLE work_order_audit IS 'Audit trail for all work order changes and state transitions';
COMMENT ON COLUMN work_order_audit.work_order_id IS 'Reference to the work order that was changed';
COMMENT ON COLUMN work_order_audit.action IS 'Type of action performed on the work order';
COMMENT ON COLUMN work_order_audit.old_status IS 'Previous status before the change';
COMMENT ON COLUMN work_order_audit.new_status IS 'New status after the change';
COMMENT ON COLUMN work_order_audit.old_assigned_to IS 'Previous assigned user';
COMMENT ON COLUMN work_order_audit.new_assigned_to IS 'New assigned user';
COMMENT ON COLUMN work_order_audit.field_name IS 'Name of the field that was changed';
COMMENT ON COLUMN work_order_audit.old_value IS 'Previous value of the changed field';
COMMENT ON COLUMN work_order_audit.new_value IS 'New value of the changed field';
COMMENT ON COLUMN work_order_audit.changed_by IS 'User who made the change';
COMMENT ON COLUMN work_order_audit.change_notes IS 'Optional notes about the change';

COMMENT ON TABLE spare_part_usage IS 'Tracking of spare parts consumption in work orders';
COMMENT ON COLUMN spare_part_usage.work_order_id IS 'Work order where the spare part was used';
COMMENT ON COLUMN spare_part_usage.spare_part_id IS 'Spare part that was used';
COMMENT ON COLUMN spare_part_usage.quantity_used IS 'Quantity of the spare part used';
COMMENT ON COLUMN spare_part_usage.unit_cost IS 'Unit cost at the time of usage';
COMMENT ON COLUMN spare_part_usage.total_cost IS 'Total cost for this usage';
COMMENT ON COLUMN spare_part_usage.used_by IS 'User who recorded the usage';
COMMENT ON COLUMN spare_part_usage.usage_date IS 'Date when the spare part was used';
COMMENT ON COLUMN spare_part_usage.notes IS 'Optional notes about the usage';

COMMENT ON TABLE equipment_spare_parts IS 'Association between equipment and their standard spare parts';
COMMENT ON COLUMN equipment_spare_parts.equipment_id IS 'Equipment that uses this spare part';
COMMENT ON COLUMN equipment_spare_parts.spare_part_id IS 'Spare part used by this equipment';
COMMENT ON COLUMN equipment_spare_parts.quantity_required IS 'Standard quantity required for this equipment';
COMMENT ON COLUMN equipment_spare_parts.is_standard IS 'Whether this is a standard spare part for routine maintenance';
COMMENT ON COLUMN equipment_spare_parts.notes IS 'Optional notes about the usage';
COMMENT ON COLUMN equipment_spare_parts.created_by IS 'User who created this association';

-- Create function to automatically log work order changes
CREATE OR REPLACE FUNCTION log_work_order_changes()
RETURNS TRIGGER AS $$
DECLARE
    change_action TEXT;
BEGIN
    -- Determine the type of change
    IF TG_OP = 'INSERT' THEN
        change_action := 'created';
        INSERT INTO work_order_audit (work_order_id, action, changed_by, new_value)
        VALUES (NEW.id, change_action, NEW.created_by, row_to_json(NEW));

    ELSIF TG_OP = 'UPDATE' THEN
        -- Log status changes
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO work_order_audit (
                work_order_id, action, old_status, new_status, changed_by,
                new_value, old_value, field_name
            )
            VALUES (
                NEW.id, 'status_changed', OLD.status, NEW.status,
                NEW.updated_by, row_to_json(NEW), row_to_json(OLD), 'status'
            );
        END IF;

        -- Log assignment changes
        IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
            INSERT INTO work_order_audit (
                work_order_id, action, old_assigned_to, new_assigned_to, changed_by
            )
            VALUES (
                NEW.id, 'assigned', OLD.assigned_to, NEW.assigned_to, NEW.updated_by
            );
        END IF;

        -- Log other significant changes (title, description, priority, etc.)
        IF OLD.title IS DISTINCT FROM NEW.title OR
           OLD.description IS DISTINCT FROM NEW.description OR
           OLD.priority IS DISTINCT FROM NEW.priority THEN
            INSERT INTO work_order_audit (
                work_order_id, action, changed_by, new_value, old_value
            )
            VALUES (
                NEW.id, 'updated', NEW.updated_by, row_to_json(NEW), row_to_json(OLD)
            );
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        -- Log deletion (rare case)
        INSERT INTO work_order_audit (work_order_id, action, changed_by, old_value)
        VALUES (OLD.id, 'deleted', OLD.updated_by, row_to_json(OLD));
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for work order audit logging
CREATE TRIGGER work_order_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION log_work_order_changes();

-- Create function to update spare parts stock when used
CREATE OR REPLACE FUNCTION update_spare_parts_stock()
RETURNS TRIGGER AS $$
DECLARE
    current_spare_part spare_parts%ROWTYPE;
BEGIN
    -- Get current spare part information
    SELECT * INTO current_spare_part FROM spare_parts WHERE id = NEW.spare_part_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Spare part not found: %', NEW.spare_part_id;
    END IF;

    -- Update stock (reduce by quantity used)
    UPDATE spare_parts
    SET current_stock = current_stock - NEW.quantity_used,
        updated_at = NOW()
    WHERE id = NEW.spare_part_id;

    -- Check if stock would go negative
    IF current_spare_part.current_stock - NEW.quantity_used < 0 THEN
        RAISE EXCEPTION 'Insufficient stock for part % (Code: %). Available: %, Required: %',
            current_spare_part.name, current_spare_part.code,
            current_spare_part.current_stock, NEW.quantity_used;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update spare parts stock
CREATE TRIGGER update_spare_parts_stock_trigger
    AFTER INSERT ON spare_part_usage
    FOR EACH ROW EXECUTE FUNCTION update_spare_parts_stock();