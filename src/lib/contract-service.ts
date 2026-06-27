import { readContract, writeContract } from './genlayer-client';
import type { FullCaseData } from './types';

export async function createOperationsCase(
  account: `0x${string}`,
  params: {
    case_id: string; case_title: string; facility_name: string; facility_type: string;
    shift_name: string; business_objective: string; current_pressure_level: string;
    shift_start_time: string; shift_end_time: string; decision_deadline: string;
    available_workers: string; worker_skill_summary: string; equipment_constraints: string;
    supervisor_notes: string; current_operational_hypothesis: string;
  },
) {
  return writeContract(account, 'create_operations_case', [
    params.case_id, params.case_title, params.facility_name, params.facility_type,
    params.shift_name, params.business_objective, params.current_pressure_level,
    params.shift_start_time, params.shift_end_time, params.decision_deadline,
    params.available_workers, params.worker_skill_summary, params.equipment_constraints,
    params.supervisor_notes, params.current_operational_hypothesis,
  ]);
}

export async function addShiftSnapshot(
  account: `0x${string}`,
  params: {
    case_id: string; snapshot_id: string; snapshot_title: string;
    facility_zone_summary: string; active_orders_summary: string; staffing_summary: string;
    equipment_status: string; current_bottlenecks: string; carrier_cutoff_summary: string;
    SLA_pressure_summary: string; safety_or_fatigue_notes: string;
    source_url: string; source_hash: string;
  },
) {
  return writeContract(account, 'add_shift_snapshot', [
    params.case_id, params.snapshot_id, params.snapshot_title,
    params.facility_zone_summary, params.active_orders_summary, params.staffing_summary,
    params.equipment_status, params.current_bottlenecks, params.carrier_cutoff_summary,
    params.SLA_pressure_summary, params.safety_or_fatigue_notes,
    params.source_url, params.source_hash,
  ]);
}

export async function addTaskRecord(
  account: `0x${string}`,
  params: {
    case_id: string; task_id: string; task_title: string; task_type: string;
    department: string; deadline: string; SLA_impact: string; customer_priority: string;
    estimated_effort: string; required_skill: string; required_equipment: string;
    dependency: string; delay_risk: string; safety_note: string; status_at_submission: string;
  },
) {
  return writeContract(account, 'add_task_record', [
    params.case_id, params.task_id, params.task_title, params.task_type,
    params.department, params.deadline, params.SLA_impact, params.customer_priority,
    params.estimated_effort, params.required_skill, params.required_equipment,
    params.dependency, params.delay_risk, params.safety_note, params.status_at_submission,
  ]);
}

export async function addLaborPlanOption(
  account: `0x${string}`,
  params: {
    case_id: string; plan_id: string; plan_title: string;
    labor_allocation_summary: string; workers_assigned_by_function: string;
    priority_task_order: string; tasks_to_delay: string; expected_upside: string;
    key_operational_risks: string; bottleneck_assumptions: string;
    SLA_assumptions: string; safety_or_fatigue_assumptions: string; failure_conditions: string;
  },
) {
  return writeContract(account, 'add_labor_plan_option', [
    params.case_id, params.plan_id, params.plan_title,
    params.labor_allocation_summary, params.workers_assigned_by_function,
    params.priority_task_order, params.tasks_to_delay, params.expected_upside,
    params.key_operational_risks, params.bottleneck_assumptions,
    params.SLA_assumptions, params.safety_or_fatigue_assumptions, params.failure_conditions,
  ]);
}

export async function addEvidenceRecord(
  account: `0x${string}`,
  params: {
    case_id: string; evidence_id: string; evidence_title: string; evidence_type: string;
    evidence_url: string; evidence_hash: string; source_name: string;
    source_credibility_note: string; relevance_to_operational_question: string;
    related_task_ids: string; related_labor_plan_ids: string; evidence_category: string;
  },
) {
  return writeContract(account, 'add_evidence_record', [
    params.case_id, params.evidence_id, params.evidence_title, params.evidence_type,
    params.evidence_url, params.evidence_hash, params.source_name,
    params.source_credibility_note, params.relevance_to_operational_question,
    params.related_task_ids, params.related_labor_plan_ids, params.evidence_category,
  ]);
}

export async function requestOpsConsensusReview(account: `0x${string}`, caseId: string) {
  return writeContract(account, 'request_ops_consensus_review', [caseId]);
}

export async function getOperationsCase(caseId: string): Promise<FullCaseData> {
  const result = await readContract('get_operations_case', [caseId]);
  return JSON.parse(result as string) as FullCaseData;
}

export async function listOperationsCases(): Promise<Array<{
  case_id: string; case_title: string; facility_name: string;
  case_status: string; review_status: string; final_verdict_label: string;
  current_pressure_level: string; created_at: string;
}>> {
  const result = await readContract('list_operations_cases', []);
  return JSON.parse(result as string);
}
