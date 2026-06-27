'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Shield, ArrowLeft, Info } from 'lucide-react';

export default function SnapshotPage() {
  const { caseId } = useParams() as { caseId: string };

  return (
    <div className="min-h-screen bg-floor-black">
      <header className="flex items-center gap-3 px-6 py-3 border-b border-border-line bg-dark-graphite">
        <Link href={`/ops/${caseId}`} className="text-muted-steel hover:text-text-secondary"><ArrowLeft className="w-4 h-4" /></Link>
        <Shield className="w-4 h-4 text-signal-amber" />
        <span className="font-display text-sm font-bold text-text-primary">Shift Snapshot</span>
        <span className="font-mono text-[10px] text-muted-steel">#{caseId}</span>
      </header>
      <div className="max-w-3xl mx-auto p-6 text-center py-12">
        <Info className="w-8 h-8 text-electric-blue mx-auto mb-3" />
        <p className="text-text-secondary">Shift snapshot data is captured as part of the case creation.</p>
        <p className="text-xs text-muted-steel mt-2">Use the Task Queue, Labor Plans, and Evidence pages to add operational data.</p>
        <Link href={`/ops/${caseId}`} className="inline-block mt-4 text-xs text-electric-blue hover:underline">Back to Case</Link>
      </div>
    </div>
  );
}
