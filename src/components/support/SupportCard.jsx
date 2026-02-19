import React from 'react';

import { cn } from '@/lib/utils';

export default function SupportCard({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-sm ring-1 ring-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
}
