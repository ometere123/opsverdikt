export interface OperationsCase {
  case_id: string;
  case_title: string;
  facility_name: string;
  facility_type: string;
  shift_name: string;
  business_objective: string;
  current_pressure_level: string;
  shift_start_time: string;
  shift_end_time: string;
  decision_deadline: string;
  available_workers: string;
  worker_skill_summary: string;
  equipment_constraints: string;
  supervisor_notes: string;
  current_operational_hypothesis: string;
  owner_wallet: string;
  case_status: string;
  review_status: string;
  final_verdict_label: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftSnapshot {
  snapshot_id: string;
  case_id: string;
  snapshot_title: string;
  facility_zone_summary: string;
  active_orders_summary: string;
  staffing_summary: string;
  equipment_status: string;
  current_bottlenecks: string;
  carrier_cutoff_summary: string;
  SLA_pressure_summary: string;
  safety_or_fatigue_notes: string;
  source_url: string;
  source_hash: string;
  submitted_by: string;
  created_at: string;
}

export interface TaskRecord {
  task_id: string;
  case_id: string;
  task_title: string;
  task_type: string;
  department: string;
  deadline: string;
  SLA_impact: string;
  customer_priority: string;
  estimated_effort: string;
  required_skill: string;
  required_equipment: string;
  dependency: string;
  delay_risk: string;
  safety_note: string;
  status_at_submission: string;
  submitted_by: string;
  created_at: string;
}

export interface LaborPlanOption {
  plan_id: string;
  case_id: string;
  plan_title: string;
  labor_allocation_summary: string;
  workers_assigned_by_function: string;
  priority_task_order: string;
  tasks_to_delay: string;
  expected_upside: string;
  key_operational_risks: string;
  bottleneck_assumptions: string;
  SLA_assumptions: string;
  safety_or_fatigue_assumptions: string;
  failure_conditions: string;
  submitted_by: string;
  created_at: string;
}

export interface EvidenceRecord {
  evidence_id: string;
  case_id: string;
  evidence_title: string;
  evidence_type: string;
  evidence_url: string;
  evidence_hash: string;
  source_name: string;
  source_credibility_note: string;
  relevance_to_operational_question: string;
  related_task_ids: string;
  related_labor_plan_ids: string;
  evidence_category: string;
  submitter_wallet: string;
  created_at: string;
}

export interface OpsVerdict {
  case_id: string;
  recommended_plan_id: string;
  verdict_label: string;
  confidence_score: number;
  priority_level: string;
  SLA_risk_level: string;
  bottleneck_risk_level: string;
  execution_risk_level: string;
  safety_risk_level: string;
  labor_fit_level: string;
  evidence_quality_level: string;
  source_credibility_level: string;
  contradiction_level: string;
  recommended_labor_allocation: string;
  top_priority_tasks: string;
  tasks_to_delay: string;
  supervisor_action_required: string;
  short_reasoning_summary: string;
  key_supporting_evidence: string;
  key_concerns: string;
  follow_up_operational_evidence_needed: string;
  created_at: string;
}

export interface FullCaseData {
  case: OperationsCase;
  snapshots: ShiftSnapshot[];
  tasks: TaskRecord[];
  plans: LaborPlanOption[];
  evidence: EvidenceRecord[];
  verdict: OpsVerdict | null;
}
