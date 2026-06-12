const SUPABASE_URL = 'https://rreqjjrmvytnwnsidmqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZXFqanJtdnl0bnduc2lkbXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MjAxMzcsImV4cCI6MjA5Mzk5NjEzN30.q4M3A6Dix3F_9Im2pw8DUIeE4C-INtUlvImRDM58MTA';

function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function renderReview(review) {
    const name = review.customer_name || 'FleetConnect customer';
    const date = review.created_at ? new Date(review.created_at).toLocaleDateString() : '';
    return `<article class="testimonial-card"><div class="testimonial-stars">${'★'.repeat(Number(review.rating) || 0)}</div><p>${escapeHtml(review.comment)}</p><small>${escapeHtml(name)}${date ? ` · ${escapeHtml(date)}` : ''}</small></article>`;
}

export async function mountTestimonials(options = {}) {
    const highlightedEl = document.getElementById(options.highlightedId || 'highlightedTestimonials');
    const allEl = document.getElementById(options.allId || 'allTestimonials');
    if (!highlightedEl || !allEl) return;

    try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await supabase.rpc('get_public_ride_reviews', { p_limit: 25 });
        if (error) throw error;

        const reviews = (data || []).filter((review) => review.comment && Number(review.rating) >= 1);
        const highlighted = reviews.filter((review) => Number(review.rating) === 5).slice(0, 3);
        const others = reviews.filter((review) => Number(review.rating) !== 5).slice(0, 10);

        highlightedEl.innerHTML = highlighted.length
            ? highlighted.map(renderReview).join('')
            : `<div class="testimonial-empty">${escapeHtml(options.emptyHighlighted || 'No highlighted testimonials yet.')}</div>`;
        allEl.innerHTML = others.length
            ? others.map(renderReview).join('')
            : `<div class="testimonial-empty">${escapeHtml(options.emptyAll || 'No other testimonials yet.')}</div>`;
    } catch (error) {
        console.warn('Testimonials unavailable:', error.message);
        highlightedEl.innerHTML = `<div class="testimonial-empty">${escapeHtml(options.unavailable || 'Testimonials are temporarily unavailable.')}</div>`;
        allEl.innerHTML = '';
    }
}
