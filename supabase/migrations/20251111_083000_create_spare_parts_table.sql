-- Create spare_parts table
-- This table manages spare parts inventory and tracking

CREATE TABLE IF NOT EXISTS spare_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(255),
  part_number VARCHAR(100),
  unit_of_measure VARCHAR(20) DEFAULT 'pcs',
  current_stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  maximum_stock INTEGER,
  unit_cost DECIMAL(10,2),
  supplier VARCHAR(255),
  supplier_part_number VARCHAR(100),
  lead_time_days INTEGER DEFAULT 30,
  location VARCHAR(255), -- Storage location
  bin_location VARCHAR(100), -- Specific bin location
  is_active BOOLEAN DEFAULT true,
  is_critical BOOLEAN DEFAULT false, -- Critical spare part for operations
  expiration_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  -- Constraints
  CONSTRAINT ck_spare_parts_stock CHECK (
    current_stock >= 0 AND
    minimum_stock >= 0 AND
    (maximum_stock IS NULL OR maximum_stock >= minimum_stock)
  ),
  CONSTRAINT ck_spare_parts_costs CHECK (unit_cost IS NULL OR unit_cost > 0),
  CONSTRAINT ck_spare_parts_lead_time CHECK (lead_time_days > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_spare_parts_code ON spare_parts(code);
CREATE INDEX IF NOT EXISTS idx_spare_parts_name ON spare_parts(name);
CREATE INDEX IF NOT EXISTS idx_spare_parts_category ON spare_parts(category);
CREATE INDEX IF NOT EXISTS idx_spare_parts_manufacturer ON spare_parts(manufacturer);
CREATE INDEX IF NOT EXISTS idx_spare_parts_current_stock ON spare_parts(current_stock);
CREATE INDEX IF NOT EXISTS idx_spare_parts_is_active ON spare_parts(is_active);
CREATE INDEX IF NOT EXISTS idx_spare_parts_is_critical ON spare_parts(is_critical);
CREATE INDEX IF NOT EXISTS idx_spare_parts_location ON spare_parts(location);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_spare_parts_category_active ON spare_parts(category, is_active);
CREATE INDEX IF NOT EXISTS idx_spare_parts_stock_level ON spare_parts(current_stock, minimum_stock);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_spare_parts_updated_at
    BEFORE UPDATE ON spare_parts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE spare_parts IS 'Spare parts inventory management and tracking';
COMMENT ON COLUMN spare_parts.id IS 'Unique identifier for each spare part';
COMMENT ON COLUMN spare_parts.name IS 'Name of the spare part';
COMMENT ON COLUMN spare_parts.code IS 'Unique code for spare part identification';
COMMENT ON COLUMN spare_parts.description IS 'Detailed description of the spare part';
COMMENT ON COLUMN spare_parts.category IS 'Category of the spare part (e.g., bearings, seals, electrical)';
COMMENT ON COLUMN spare_parts.manufacturer IS 'Manufacturer of the spare part';
COMMENT ON COLUMN spare_parts.part_number IS 'Manufacturer part number';
COMMENT ON COLUMN spare_parts.unit_of_measure IS 'Unit of measure (pcs, kg, m, etc.)';
COMMENT ON COLUMN spare_parts.current_stock IS 'Current quantity in stock';
COMMENT ON COLUMN spare_parts.minimum_stock IS 'Minimum stock level for reordering';
COMMENT ON COLUMN spare_parts.maximum_stock IS 'Maximum stock level for inventory control';
COMMENT ON COLUMN spare_parts.unit_cost IS 'Cost per unit';
COMMENT ON COLUMN spare_parts.supplier IS 'Primary supplier for this part';
COMMENT ON COLUMN spare_parts.supplier_part_number IS 'Supplier part number';
COMMENT ON COLUMN spare_parts.lead_time_days IS 'Lead time in days for ordering';
COMMENT ON COLUMN spare_parts.location IS 'General storage location';
COMMENT ON COLUMN spare_parts.bin_location IS 'Specific bin/shelf location';
COMMENT ON COLUMN spare_parts.is_active IS 'Whether the spare part is currently in use';
COMMENT ON COLUMN spare_parts.is_critical IS 'Whether this is a critical spare part for operations';
COMMENT ON COLUMN spare_parts.expiration_date IS 'Expiration date for perishable parts';
COMMENT ON COLUMN spare_parts.created_by IS 'User who created this spare part record';

-- Create function to check low stock levels
CREATE OR REPLACE FUNCTION check_spare_parts_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- If stock is below minimum, log a warning (in a real system, this would trigger a notification)
    IF NEW.current_stock <= NEW.minimum_stock THEN
        RAISE LOG 'Low stock warning: Part % (Code: %) has % units in stock, minimum is %',
            NEW.name, NEW.code, NEW.current_stock, NEW.minimum_stock;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check low stock levels
CREATE TRIGGER check_spare_parts_low_stock_trigger
    AFTER INSERT OR UPDATE ON spare_parts
    FOR EACH ROW EXECUTE FUNCTION check_spare_parts_low_stock();