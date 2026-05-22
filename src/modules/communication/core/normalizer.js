export class DataNormalizer {
    static async rehydrateBookingSnapshot(bookingId, supabaseClient) {
        if (!bookingId || !supabaseClient) return null;
        try {
            const { data: booking, error: bError } = await supabaseClient
                .from('bookings')
                .select('*')
                .eq('id', bookingId)
                .single();
            if (bError || !booking) throw new Error(`Booking ${bookingId} not found`);

            let customer = null;
            if (booking.customer_id) {
                const { data: cData } = await supabaseClient
                    .from('customers')
                    .select('*')
                    .eq('id', booking.customer_id)
                    .single();
                customer = cData;
            }

            let driver = null;
            if (booking.assigned_driver_id) {
                const { data: dData } = await supabaseClient
                    .from('drivers')
                    .select('*')
                    .eq('id', booking.assigned_driver_id)
                    .single();
                driver = dData;
            }

            return {
                ...booking,
                amount: parseFloat(booking.amount) || 0,
                customer: customer ? {
                    name: customer.full_name || customer.name || booking.name,
                    email: customer.email || booking.email,
                    phone: customer.phone || booking.phone
                } : { name: booking.name, email: booking.email, phone: booking.phone },
                driver: driver ? {
                    name: driver.name,
                    vehicle: driver.vehicle,
                    license_plate: driver.license_plate,
                    phone: driver.phone
                } : booking.assigned_driver
            };
        } catch (error) {
            console.error('❌ DataNormalizer error:', error.message);
            return null;
        }
    }
}
