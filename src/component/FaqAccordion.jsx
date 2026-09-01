"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { inter } from "@/app/fonts";
import { faqs } from "@/data/faq";

// W3C APG accordion pattern: h3 > button[aria-expanded][aria-controls],
// panel with role="region" + aria-labelledby. Multiple panels may be open.
// Panels unmount on close (AnimatePresence), so closed content is out of
// the tab order and the accessibility tree automatically.
const FaqAccordion = () => {
  const [openItems, setOpenItems] = useState(() => new Set());
  const prefersReducedMotion = useReducedMotion();

  const toggle = (index) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openItems.has(index);
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div
            key={faq.q}
            className="rounded-xl border border-neutral-700/60 bg-neutral-800/30 overflow-hidden"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={`${inter.className} w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-neutral-100 hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer`}
              >
                {faq.q}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }
                  }
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <FiChevronDown className="w-4 h-4 text-neutral-400" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={
                    prefersReducedMotion ? false : { height: 0, opacity: 0 }
                  }
                  animate={{ height: "auto", opacity: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p
                    className={`${inter.className} px-5 pb-4 text-sm text-[#A8ADB2] leading-relaxed`}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
