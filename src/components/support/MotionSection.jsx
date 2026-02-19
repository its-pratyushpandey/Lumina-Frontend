import React from 'react';
import { motion } from 'framer-motion';

export default function MotionSection({ children, className, as = 'section' }) {
  const Comp =
    as === 'div'
      ? motion.div
      : as === 'header'
        ? motion.header
        : as === 'main'
          ? motion.main
          : as === 'article'
            ? motion.article
            : motion.section;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      {children}
    </Comp>
  );
}
