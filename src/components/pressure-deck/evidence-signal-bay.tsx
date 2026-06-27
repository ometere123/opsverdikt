'use client';

import { ExternalLink, FileText, Hash, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryColors: Record<string, string> = {
  ORDER_DATA: 'text-electric-blue',
  INVENTORY_DATA: 'text-signal-amber',
  CARRIER_DATA: 'text-cold-chain-cyan',
  STAFFING_DATA: 'text-fatigue-violet',
  INCIDENT_REPORT: 'text-critical-red',
};

export function EvidenceSignalBay({ evidence }: { evidence: any[] }) {
  return (
    <div className="bg-dark-graphite border-t border-border-line">
      <div className="p-4 border-b border-border-line flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">
            Evidence Signal Bay
          </h2>
          <p className="text-xs text-muted-steel mt-0.5">{evidence.length} evidence records registered</p>
        </div>
        <Shield className="w-4 h-4 text-electric-blue" />
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {evidence.map((ev) => (
          <div key={ev.evidence_id} className="border border-border-line rounded-md p-2.5 bg-panel-steel/30">
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-xs font-semibold text-text-primary leading-tight">{ev.evidence_title}</h4>
              <span className={cn('text-[10px] font-mono uppercase', categoryColors[ev.evidence_category] ?? 'text-muted-steel')}>
                {ev.evidence_type}
              </span>
            </div>
            <p className="text-[10px] text-text-secondary mb-1.5">{ev.relevance_to_operational_question}</p>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-muted-steel flex items-center gap-0.5">
                <Hash className="w-2.5 h-2.5" />{ev.evidence_hash?.slice(0, 8)}
              </span>
              <span className="text-muted-steel">{ev.source_name}</span>
              {ev.evidence_url && (
                <a
                  href={ev.evidence_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline flex items-center gap-0.5 ml-auto"
                >
                  <ExternalLink className="w-2.5 h-2.5" /> View
                </a>
              )}
            </div>
          </div>
        ))}
        {evidence.length === 0 && (
          <p className="text-xs text-muted-steel text-center py-6 col-span-full">No evidence registered</p>
        )}
      </div>
    </div>
  );
}
