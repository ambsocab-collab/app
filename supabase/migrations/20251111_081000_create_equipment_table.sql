-- Create equipment table
-- This table stores hierarchical equipment structure (plant -> area -> functional unit -> equipment)

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('plant', 'area', 'functional_unit', 'equipment')),
  parent_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  description TEXT,
  location VARCHAR(255),
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  serial_number VARCHAR(255),
  installation_date DATE,
  warranty_expiry DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  -- Ensure no circular references in hierarchy
  CONSTRAINT ck_equipment_no_self_reference CHECK (id != parent_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipment_code ON equipment(code);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);
CREATE INDEX IF NOT EXISTS idx_equipment_parent_id ON equipment(parent_id);
CREATE INDEX IF NOT EXISTS idx_equipment_is_active ON equipment(is_active);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_equipment_created_at ON equipment(created_at);

-- Create composite index for hierarchical queries
CREATE INDEX IF NOT EXISTS idx_equipment_hierarchy ON equipment(type, parent_id, is_active);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_equipment_updated_at
    BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE equipment IS 'Hierarchical equipment structure for plants, areas, functional units, and individual equipment items';
COMMENT ON COLUMN equipment.id IS 'Unique identifier for each equipment item';
COMMENT ON COLUMN equipment.code IS 'Unique equipment code for identification';
COMMENT ON COLUMN equipment.type IS 'Equipment type in hierarchy: plant, area, functional_unit, or equipment';
COMMENT ON COLUMN equipment.parent_id IS 'Parent equipment ID for hierarchical structure';
COMMENT ON COLUMN equipment.location IS 'Physical location of the equipment';
COMMENT ON COLUMN equipment.manufacturer IS 'Equipment manufacturer';
COMMENT ON COLUMN equipment.model IS 'Equipment model number';
COMMENT ON COLUMN equipment.serial_number IS 'Equipment serial number';
COMMENT ON COLUMN equipment.installation_date IS 'Date when equipment was installed';
COMMENT ON COLUMN equipment.warranty_expiry IS 'Warranty expiry date for the equipment';
COMMENT ON COLUMN equipment.is_active IS 'Whether the equipment is currently in service';
COMMENT ON COLUMN equipment.created_by IS 'User who created this equipment record';

-- Add a function to check hierarchy depth for integrity
CREATE OR REPLACE FUNCTION check_equipment_hierarchy_depth()
RETURNS TRIGGER AS $$
DECLARE
    depth_count INTEGER;
BEGIN
    -- Recursively count the depth of the hierarchy (max 4 levels: plant -> area -> functional unit -> equipment)
    WITH RECURSIVE equipment_tree AS (
        SELECT id, parent_id, 1 as level
        FROM equipment
        WHERE id = NEW.id

        UNION ALL

        SELECT e.id, e.parent_id, et.level + 1
        FROM equipment e
        INNER JOIN equipment_tree et ON e.id = et.parent_id
    )
    SELECT MAX(level) INTO depth_count FROM equipment_tree;

    IF depth_count > 4 THEN
        RAISE EXCEPTION 'Equipment hierarchy cannot exceed 4 levels (plant -> area -> functional unit -> equipment)';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce hierarchy depth
CREATE TRIGGER check_equipment_hierarchy_trigger
    BEFORE INSERT OR UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION check_equipment_hierarchy_depth();