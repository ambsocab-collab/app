# Database Schema

## PostgreSQL Schema Definition

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'supervisor', 'operator')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    phone_number VARCHAR(20),
    department VARCHAR(100),
    preferences JSONB DEFAULT '{
        "language": "en",
        "theme": "light",
        "notifications": {
            "email": true,
            "push": true,
            "workOrderAssignment": true,
            "lowStockAlert": true
        }
    }'::jsonb
);

-- Equipment table with hierarchical structure
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('plant', 'area', 'functional_unit', 'equipment', 'component')) NOT NULL,
    parent_id UUID REFERENCES equipment(id),
    level INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(200) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    installation_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'maintenance', 'decommissioned')) DEFAULT 'active',
    maintenance_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work orders table
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) CHECK (priority IN ('critical', 'high', 'medium', 'low')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('open', 'planned', 'in_execution', 'completed', 'closed', 'rejected', 'waiting', 'pending_stock')) DEFAULT 'open',
    equipment_id UUID NOT NULL REFERENCES equipment(id),
    assigned_operator_id UUID REFERENCES users(id),
    created_by_id UUID NOT NULL REFERENCES users(id),
    estimated_duration INTEGER NOT NULL CHECK (estimated_duration > 0 AND estimated_duration <= 480),
    actual_duration INTEGER CHECK (actual_duration >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    completed_by_id UUID REFERENCES users(id)
);

-- Work order audit trail
CREATE TABLE work_order_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    reason TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Spare parts table
CREATE TABLE spare_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    part_number VARCHAR(50) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    minimum_stock INTEGER NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
    maximum_stock INTEGER NOT NULL CHECK (maximum_stock > 0),
    unit VARCHAR(20) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    location VARCHAR(100) NOT NULL,
    supplier VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spare part usage tracking
CREATE TABLE spare_part_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    used_by_id UUID NOT NULL REFERENCES users(id)
);

-- Equipment-spare parts associations
CREATE TABLE equipment_spare_parts (
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE CASCADE,
    is_common BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (equipment_id, spare_part_id)
);

-- Work order attachments
CREATE TABLE work_order_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_by_id UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_equipment_parent_id ON equipment(parent_id);
CREATE INDEX idx_equipment_type ON equipment(type);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_assigned_operator ON work_orders(assigned_operator_id);
CREATE INDEX idx_work_orders_equipment ON work_orders(equipment_id);
CREATE INDEX idx_work_orders_created_at ON work_orders(created_at);
CREATE INDEX idx_work_order_audit_work_order ON work_order_audit(work_order_id);
CREATE INDEX idx_spare_parts_category ON spare_parts(category);
CREATE INDEX idx_spare_part_usage_work_order ON spare_part_usage(work_order_id);
CREATE INDEX idx_spare_part_usage_spare_part ON spare_part_usage(spare_part_id);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;

-- Users can see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Operators can only see assigned work orders
CREATE POLICY "Operators view assigned work orders" ON work_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'operator'
            AND work_orders.assigned_operator_id = auth.uid()
        )
    );

-- Supervisors and admins can see all work orders
CREATE POLICY "Supervisors view all work orders" ON work_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('supervisor', 'admin')
        )
    );

-- Equipment is visible to all authenticated users
CREATE POLICY "Authenticated users view equipment" ON equipment
    FOR SELECT USING (auth.role() IS NOT NULL);

-- Spare parts visible to all authenticated users
CREATE POLICY "Authenticated users view spare parts" ON spare_parts
    FOR SELECT USING (auth.role() IS NOT NULL);
```

---
