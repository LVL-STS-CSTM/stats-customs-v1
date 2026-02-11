
import { useState, useEffect, RefObject } from 'react';

/**
 * @description A custom hook that uses the Intersection Observer API to detect 
 * when an element enters the viewport.
 * @param ref - A React ref object pointing to the element to observe.
 * @param rootMargin - Margin around the root (viewport) for intersection triggers.
 * @returns {boolean} True if the element is currently visible in the viewport.
 */
export const useOnScreen = (
    ref: RefObject<HTMLElement | null>, 
    rootMargin: string = '0px 0px -150px 0px'
): boolean => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIntersecting(true);
                    // Once visible, we can unobserve if we only need a one-time trigger
                    observer.unobserve(currentRef);
                }
            },
            { rootMargin }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, rootMargin]);

    return isIntersecting;
};
