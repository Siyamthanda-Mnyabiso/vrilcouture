// src/hooks/useParallax.ts
import { useEffect, useRef, useState } from 'react';

// Tracks an element's position relative to viewport center and turns it
// into a scroll-driven offset, for a classic "background moves slower
// than scroll" parallax effect. Skips animating for users who've asked
// for reduced motion.
//
// `ref` must be attached to a stable element that never itself receives
// the resulting transform (e.g. the section container) — applying the
// transform to the same element being measured creates a feedback loop.
//
// The offset is clamped to `maxOffsetRatio * element height` so a caller
// that oversizes its transformed child by the same ratio (e.g. inset
// -30%/height 160% for maxOffsetRatio 0.3) is guaranteed never to reveal
// a gap, regardless of viewport size.
export function useParallax<T extends HTMLElement>(speed = 0.2, maxOffsetRatio = 0.3) {
    const ref = useRef<T | null>(null);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        let ticking = false;

        const update = () => {
            const rect = element.getBoundingClientRect();
            const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
            const maxOffset = rect.height * maxOffsetRatio;
            const clamped = Math.max(-maxOffset, Math.min(maxOffset, distanceFromCenter * speed));
            setOffset(clamped);
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [speed, maxOffsetRatio]);

    return { ref, offset };
}
