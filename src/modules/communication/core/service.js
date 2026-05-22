import { DataNormalizer } from './normalizer.js';

export class CommunicationService {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.edgeFunctionName = 'send-email';
    }

    async dispatch(trigger, bookingId, metadata = {}) {
        console.log(`[CommService] Triggering ${trigger} for booking ${bookingId}`);

        try {
            const snapshot = await DataNormalizer.rehydrateBookingSnapshot(bookingId, this.supabase);
            if (!snapshot) throw new Error('Could not rehydrate booking snapshot');

            const payload = {
                trigger,
                bookingId,
                booking: snapshot,
                metadata,
                timestamp: new Date().toISOString()
            };

            const { data, error } = await this.supabase.functions.invoke(this.edgeFunctionName, {
                body: payload
            });

            if (error) throw error;
            console.log(`[CommService] ${trigger} dispatched successfully`, data);
            return data;
        } catch (err) {
            console.error(`[CommService] Failed to dispatch ${trigger}:`, err.message);
            // Non-blocking, so we don't rethrow
            return null;
        }
    }
}
