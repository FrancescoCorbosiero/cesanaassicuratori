/**
 * cesana/testimonials-slider — Frontend Interactivity
 * Uses WordPress Interactivity API (wp-interactivity)
 * Drag/swipe testimonial carousel with dots and arrows
 */
import { store, getContext } from '@wordpress/interactivity';

store('cesana/testimonials-slider', {
    state: {},
    actions: {
        nextSlide() {
            const ctx = getContext();
            ctx.currentSlide = (ctx.currentSlide + 1) % ctx.totalSlides;
        },
        prevSlide() {
            const ctx = getContext();
            ctx.currentSlide = (ctx.currentSlide - 1 + ctx.totalSlides) % ctx.totalSlides;
        },
        goToSlide() {
            const ctx = getContext();
            const el = event.currentTarget;
            const index = parseInt(el.dataset.slideIndex, 10);
            if (!isNaN(index)) {
                ctx.currentSlide = index;
            }
        },
        onPointerDown(event) {
            const ctx = getContext();
            ctx.isDragging = true;
            ctx.startX = event.clientX || event.touches?.[0]?.clientX || 0;
            ctx.dragOffset = 0;
        },
        onPointerMove(event) {
            const ctx = getContext();
            if (!ctx.isDragging) return;
            var clientX = event.clientX || event.touches?.[0]?.clientX || 0;
            ctx.dragOffset = clientX - ctx.startX;
        },
        onPointerUp() {
            const ctx = getContext();
            if (!ctx.isDragging) return;
            ctx.isDragging = false;

            var threshold = 50;
            if (ctx.dragOffset < -threshold) {
                ctx.currentSlide = (ctx.currentSlide + 1) % ctx.totalSlides;
            } else if (ctx.dragOffset > threshold) {
                ctx.currentSlide = (ctx.currentSlide - 1 + ctx.totalSlides) % ctx.totalSlides;
            }
            ctx.dragOffset = 0;
        },
    },
    callbacks: {
        updateTrackPosition() {
            const ctx = getContext();
            var offset = -(ctx.currentSlide * 100);
            if (ctx.isDragging && ctx.dragOffset) {
                var pxOffset = ctx.dragOffset;
                ctx.trackTransform = 'translateX(calc(' + offset + '% + ' + pxOffset + 'px))';
            } else {
                ctx.trackTransform = 'translateX(' + offset + '%)';
            }
        },
    },
});
