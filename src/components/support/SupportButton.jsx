import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SupportButton({ variant = 'primary', className, ...props }) {
  const styles =
    variant === 'secondary'
      ? 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
      : 'bg-black text-white hover:bg-black/90';

  return (
    <Button
      className={cn(
        'rounded-xl shadow-sm focus-visible:ring-black/20',
        styles,
        className
      )}
      {...props}
    />
  );
}
