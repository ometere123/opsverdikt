'use client';

import { AlertTriangle } from 'lucide-react';

export function PublicEvidenceWarning() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-signal-amber/30 bg-signal-amber/5 px-3 py-2 text-xs text-signal-amber">
      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <span>
        All evidence URLs must be publicly accessible. Private files, internal dashboards, or authenticated endpoints
        cannot be verified by GenLayer validators. Use only public data sources.
      </span>
    </div>
  );
}
