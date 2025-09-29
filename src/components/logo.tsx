import Link from 'next/link';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-xl font-bold text-foreground',
        className
      )}
    >
      <div className="rounded-lg bg-primary p-2 text-primary-foreground">
        <DollarSign className="h-5 w-5" />
      </div>
      <span className="font-headline">FinTrackr</span>
    </Link>
  );
}
