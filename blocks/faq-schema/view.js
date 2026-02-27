/**
 * cesana/faq-schema — Frontend Interactivity
 * Uses WordPress Interactivity API (wp-interactivity)
 * Accordion expand/collapse with smooth height animation
 */
import { store, getContext } from '@wordpress/interactivity';

store('cesana/faq-schema', {
    state: {},
    actions: {
        toggle() {
            const ctx = getContext();
            const parentCtx = getContext('cesana/faq-schema');

            if (ctx.isOpen) {
                ctx.isOpen = false;
                ctx.contentHeight = '0px';
            } else {
                // Close others if allowMultiple is false
                if (!parentCtx.allowMultiple && parentCtx.items) {
                    parentCtx.items.forEach(function(item) {
                        if (item !== ctx) {
                            item.isOpen = false;
                            item.contentHeight = '0px';
                        }
                    });
                }
                ctx.isOpen = true;
                ctx.contentHeight = ctx.scrollHeight + 'px';
            }
        },
    },
    callbacks: {
        measureHeight() {
            const ctx = getContext();
            const el = event?.target;
            if (el) {
                ctx.scrollHeight = el.scrollHeight;
            }
        },
    },
});
