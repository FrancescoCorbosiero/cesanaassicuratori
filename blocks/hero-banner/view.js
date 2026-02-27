/**
 * cesana/hero-banner — Frontend Interactivity
 * Uses WordPress Interactivity API (wp-interactivity)
 * Crossfade slide carousel with autoplay, navigation dots, and arrows
 */
import { store, getContext } from '@wordpress/interactivity';

store('cesana/hero-banner', {
    state: {},
    actions: {
        nextSlide() {
            const ctx = getContext();
            const total = ctx.totalSlides;
            ctx.currentSlide = (ctx.currentSlide + 1) % total;
            ctx.autoplayPaused = false;
        },
        prevSlide() {
            const ctx = getContext();
            const total = ctx.totalSlides;
            ctx.currentSlide = (ctx.currentSlide - 1 + total) % total;
            ctx.autoplayPaused = false;
        },
        goToSlide() {
            const ctx = getContext();
            const el = event.currentTarget;
            const index = parseInt(el.dataset.slideIndex, 10);
            if (!isNaN(index)) {
                ctx.currentSlide = index;
                ctx.autoplayPaused = false;
            }
        },
        pauseAutoplay() {
            const ctx = getContext();
            ctx.autoplayPaused = true;
        },
        resumeAutoplay() {
            const ctx = getContext();
            ctx.autoplayPaused = false;
        },
    },
    callbacks: {
        initAutoplay() {
            const ctx = getContext();
            if (!ctx.autoplay || ctx.autoplay <= 0) return;

            const interval = setInterval(() => {
                if (!ctx.autoplayPaused) {
                    const total = ctx.totalSlides;
                    ctx.currentSlide = (ctx.currentSlide + 1) % total;
                }
            }, ctx.autoplay);

            return () => clearInterval(interval);
        },
    },
});
