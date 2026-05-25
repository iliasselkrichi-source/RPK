-- Canonical Schema Convergence Migration (Sprint 2A)
-- Additive, non-destructive, idempotent

-- 1. Ensure partner_id exists on drivers (replaces legacy subcontractor_id logic)
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

-- 2. Ensure canonical driver fields exist
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

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'vehicle'
    ) THEN
        ALTER TABLE drivers ADD COLUMN vehicle TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'color'
    ) THEN
        ALTER TABLE drivers ADD COLUMN color TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'license_plate'
    ) THEN
        ALTER TABLE drivers ADD COLUMN license_plate TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'drivers'
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE drivers ADD COLUMN phone TEXT;
    END IF;
END $$;

-- 3. Ensure canonical booking fields for driver assignment exist
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

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assigned_driver_id'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assigned_driver_id INTEGER;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assigned_driver'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assigned_driver JSONB;
    END IF;
END $$;

-- 4. Ensure assignment lifecycle fields exist on bookings
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

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_status'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_status TEXT DEFAULT 'unassigned';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_sent_at'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_sent_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_accepted_at'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_accepted_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'assignment_declined_at'
    ) THEN
        ALTER TABLE bookings ADD COLUMN assignment_declined_at TIMESTAMPTZ;
    END IF;
END $$;
