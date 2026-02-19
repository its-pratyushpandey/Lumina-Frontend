import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function FaqAccordion({ items, defaultOpenId, className }) {
  const [openId, setOpenId] = React.useState(defaultOpenId ?? null);

  return (
    <div className={cn('divide-y divide-gray-100', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `faq-trigger-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <div key={item.id} className="py-2">
            <button
              id={triggerId}
              type="button"
              className="w-full flex items-start justify-between gap-4 rounded-xl px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="text-sm md:text-base font-medium text-gray-900">
                {item.question}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 text-sm leading-6 text-gray-600">
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
