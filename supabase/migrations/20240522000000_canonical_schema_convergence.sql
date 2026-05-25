-- Canonical Schema Convergence Migration (Sprint 2A)
-- Additive, non-destructive, idempotent

-- 1. DRIVERS: partner_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'partner_id'
    ) THEN
        ALTER TABLE drivers ADD COLUMN partner_id INTEGER;
    END IF;
END $$;

-- 2. DRIVERS: email
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'email'
    ) THEN
        ALTER TABLE drivers ADD COLUMN email TEXT;
    END IF;
END $$;

-- 3. DRIVERS: vehicle
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'vehicle'
    ) THEN
        ALTER TABLE drivers ADD COLUMN vehicle TEXT;
    END IF;
END $$;

-- 4. DRIVERS: color
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'color'
    ) THEN
        ALTER TABLE drivers ADD COLUMN color TEXT;
    END IF;
END $$;

-- 5. DRIVERS: license_plate
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'license_plate'
    ) THEN
        ALTER TABLE drivers ADD COLUMN license_plate TEXT;
    END IF;
END $$;

-- 6. DRIVERS: phone
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE drivers ADD COLUMN phone TEXT;
    END IF;
END $$;

-- 7. BOOKINGS: partner_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'partner_id'
    ) THEN
        ALTER TABLE bookings ADD COLUMN partner_id INTEGER;
    END IF;
END $$;

-- 8. BOOKINGS: assigned_driver_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assigned_driver_id'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assigned_driver_id INTEGER;
    END IF;
END $$;

-- 9. BOOKINGS: assigned_driver
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assigned_driver'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assigned_driver JSONB;
    END IF;
END $$;

-- 10. BOOKINGS: assignment_token
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_token'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_token TEXT;
    END IF;
END $$;

-- 11. BOOKINGS: assignment_status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_status'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_status TEXT DEFAULT 'unassigned';
    END IF;
END $$;

-- 12. BOOKINGS: assignment_sent_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_sent_at'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_sent_at TIMESTAMPTZ;
    END IF;
END $$;

-- 13. BOOKINGS: assignment_accepted_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_accepted_at'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_accepted_at TIMESTAMPTZ;
    END IF;
END $$;

-- 14. BOOKINGS: assignment_declined_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_declined_at'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_declined_at TIMESTAMPTZ;
    END IF;
END $$;
