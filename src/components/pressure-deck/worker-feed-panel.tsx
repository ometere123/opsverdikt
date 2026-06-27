'use client';

import { useState, useCallback } from 'react';
import { WORKER_BASE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Radio, RefreshCw, AlertTriangle } from 'lucide-react';

export function WorkerFeedPanel() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'snapshot' | 'tasks' | 'cutoffs' | 'pressure'>('snapshot');

  const fetchFeed = useCallback(async (endpoint: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${WORKER_BASE_URL}/facilities/northdock-001/${endpoint}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ error: 'Worker feed unavailable' });
    } finally {
      setLoading(false);
    }
  }, []);

  const tabs = [
    { key: 'snapshot' as const, label: 'Snapshot', endpoint: 'snapshot' },
    { key: 'tasks' as const, label: 'Tasks', endpoint: 'tasks' },
    { key: 'cutoffs' as const, label: 'Cutoffs', endpoint: 'carrier-cutoffs' },
    { key: 'pressure' as const, label: 'Pressure', endpoint: 'pressure' },
  ];

  return (
    <div className="bg-panel-steel/30 rounded-lg border border-border-line">
      <div className="p-3 border-b border-border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-electric-blue" />
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Worker Signal Feed</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-steel">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
          DEMO FEED
        </div>
      </div>

      <div className="flex border-b border-border-line">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); fetchFeed(tab.endpoint); }}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-medium transition-colors',
              activeTab === tab.key
                ? 'text-electric-blue border-b-2 border-electric-blue bg-electric-blue/5'
                : 'text-muted-steel hover:text-text-secondary',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3 min-h-[120px]">
        {!data && !loading && (
          <p className="text-xs text-muted-steel text-center py-6">Select a feed to load demo data</p>
        )}
        {loading && (
          <div className="flex items-center justify-center py-6">
            <RefreshCw className="w-4 h-4 text-electric-blue animate-spin" />
          </div>
        )}
        {data && !loading && (
          <div className="relative">
            <div className="absolute top-0 right-0 flex items-center gap-1 text-[10px] text-signal-amber">
              <AlertTriangle className="w-2.5 h-2.5" /> Signal only - not canonical
            </div>
            <pre className="font-mono text-[11px] text-text-secondary whitespace-pre-wrap overflow-auto max-h-48 mt-4">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
