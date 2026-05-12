import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  subMessage?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  message,
  subMessage,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className ?? ''}`}
    >
      <Icon className="mb-4 h-12 w-12 text-stone-300 dark:text-stone-600" strokeWidth={1.5} />
      <p className="text-base text-text-secondary">{message}</p>
      {subMessage && <p className="mt-1 text-[13px] text-text-tertiary">{subMessage}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
