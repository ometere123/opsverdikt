'use client';

import type { TaskRecord } from '@/lib/types';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

const impactColors: Record<string, string> = {
  CRITICAL: 'border-l-critical-red',
  HIGH: 'border-l-signal-amber',
  MEDIUM: 'border-l-electric-blue',
  LOW: 'border-l-system-green',
};

export function TaskSeverityStack({ tasks }: { tasks: TaskRecord[] }) {
  const sorted = [...tasks].sort((a, b) => {
    const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    return order.indexOf(a.SLA_impact) - order.indexOf(b.SLA_impact);
  });

  return (
    <div className="bg-panel-steel/30 rounded-lg border border-border-line p-3">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-electric-blue" />
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Task Severity Stack</h3>
        <span className="ml-auto font-mono text-[10px] text-muted-steel">{tasks.length} tasks</span>
      </div>
      <div className="space-y-1">
        {sorted.map((task) => (
          <div
            key={task.task_id}
            className={cn('border-l-2 pl-2 py-1 text-xs', impactColors[task.SLA_impact] ?? 'border-l-muted-steel')}
          >
            <div className="flex justify-between">
              <span className="text-text-primary font-medium">{task.task_title}</span>
              <span className="font-mono text-[10px] text-muted-steel">{task.SLA_impact}</span>
            </div>
            <div className="text-[10px] text-muted-steel">{task.department} · {task.deadline}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
