import { readContract, writeContract } from './genlayer-client';
import type { FullCaseData } from './types';

export async function createCase(params: {
  title: string; facility_name: string; facility_type: string;
  shift_name: string; business_objective: string; pressure_level: number;
  shift_start: string; shift_end: string; decision_deadline: string;
  available_workers: number; worker_skill_summary: string; equipment_constraints: string;
  supervisor_notes: string; operational_hypothesis: string;
}) {
  return writeContract('create_case', [
    params.title, params.facility_name, params.facility_type,
    params.shift_name, params.business_objective, params.pressure_level,
    params.shift_start, params.shift_end, params.decision_deadline,
    params.available_workers, params.worker_skill_summary, params.equipment_constraints,
    params.supervisor_notes, params.operational_hypothesis,
  ]);
}

export async function addTask(params: {
  case_id: number; title: string; task_type: string; department: string;
  deadline: string; sla_impact: string; customer_priority: string;
  estimated_effort: string; required_skill: string; required_equipment: string;
  dependency: string; delay_risk: string; safety_note: string; status_at_submission: string;
}) {
  return writeContract('add_task', [
    params.case_id, params.title, params.task_type, params.department,
    params.deadline, params.sla_impact, params.customer_priority,
    params.estimated_effort, params.required_skill, params.required_equipment,
    params.dependency, params.delay_risk, params.safety_note, params.status_at_submission,
  ]);
}

export async function addLaborPlan(params: {
  case_id: number; title: string; allocation_summary: string;
  workers_by_function: string; priority_task_order: string; tasks_to_delay: string;
  expected_upside: string; operational_risks: string; bottleneck_assumptions: string;
  sla_assumptions: string; safety_assumptions: string; failure_conditions: string;
}) {
  return writeContract('add_labor_plan', [
    params.case_id, params.title, params.allocation_summary,
    params.workers_by_function, params.priority_task_order, params.tasks_to_delay,
    params.expected_upside, params.operational_risks, params.bottleneck_assumptions,
    params.sla_assumptions, params.safety_assumptions, params.failure_conditions,
  ]);
}

export async function addEvidence(params: {
  case_id: number; title: string; evidence_type: string; url: string;
  evidence_hash: string; source_name: string; source_credibility: string;
  relevance: string; related_task_ids: string; related_plan_ids: string; category: string;
}) {
  return writeContract('add_evidence', [
    params.case_id, params.title, params.evidence_type, params.url,
    params.evidence_hash, params.source_name, params.source_credibility,
    params.relevance, params.related_task_ids, params.related_plan_ids, params.category,
  ]);
}

export async function requestVerdikt(caseId: number) {
  return writeContract('request_verdikt', [caseId]);
}

export async function getCaseCount(): Promise<number> {
  const result = await readContract('get_case_count');
  return Number(result);
}

export async function getCase(caseId: number): Promise<any> {
  const result = await readContract('get_case', [caseId]);
  return JSON.parse(result as string);
}

export async function getCaseSummary(caseId: number): Promise<any> {
  const result = await readContract('get_case_summary', [caseId]);
  return JSON.parse(result as string);
}

export async function getCaseTasks(caseId: number): Promise<any[]> {
  const result = await readContract('get_case_tasks', [caseId]);
  return JSON.parse(result as string);
}

export async function getCasePlans(caseId: number): Promise<any[]> {
  const result = await readContract('get_case_plans', [caseId]);
  return JSON.parse(result as string);
}

export async function getCaseEvidence(caseId: number): Promise<any[]> {
  const result = await readContract('get_case_evidence', [caseId]);
  return JSON.parse(result as string);
}

export async function getCaseVerdikts(caseId: number): Promise<any[]> {
  const result = await readContract('get_case_verdikts', [caseId]);
  return JSON.parse(result as string);
}

export async function getOwnerCases(owner: string): Promise<any[]> {
  const result = await readContract('get_owner_cases', [owner]);
  return JSON.parse(result as string);
}

export async function getFullCase(caseId: number): Promise<FullCaseData> {
  const [caseData, tasks, plans, evidence, verdikts] = await Promise.all([
    getCase(caseId),
    getCaseTasks(caseId).catch(() => []),
    getCasePlans(caseId).catch(() => []),
    getCaseEvidence(caseId).catch(() => []),
    getCaseVerdikts(caseId).catch(() => []),
  ]);

  const verdict = verdikts.length > 0 ? verdikts[verdikts.length - 1] : null;

  return {
    case: caseData,
    snapshots: [],
    tasks,
    plans,
    evidence,
    verdict,
  };
}

export async function listAllCases(): Promise<any[]> {
  const count = await getCaseCount();
  if (count === 0) return [];

  const summaries = [];
  for (let i = 0; i < count; i++) {
    try {
      const summary = await getCaseSummary(i);
      summaries.push({ ...summary, case_id: i });
    } catch {
      // skip failed reads
    }
  }
  return summaries;
}
