-- Setup Row Level Security (RLS) policies
-- This migration implements comprehensive access control policies

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_part_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_spare_parts ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Allow admins to view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow users to update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (
        auth.uid() = id AND
        -- Only allow updating certain fields
        (array['first_name', 'last_name'] && string_to_array(string_agg(quote_literal(column_name), ','), ',') IS NOT NULL)
    );

-- Allow admins to manage all users
CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Equipment table policies
-- Allow all authenticated users to view active equipment
CREATE POLICY "Authenticated users can view active equipment" ON equipment
    FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

-- Allow supervisors and admins to view all equipment
CREATE POLICY "Supervisors and admins can view all equipment" ON equipment
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

-- Allow supervisors and admins to manage equipment
CREATE POLICY "Supervisors and admins can manage equipment" ON equipment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

-- Work orders table policies
-- Allow users to view work orders assigned to them or created by them
CREATE POLICY "Users can view assigned or created work orders" ON work_orders
    FOR SELECT USING (
        auth.uid() = assigned_to OR
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

-- Allow operators and supervisors to create work orders
CREATE POLICY "Operators and supervisors can create work orders" ON work_orders
    FOR INSERT WITH CHECK (
        (auth.uid() = created_by) AND
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor', 'operator')
        )
    );

-- Allow users to update work orders assigned to them
CREATE POLICY "Users can update assigned work orders" ON work_orders
    FOR UPDATE USING (
        auth.uid() = assigned_to OR
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

-- Spare parts table policies
-- Allow all authenticated users to view active spare parts
CREATE POLICY "Authenticated users can view active spare parts" ON spare_parts
    FOR SELECT USING (is_active = true AND auth.role() = 'authenticated');

-- Allow supervisors and admins to view all spare parts
CREATE POLICY "Supervisors and admins can view all spare parts" ON spare_parts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

-- Allow supervisors and admins to manage spare parts
CREATE POLICY "Supervisors and admins can manage spare parts" ON spare_parts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

-- Work order audit table policies (read-only for most users)
-- Allow users to view audit for their work orders
CREATE POLICY "Users can view relevant work order audit" ON work_order_audit
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM work_orders
            WHERE id = work_order_audit.work_order_id AND
                  (auth.uid() = work_orders.assigned_to OR
                   auth.uid() = work_orders.created_by OR
                   EXISTS (
                       SELECT 1 FROM users
                       WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
                   ))
        )
    );

-- Allow admins to view all audit entries
CREATE POLICY "Admins can view all work order audit" ON work_order_audit
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Spare part usage table policies
-- Allow users to view spare part usage for their work orders
CREATE POLICY "Users can view spare part usage for their work orders" ON spare_part_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM work_orders
            WHERE id = spare_part_usage.work_order_id AND
                  (auth.uid() = work_orders.assigned_to OR
                   auth.uid() = work_orders.created_by OR
                   EXISTS (
                       SELECT 1 FROM users
                       WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
                   ))
        )
    );

-- Allow users to create spare part usage for their work orders
CREATE POLICY "Users can create spare part usage for their work orders" ON spare_part_usage
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM work_orders
            WHERE id = spare_part_usage.work_order_id AND
                  (auth.uid() = work_orders.assigned_to OR
                   auth.uid() = work_orders.created_by OR
                   EXISTS (
                       SELECT 1 FROM users
                       WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
                   ))
        )
    );

-- Equipment spare parts association policies
-- Allow all authenticated users to view equipment-spare parts associations
CREATE POLICY "Authenticated users can view equipment spare parts" ON equipment_spare_parts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow supervisors and admins to manage equipment spare parts
CREATE POLICY "Supervisors and admins can manage equipment spare parts" ON equipment_spare_parts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
        )
    );

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION user_has_role(user_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = user_role AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user can access specific equipment
CREATE OR REPLACE FUNCTION can_access_equipment(equipment_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_val TEXT;
BEGIN
    -- Get user role
    SELECT role INTO user_role_val FROM users WHERE id = auth.uid() AND is_active = true;

    -- Admins and supervisors can access all equipment
    IF user_role_val IN ('admin', 'supervisor') THEN
        RETURN true;
    END IF;

    -- Operators can only access active equipment
    IF user_role_val = 'operator' THEN
        RETURN EXISTS (
            SELECT 1 FROM equipment
            WHERE id = equipment_id_param AND is_active = true
        );
    END IF;

    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user can access specific work order
CREATE OR REPLACE FUNCTION can_access_work_order(work_order_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_val TEXT;
BEGIN
    -- Get user role
    SELECT role INTO user_role_val FROM users WHERE id = auth.uid() AND is_active = true;

    -- Admins and supervisors can access all work orders
    IF user_role_val IN ('admin', 'supervisor') THEN
        RETURN true;
    END IF;

    -- Operators can only access work orders assigned to them or created by them
    IF user_role_val = 'operator' THEN
        RETURN EXISTS (
            SELECT 1 FROM work_orders
            WHERE id = work_order_id_param AND
                  (assigned_to = auth.uid() OR created_by = auth.uid())
        );
    END IF;

    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON POLICY "Users can view own profile" ON users IS 'Allow users to view their own user profile';
COMMENT ON POLICY "Admins can view all users" ON users IS 'Allow administrators to view all user profiles';
COMMENT ON POLICY "Users can update own profile" ON users IS 'Allow users to update their own profile (limited fields)';
COMMENT ON POLICY "Admins can manage all users" ON users IS 'Allow administrators full CRUD access to user accounts';

COMMENT ON POLICY "Authenticated users can view active equipment" ON equipment IS 'Allow all authenticated users to view active equipment';
COMMENT ON POLICY "Supervisors and admins can view all equipment" ON equipment IS 'Allow supervisors and administrators to view all equipment including inactive';

COMMENT ON POLICY "Users can view assigned or created work orders" ON work_orders IS 'Allow users to view work orders assigned to them or created by them';
COMMENT ON POLICY "Operators and supervisors can create work orders" ON work_orders IS 'Allow operators and supervisors to create new work orders';
COMMENT ON POLICY "Users can update assigned work orders" ON work_orders IS 'Allow users to update work orders assigned to them or created by them';

COMMENT ON FUNCTION user_has_role(TEXT) IS 'Check if the current authenticated user has a specific role';
COMMENT ON FUNCTION can_access_equipment(UUID) IS 'Check if the current user can access specific equipment based on role and ownership';
COMMENT ON FUNCTION can_access_work_order(UUID) IS 'Check if the current user can access specific work order based on role and assignment';