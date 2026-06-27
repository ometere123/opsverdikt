interface Env {
  ENVIRONMENT: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

const FACILITIES = [
  {
    id: 'northdock-001',
    name: 'NorthDock Fulfillment Hub',
    type: 'E-commerce fulfillment centre',
    location: 'Zone A, Industrial District',
    status: 'ACTIVE',
  },
];

const DEMO_SNAPSHOT = {
  facility_id: 'northdock-001',
  timestamp: new Date().toISOString(),
  zones: [
    { name: 'Outbound', pressure: 'CRITICAL', task_count: 38, blockers: 2, workers: 4 },
    { name: 'Inbound', pressure: 'MODERATE', task_count: 12, blockers: 0, workers: 0 },
    { name: 'Replenishment', pressure: 'HIGH', task_count: 8, blockers: 3, workers: 1 },
    { name: 'Staging', pressure: 'HIGH', task_count: 6, blockers: 1, workers: 0 },
    { name: 'Exceptions', pressure: 'MODERATE', task_count: 5, blockers: 2, workers: 1 },
    { name: 'Cold-chain', pressure: 'HIGH', task_count: 12, blockers: 1, workers: 0 },
    { name: 'Dock', pressure: 'MODERATE', task_count: 3, blockers: 0, workers: 1 },
  ],
  total_orders: 142,
  premium_orders: 38,
  cold_chain_orders: 12,
  available_workers: 7,
  equipment: { pallet_jacks: 2, scanners_degraded: 1, cold_chain_capacity_pct: 85 },
};

const DEMO_TASKS = [
  { task_id: 'task_001', title: 'Pick and pack premium outbound orders', type: 'PICKING', department: 'Outbound', deadline: '90 min', sla_impact: 'HIGH', priority: 'PREMIUM' },
  { task_id: 'task_002', title: 'Unblock replenishment queue', type: 'REPLENISHMENT', department: 'Replenishment', deadline: '60 min', sla_impact: 'MEDIUM', priority: 'INTERNAL' },
  { task_id: 'task_003', title: 'Resolve exception orders', type: 'EXCEPTION', department: 'Exceptions', deadline: '120 min', sla_impact: 'MEDIUM', priority: 'MIXED' },
  { task_id: 'task_004', title: 'Stage dock for carrier pickup', type: 'STAGING', department: 'Dock', deadline: '75 min', sla_impact: 'HIGH', priority: 'PREMIUM' },
  { task_id: 'task_005', title: 'Cold-chain dispatch', type: 'DISPATCH', department: 'Cold-chain', deadline: '60 min', sla_impact: 'CRITICAL', priority: 'PREMIUM' },
];

const DEMO_CUTOFFS = [
  { carrier: 'Premium Express', cutoff_time: '19:30', minutes_remaining: 90, status: 'URGENT', flexibility: 'NONE' },
  { carrier: 'Standard Freight', cutoff_time: '22:00', minutes_remaining: 240, status: 'OK', flexibility: 'LOW' },
  { carrier: 'Cold-Chain Special', cutoff_time: '19:00', minutes_remaining: 60, status: 'CRITICAL', flexibility: 'NONE' },
];

const DEMO_PRESSURE = {
  facility_id: 'northdock-001',
  overall_pressure: 'CRITICAL',
  sla_risk: 'HIGH',
  bottleneck_risk: 'HIGH',
  worker_utilization: '100%',
  equipment_health: 'DEGRADED',
  top_risk: 'Premium carrier cutoff in 90 minutes with blocked replenishment queue',
  recommended_action: 'Split labor: protect outbound while unblocking replenishment',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // GET /health
    if (path === '/health') {
      return json({ status: 'ok', service: 'ops-signal-adapter', role: 'PUBLIC_SIGNAL_ADAPTER_ONLY', timestamp: new Date().toISOString() });
    }

    // GET /facilities
    if (path === '/facilities') {
      return json({ facilities: FACILITIES, disclaimer: 'Demo data only. This worker does not store canonical state.' });
    }

    // GET /facilities/:id/snapshot
    const snapshotMatch = path.match(/^\/facilities\/([^/]+)\/snapshot$/);
    if (snapshotMatch) {
      return json({ ...DEMO_SNAPSHOT, facility_id: snapshotMatch[1], disclaimer: 'Signal feed only — not canonical state' });
    }

    // GET /facilities/:id/tasks
    const tasksMatch = path.match(/^\/facilities\/([^/]+)\/tasks$/);
    if (tasksMatch) {
      return json({ tasks: DEMO_TASKS, facility_id: tasksMatch[1], disclaimer: 'Demo task list — canonical tasks are stored in the GenLayer contract' });
    }

    // GET /facilities/:id/carrier-cutoffs
    const cutoffsMatch = path.match(/^\/facilities\/([^/]+)\/carrier-cutoffs$/);
    if (cutoffsMatch) {
      return json({ cutoffs: DEMO_CUTOFFS, facility_id: cutoffsMatch[1], disclaimer: 'Demo carrier cutoff feed' });
    }

    // GET /facilities/:id/pressure
    const pressureMatch = path.match(/^\/facilities\/([^/]+)\/pressure$/);
    if (pressureMatch) {
      return json({ ...DEMO_PRESSURE, facility_id: pressureMatch[1], disclaimer: 'Signal pressure reading — not a canonical verdict' });
    }

    // POST /evidence-preview
    if (path === '/evidence-preview' && request.method === 'POST') {
      const body = await request.json() as { url?: string };
      return json({
        url: body.url ?? 'unknown',
        preview: { accessible: true, content_type: 'application/json', size_estimate: '2.4KB' },
        disclaimer: 'Preview only — evidence must be verified by GenLayer validators',
      });
    }

    // POST /packet-preview
    if (path === '/packet-preview' && request.method === 'POST') {
      return json({
        packet: {
          snapshot: DEMO_SNAPSHOT,
          tasks: DEMO_TASKS,
          cutoffs: DEMO_CUTOFFS,
          pressure: DEMO_PRESSURE,
        },
        disclaimer: 'Assembled demo packet — does not replace contract state. For preview purposes only.',
      });
    }

    return json({ error: 'Not found' }, 404);
  },
};
