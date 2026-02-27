/**
 * Cesana Assicuratori Blocks — Advanced Animation Library
 * GSAP-inspired vanilla JS animations with premium easing and scroll-driven effects
 * 11 modules: ScrollReveal, TextReveal, ImageReveal, ScrollParallax, MagneticHover,
 *             StaggerReveal, TestimonialSlider, CounterAnimation, HeroBanner, FAQ, SmoothScroll
 */

(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ─── Utility: lerp ─── */
    const lerp = (a, b, t) => a + (b - a) * t;

    /* ─── Utility: clamp ─── */
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    /* ─── Utility: rAF throttle ─── */
    const rafThrottle = (fn) => {
        let ticking = false;
        return (...args) => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    fn(...args);
                    ticking = false;
                });
            }
        };
    };


    /* ═══════════════════════════════════════════════════════════════
       1. ScrollReveal — IntersectionObserver-based reveal animations
       ═══════════════════════════════════════════════════════════════ */
    const ScrollReveal = {
        init() {
            const elements = document.querySelectorAll('[data-ca-reveal]');
            if (!elements.length) return;

            if (prefersReducedMotion) {
                elements.forEach(el => el.classList.add('ca-revealed'));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.caRevealDelay) || 0;
                        setTimeout(() => entry.target.classList.add('ca-revealed'), delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

            elements.forEach(el => observer.observe(el));
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       2. TextReveal — Split-text animation (GSAP SplitText-like)
       Splits text into chars/words/lines, reveals with stagger
       Usage: data-ca-text-reveal="chars|words|lines"
       ═══════════════════════════════════════════════════════════════ */
    const TextReveal = {
        init() {
            const elements = document.querySelectorAll('[data-ca-text-reveal]');
            if (!elements.length) return;

            if (prefersReducedMotion) {
                elements.forEach(el => el.classList.add('ca-text-revealed'));
                return;
            }

            elements.forEach(el => {
                const mode = el.dataset.caTextReveal || 'words';
                this.split(el, mode);
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.caTextRevealDelay) || 0;
                        setTimeout(() => entry.target.classList.add('ca-text-revealed'), delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

            elements.forEach(el => observer.observe(el));
        },

        split(el, mode) {
            const text = el.textContent;
            el.setAttribute('aria-label', text);
            el.innerHTML = '';

            if (mode === 'chars') {
                // Split by characters, preserving spaces
                const chars = text.split('');
                let index = 0;
                chars.forEach(char => {
                    if (char === ' ') {
                        el.appendChild(document.createTextNode(' '));
                    } else {
                        const span = document.createElement('span');
                        span.className = 'ca-char';
                        span.textContent = char;
                        span.style.setProperty('--char-index', index);
                        span.setAttribute('aria-hidden', 'true');
                        el.appendChild(span);
                        index++;
                    }
                });
            } else if (mode === 'words') {
                const words = text.split(/\s+/);
                words.forEach((word, i) => {
                    if (i > 0) el.appendChild(document.createTextNode(' '));
                    const span = document.createElement('span');
                    span.className = 'ca-word';
                    span.textContent = word;
                    span.style.setProperty('--char-index', i);
                    span.setAttribute('aria-hidden', 'true');
                    el.appendChild(span);
                });
            } else if (mode === 'lines') {
                // Wrap each line — uses temporary measurement
                const words = text.split(/\s+/);
                const wrapper = document.createElement('span');
                wrapper.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap;';
                document.body.appendChild(wrapper);

                let lineIndex = 0;
                let currentLine = [];
                const lines = [];

                words.forEach(word => {
                    currentLine.push(word);
                    wrapper.textContent = currentLine.join(' ');
                    if (wrapper.offsetWidth > el.offsetWidth && currentLine.length > 1) {
                        currentLine.pop();
                        lines.push(currentLine.join(' '));
                        currentLine = [word];
                        lineIndex++;
                    }
                });
                if (currentLine.length) lines.push(currentLine.join(' '));
                document.body.removeChild(wrapper);

                lines.forEach((line, i) => {
                    const div = document.createElement('div');
                    div.className = 'ca-line-wrap';
                    const span = document.createElement('span');
                    span.className = 'ca-line';
                    span.textContent = line;
                    span.style.setProperty('--char-index', i);
                    span.setAttribute('aria-hidden', 'true');
                    div.appendChild(span);
                    el.appendChild(div);
                });
            }
        },

        /* Re-trigger text reveal on a specific element (used by HeroBanner) */
        revealElement(el) {
            el.classList.remove('ca-text-revealed');
            // Reset split spans
            const spans = el.querySelectorAll('.ca-char, .ca-word, .ca-line');
            spans.forEach(s => {
                s.style.removeProperty('transition');
            });
            // Force reflow
            void el.offsetHeight;
            el.classList.add('ca-text-revealed');
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       3. ImageReveal — Clip-path directional wipe reveal
       Usage: data-ca-image-reveal="left|right|up|down"
       ═══════════════════════════════════════════════════════════════ */
    const ImageReveal = {
        init() {
            const elements = document.querySelectorAll('[data-ca-image-reveal]');
            if (!elements.length) return;

            if (prefersReducedMotion) {
                elements.forEach(el => el.classList.add('ca-image-revealed'));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.caImageRevealDelay) || 0;
                        setTimeout(() => {
                            entry.target.classList.add('ca-image-revealed');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

            elements.forEach(el => observer.observe(el));
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       4. ScrollParallax — Scroll-linked parallax translations
       Usage: data-ca-parallax="0.3" (speed multiplier, negative = reverse)
       ═══════════════════════════════════════════════════════════════ */
    const ScrollParallax = {
        elements: [],
        active: false,

        init() {
            const els = document.querySelectorAll('[data-ca-parallax]');
            if (!els.length || prefersReducedMotion) return;

            this.elements = Array.from(els).map(el => ({
                el,
                speed: parseFloat(el.dataset.caParallax) || 0.3,
                inView: false
            }));

            // Observe visibility
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const item = this.elements.find(e => e.el === entry.target);
                    if (item) item.inView = entry.isIntersecting;
                });
                this.checkActive();
            }, { rootMargin: '100px 0px 100px 0px' });

            this.elements.forEach(item => observer.observe(item.el));

            // Scroll listener
            window.addEventListener('scroll', rafThrottle(() => this.onScroll()), { passive: true });
        },

        checkActive() {
            this.active = this.elements.some(e => e.inView);
        },

        onScroll() {
            if (!this.active) return;
            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            this.elements.forEach(item => {
                if (!item.inView) return;
                const rect = item.el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const offset = (centerY - vh / 2) * item.speed;
                item.el.style.transform = `translate3d(0, ${offset}px, 0)`;
            });
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       5. MagneticHover — Cursor-following magnetic effect on elements
       Usage: data-ca-magnetic (optionally data-ca-magnetic-strength="8")
       ═══════════════════════════════════════════════════════════════ */
    const MagneticHover = {
        init() {
            if (prefersReducedMotion || 'ontouchstart' in window) return;

            const elements = document.querySelectorAll('[data-ca-magnetic]');
            elements.forEach(el => {
                const strength = parseFloat(el.dataset.caMagneticStrength) || 8;
                let currentX = 0, currentY = 0;
                let targetX = 0, targetY = 0;
                let rafId = null;

                const animate = () => {
                    currentX = lerp(currentX, targetX, 0.15);
                    currentY = lerp(currentY, targetY, 0.15);

                    if (Math.abs(currentX - targetX) < 0.1 && Math.abs(currentY - targetY) < 0.1) {
                        currentX = targetX;
                        currentY = targetY;
                        el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                        rafId = null;
                        return;
                    }

                    el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                    rafId = requestAnimationFrame(animate);
                };

                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    targetX = clamp((e.clientX - cx) / rect.width * strength * 2, -strength, strength);
                    targetY = clamp((e.clientY - cy) / rect.height * strength * 2, -strength, strength);
                    if (!rafId) rafId = requestAnimationFrame(animate);
                });

                el.addEventListener('mouseleave', () => {
                    targetX = 0;
                    targetY = 0;
                    if (!rafId) rafId = requestAnimationFrame(animate);
                });
            });
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       6. StaggerReveal — Auto-stagger children on scroll
       Usage: data-ca-stagger (on parent), data-ca-stagger-delay="80"
       ═══════════════════════════════════════════════════════════════ */
    const StaggerReveal = {
        init() {
            const containers = document.querySelectorAll('[data-ca-stagger]');
            if (!containers.length) return;

            if (prefersReducedMotion) {
                containers.forEach(c => c.classList.add('ca-stagger-revealed'));
                return;
            }

            containers.forEach(container => {
                const delay = parseInt(container.dataset.caStaggerDelay) || 80;
                const children = container.children;
                Array.from(children).forEach((child, i) => {
                    child.style.setProperty('--stagger-index', i);
                    child.style.setProperty('--stagger-delay', delay + 'ms');
                });
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('ca-stagger-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            containers.forEach(c => observer.observe(c));
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       7. TestimonialSlider — Drag/swipe carousel with momentum
       Usage: data-ca-testimonial-slider on container
              data-ca-slider-track on the track element
              data-ca-slider-slide on each slide
       ═══════════════════════════════════════════════════════════════ */
    const TestimonialSlider = {
        init() {
            document.querySelectorAll('[data-ca-testimonial-slider]').forEach(container => {
                this.setup(container);
            });
        },

        setup(container) {
            const track = container.querySelector('[data-ca-slider-track]');
            const slides = container.querySelectorAll('[data-ca-slider-slide]');
            const dotsContainer = container.querySelector('[data-ca-slider-dots]');
            const prevBtn = container.querySelector('[data-ca-slider-prev]');
            const nextBtn = container.querySelector('[data-ca-slider-next]');

            if (!track || slides.length < 2) return;

            let current = 0;
            let isDragging = false;
            let startX = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;
            let dragVelocity = 0;
            let lastDragX = 0;
            let lastDragTime = 0;
            let autoTimer = null;
            const autoplayDelay = parseInt(container.dataset.caSliderAutoplay) || 6000;

            const getSlideWidth = () => {
                return slides[0].offsetWidth;
            };

            const setPosition = (animate = true) => {
                if (animate) {
                    track.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
                } else {
                    track.style.transition = 'none';
                }
                const offset = -(current * getSlideWidth());
                track.style.transform = `translate3d(${offset}px, 0, 0)`;
                currentTranslate = offset;
                prevTranslate = offset;
            };

            const goTo = (index) => {
                current = clamp(index, 0, slides.length - 1);
                setPosition(true);
                updateDots();
                updateSlideStates();
                resetAutoplay();
            };

            const updateSlideStates = () => {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('ca-testimonial-slide--active', i === current);
                    slide.classList.toggle('ca-testimonial-slide--prev', i === current - 1);
                    slide.classList.toggle('ca-testimonial-slide--next', i === current + 1);
                });
            };

            // Create dots
            const updateDots = () => {
                if (!dotsContainer) return;
                dotsContainer.querySelectorAll('button').forEach((dot, i) => {
                    dot.classList.toggle('ca-slider-dot--active', i === current);
                    dot.setAttribute('aria-current', i === current ? 'true' : 'false');
                });
            };

            if (dotsContainer) {
                slides.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.className = 'ca-slider-dot' + (i === 0 ? ' ca-slider-dot--active' : '');
                    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
                    if (i === 0) dot.setAttribute('aria-current', 'true');
                    dot.addEventListener('click', () => goTo(i));
                    dotsContainer.appendChild(dot);
                });
            }

            // Nav buttons
            if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
            if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

            // Drag handling
            const onDragStart = (clientX) => {
                isDragging = true;
                startX = clientX;
                lastDragX = clientX;
                lastDragTime = Date.now();
                dragVelocity = 0;
                track.style.transition = 'none';
                track.style.cursor = 'grabbing';
            };

            const onDragMove = (clientX) => {
                if (!isDragging) return;
                const now = Date.now();
                const dt = now - lastDragTime;
                if (dt > 0) {
                    dragVelocity = (clientX - lastDragX) / dt;
                }
                lastDragX = clientX;
                lastDragTime = now;

                const diff = clientX - startX;
                currentTranslate = prevTranslate + diff;
                track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
            };

            const onDragEnd = () => {
                if (!isDragging) return;
                isDragging = false;
                track.style.cursor = '';

                const slideWidth = getSlideWidth();
                const movedBy = currentTranslate - prevTranslate;

                // Use velocity for momentum
                if (Math.abs(dragVelocity) > 0.3) {
                    if (dragVelocity < 0) goTo(current + 1);
                    else goTo(current - 1);
                } else if (Math.abs(movedBy) > slideWidth * 0.2) {
                    if (movedBy < 0) goTo(current + 1);
                    else goTo(current - 1);
                } else {
                    goTo(current); // snap back
                }
            };

            // Mouse events
            track.addEventListener('mousedown', (e) => {
                e.preventDefault();
                onDragStart(e.clientX);
            });
            window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
            window.addEventListener('mouseup', onDragEnd);

            // Touch events
            track.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
            track.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
            track.addEventListener('touchend', onDragEnd, { passive: true });

            // Autoplay
            const resetAutoplay = () => {
                if (autoTimer) clearInterval(autoTimer);
                if (autoplayDelay > 0 && !prefersReducedMotion) {
                    autoTimer = setInterval(() => {
                        goTo(current < slides.length - 1 ? current + 1 : 0);
                    }, autoplayDelay);
                }
            };

            container.addEventListener('mouseenter', () => autoTimer && clearInterval(autoTimer));
            container.addEventListener('mouseleave', resetAutoplay);

            // Init
            updateSlideStates();
            setPosition(false);
            resetAutoplay();
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       8. CounterAnimation — Animated count-up for statistics
       ═══════════════════════════════════════════════════════════════ */
    const CounterAnimation = {
        init() {
            const counters = document.querySelectorAll('[data-ca-counter]');
            if (!counters.length) return;

            if (prefersReducedMotion) {
                counters.forEach(el => { el.textContent = el.dataset.caCounter; });
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(el => observer.observe(el));
        },

        animate(el) {
            const target = parseInt(el.dataset.caCounter, 10);
            if (isNaN(target)) return;

            const duration = 2000;
            const start = performance.now();

            const step = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            };

            requestAnimationFrame(step);
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       9. HeroBanner — Enhanced crossfade carousel with text reveals
       ═══════════════════════════════════════════════════════════════ */
    const HeroBanner = {
        init() {
            document.querySelectorAll('[data-ca-hero-banner]').forEach(carousel => {
                const slides = carousel.querySelectorAll('[data-ca-hero-slide]');
                const dots = carousel.querySelector('[data-ca-hero-dots]');
                const prev = carousel.querySelector('[data-ca-hero-prev]');
                const next = carousel.querySelector('[data-ca-hero-next]');

                if (slides.length < 2) return;

                let current = 0;
                let timer = null;
                const autoplay = parseInt(carousel.dataset.caHeroAutoplay) || 8000;

                const goTo = (index) => {
                    slides[current].classList.remove('ca-hero-slide--active');
                    current = (index + slides.length) % slides.length;
                    slides[current].classList.add('ca-hero-slide--active');

                    // Restart Ken Burns animation
                    const img = slides[current].querySelector('.ca-hero-slide__bg img');
                    if (img) {
                        img.style.animation = 'none';
                        void img.offsetHeight;
                        img.style.animation = '';
                    }

                    // Re-trigger text reveals on new slide
                    const textEls = slides[current].querySelectorAll('[data-ca-text-reveal]');
                    textEls.forEach(el => TextReveal.revealElement(el));

                    if (dots) {
                        dots.querySelectorAll('button').forEach((d, i) => {
                            d.classList.toggle('ca-hero-dot--active', i === current);
                            d.setAttribute('aria-current', i === current ? 'true' : 'false');
                        });
                    }

                    resetTimer();
                };

                const resetTimer = () => {
                    if (timer) clearInterval(timer);
                    if (autoplay > 0) timer = setInterval(() => goTo(current + 1), autoplay);
                };

                if (dots) {
                    slides.forEach((_, i) => {
                        const btn = document.createElement('button');
                        btn.className = 'ca-hero-dot' + (i === 0 ? ' ca-hero-dot--active' : '');
                        btn.setAttribute('aria-label', 'Slide ' + (i + 1));
                        if (i === 0) btn.setAttribute('aria-current', 'true');
                        btn.addEventListener('click', () => goTo(i));
                        dots.appendChild(btn);
                    });
                }

                if (prev) prev.addEventListener('click', () => goTo(current - 1));
                if (next) next.addEventListener('click', () => goTo(current + 1));

                // Touch support
                let startX = 0;
                carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
                carousel.addEventListener('touchend', e => {
                    const diff = startX - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
                }, { passive: true });

                carousel.addEventListener('mouseenter', () => timer && clearInterval(timer));
                carousel.addEventListener('mouseleave', resetTimer);

                slides[0].classList.add('ca-hero-slide--active');
                resetTimer();

                // Init text reveals on first slide
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        const textEls = slides[0].querySelectorAll('[data-ca-text-reveal]');
                        textEls.forEach(el => TextReveal.revealElement(el));
                    }, 300);
                }
            });
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       10. FAQ Accordion
       ═══════════════════════════════════════════════════════════════ */
    const FAQ = {
        init() {
            document.querySelectorAll('[data-ca-faq]').forEach(container => {
                const items = container.querySelectorAll('[data-ca-faq-item]');

                items.forEach(item => {
                    const trigger = item.querySelector('[data-ca-faq-trigger]');
                    const content = item.querySelector('[data-ca-faq-content]');
                    if (!trigger || !content) return;

                    trigger.addEventListener('click', () => {
                        const isOpen = item.classList.contains('ca-faq__item--open');

                        if (container.dataset.caFaqMultiple !== 'true') {
                            items.forEach(i => {
                                i.classList.remove('ca-faq__item--open');
                                const t = i.querySelector('[data-ca-faq-trigger]');
                                const c = i.querySelector('[data-ca-faq-content]');
                                if (t) t.setAttribute('aria-expanded', 'false');
                                if (c) c.style.maxHeight = '0';
                            });
                        }

                        if (!isOpen) {
                            item.classList.add('ca-faq__item--open');
                            trigger.setAttribute('aria-expanded', 'true');
                            content.style.maxHeight = content.scrollHeight + 'px';
                        } else {
                            item.classList.remove('ca-faq__item--open');
                            trigger.setAttribute('aria-expanded', 'false');
                            content.style.maxHeight = '0';
                        }
                    });
                });
            });
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       11. SmoothScroll — Anchor link smooth scrolling
       ═══════════════════════════════════════════════════════════════ */
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId === '#' || targetId.length < 2) return;

                    const target = document.querySelector(targetId);
                    if (!target) return;

                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                });
            });
        }
    };


    /* ═══════════════════════════════════════════════════════════════
       12. PageLoader — Animated splash screen (once per session)
       ═══════════════════════════════════════════════════════════════ */
    const PageLoader = {
        init() {
            const loader = document.querySelector('[data-ca-page-loader]');
            if (!loader) return;

            // Only show once per session
            if (sessionStorage.getItem('ca-loader-shown')) {
                loader.remove();
                return;
            }

            const duration = parseInt(loader.dataset.caLoaderDuration) || 2800;

            // Prevent scrolling while loader is active
            document.documentElement.style.overflow = 'hidden';

            // Run entrance animation
            requestAnimationFrame(() => {
                loader.classList.add('ca-page-loader--active');
            });

            // Start exit after duration
            setTimeout(() => {
                loader.classList.add('ca-page-loader--exit');
                document.documentElement.style.overflow = '';
            }, duration);

            // Remove from DOM after exit animation
            setTimeout(() => {
                loader.remove();
                sessionStorage.setItem('ca-loader-shown', '1');
            }, duration + 800);
        }
    };


    /* ─── Initialize All Modules ─── */
    const init = () => {
        PageLoader.init();
        ScrollReveal.init();
        TextReveal.init();
        ImageReveal.init();
        ScrollParallax.init();
        MagneticHover.init();
        StaggerReveal.init();
        TestimonialSlider.init();
        CounterAnimation.init();
        HeroBanner.init();
        FAQ.init();
        SmoothScroll.init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.CesanaBlocks = { init, TextReveal, ImageReveal, TestimonialSlider, PageLoader };
})();
