import type { ClaimStatus } from '@/shared/types';

export interface TimelineEntry {
  date: string;
  actor: string;
  description: string;
  status: ClaimStatus;
}

interface TimelineProps {
  entries: TimelineEntry[];
  currentStatus?: ClaimStatus;
}

const dotColors: Record<ClaimStatus, string> = {
  Pending: 'bg-amber-500',
  Approved: 'bg-emerald-500',
  Rejected: 'bg-stone-300',
  Cancelled: 'bg-stone-300',
};

function formatTimelineDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Timeline({ entries, currentStatus }: TimelineProps) {
  return (
    <div className="relative pl-6">
      <div className="absolute bottom-0 left-[9px] top-2 w-px bg-stone-200" />
      <div className="flex flex-col gap-4">
        {entries.map((entry, index) => {
          const isCurrent = currentStatus && entry.status === currentStatus && index === entries.length - 1;

          return (
            <div key={`${entry.date}-${index}`} className="relative">
              <div
                className={`absolute -left-6 top-1 h-[10px] w-[10px] rounded-full ${
                  dotColors[entry.status]
                } ${isCurrent ? 'ring-4 ring-amber-100' : ''}`}
              />
              <div className="pb-1">
                <time className="text-xs text-text-tertiary">
                  {formatTimelineDate(entry.date)}
                </time>
                <p className="text-sm font-semibold text-stone-900">{entry.actor}</p>
                <p className="text-sm text-stone-600">{entry.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
