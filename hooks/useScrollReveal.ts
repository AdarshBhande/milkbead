"use client";

import { useEffect } from "react";

/**
 * Attaches an IntersectionObserver to all elements matching the reveal
 * CSS classes and toggles the `visible` class when they enter the viewport.
 * Also uses a MutationObserver to pick up dynamically added elements
 * (e.g. products that load from Firestore after mount).
 */
export function useScrollReveal(threshold = 0.15) {
  useEffect(() => {
    const SELECTOR = ".reveal, .reveal-left, .reveal-right, .reveal-zoom";

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    /** Observe a single element if not already observed */
    const observeEl = (el: HTMLElement) => {
      // If already visible, skip
      if (!el.classList.contains("visible")) {
        intersectionObserver.observe(el);
      }
    };

    /** Scan the whole document for reveal elements */
    const scanAll = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(observeEl);
    };

    // Initial scan
    scanAll();

    // Re-scan whenever DOM changes (handles async-loaded products)
    const mutationObserver = new MutationObserver(() => scanAll());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [threshold]);
}
