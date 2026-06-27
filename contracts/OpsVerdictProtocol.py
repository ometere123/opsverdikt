# v0.2.18
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
import json


@gl.contract
class OpsVerdictProtocol:
    case_ids: DynArray[str]
    cases: TreeMap[str, str]
    snapshots: TreeMap[str, str]
    tasks: TreeMap[str, str]
    plans: TreeMap[str, str]
    evidence: TreeMap[str, str]
    verdicts: TreeMap[str, str]

    def __init__(self):
        self.case_ids = DynArray[str]()
        self.cases = TreeMap[str, str]()
        self.snapshots = TreeMap[str, str]()
        self.tasks = TreeMap[str, str]()
        self.plans = TreeMap[str, str]()
        self.evidence = TreeMap[str, str]()
        self.verdicts = TreeMap[str, str]()

    @gl.public.write
    def create_operations_case(
        self,
        case_id: str,
        case_title: str,
        facility_name: str,
        facility_type: str,
        shift_name: str,
        business_objective: str,
        current_pressure_level: str,
        shift_start_time: str,
        shift_end_time: str,
        decision_deadline: str,
        available_workers: str,
        worker_skill_summary: str,
        equipment_constraints: str,
        supervisor_notes: str,
        current_operational_hypothesis: str,
    ) -> None:
        assert len(case_id) > 0, "case_id must not be empty"
        assert len(case_title) > 0, "case_title must not be empty"
        assert len(facility_name) > 0, "facility_name must not be empty"
        assert len(business_objective) > 0, "business_objective must not be empty"
        assert len(available_workers) > 0, "available_workers must not be empty"

        import datetime
        now = datetime.datetime.utcnow().isoformat()

        case_data = json.dumps({
            "case_id": case_id,
            "case_title": case_title,
            "facility_name": facility_name,
            "facility_type": facility_type,
            "shift_name": shift_name,
            "business_objective": business_objective,
            "current_pressure_level": current_pressure_level,
            "shift_start_time": shift_start_time,
            "shift_end_time": shift_end_time,
            "decision_deadline": decision_deadline,
            "available_workers": available_workers,
            "worker_skill_summary": worker_skill_summary,
            "equipment_constraints": equipment_constraints,
            "supervisor_notes": supervisor_notes,
            "current_operational_hypothesis": current_operational_hypothesis,
            "owner_wallet": gl.message.sender_account,
            "case_status": "SUBMITTED",
            "review_status": "NOT_STARTED",
            "final_verdict_label": "UNREVIEWED",
            "created_at": now,
            "updated_at": now,
        })

        self.cases[case_id] = case_data
        self.snapshots[case_id] = json.dumps([])
        self.tasks[case_id] = json.dumps([])
        self.plans[case_id] = json.dumps([])
        self.evidence[case_id] = json.dumps([])
        self.case_ids.append(case_id)

    @gl.public.write
    def add_shift_snapshot(
        self,
        case_id: str,
        snapshot_id: str,
        snapshot_title: str,
        facility_zone_summary: str,
        active_orders_summary: str,
        staffing_summary: str,
        equipment_status: str,
        current_bottlenecks: str,
        carrier_cutoff_summary: str,
        SLA_pressure_summary: str,
        safety_or_fatigue_notes: str,
        source_url: str,
        source_hash: str,
    ) -> None:
        import datetime
        now = datetime.datetime.utcnow().isoformat()

        snapshot = {
            "snapshot_id": snapshot_id,
            "case_id": case_id,
            "snapshot_title": snapshot_title,
            "facility_zone_summary": facility_zone_summary,
            "active_orders_summary": active_orders_summary,
            "staffing_summary": staffing_summary,
            "equipment_status": equipment_status,
            "current_bottlenecks": current_bottlenecks,
            "carrier_cutoff_summary": carrier_cutoff_summary,
            "SLA_pressure_summary": SLA_pressure_summary,
            "safety_or_fatigue_notes": safety_or_fatigue_notes,
            "source_url": source_url,
            "source_hash": source_hash,
            "submitted_by": gl.message.sender_account,
            "created_at": now,
        }

        existing = json.loads(self.snapshots[case_id])
        existing.append(snapshot)
        self.snapshots[case_id] = json.dumps(existing)

        case = json.loads(self.cases[case_id])
        case["case_status"] = "SNAPSHOT_REGISTERED"
        case["updated_at"] = now
        self.cases[case_id] = json.dumps(case)

    @gl.public.write
    def add_task_record(
        self,
        case_id: str,
        task_id: str,
        task_title: str,
        task_type: str,
        department: str,
        deadline: str,
        SLA_impact: str,
        customer_priority: str,
        estimated_effort: str,
        required_skill: str,
        required_equipment: str,
        dependency: str,
        delay_risk: str,
        safety_note: str,
        status_at_submission: str,
    ) -> None:
        import datetime
        now = datetime.datetime.utcnow().isoformat()

        task = {
            "task_id": task_id,
            "case_id": case_id,
            "task_title": task_title,
            "task_type": task_type,
            "department": department,
            "deadline": deadline,
            "SLA_impact": SLA_impact,
            "customer_priority": customer_priority,
            "estimated_effort": estimated_effort,
            "required_skill": required_skill,
            "required_equipment": required_equipment,
            "dependency": dependency,
            "delay_risk": delay_risk,
            "safety_note": safety_note,
            "status_at_submission": status_at_submission,
            "submitted_by": gl.message.sender_account,
            "created_at": now,
        }

        existing = json.loads(self.tasks[case_id])
        existing.append(task)
        self.tasks[case_id] = json.dumps(existing)

        case = json.loads(self.cases[case_id])
        case["case_status"] = "TASKS_REGISTERED"
        case["updated_at"] = now
        self.cases[case_id] = json.dumps(case)

    @gl.public.write
    def add_labor_plan_option(
        self,
        case_id: str,
        plan_id: str,
        plan_title: str,
        labor_allocation_summary: str,
        workers_assigned_by_function: str,
        priority_task_order: str,
        tasks_to_delay: str,
        expected_upside: str,
        key_operational_risks: str,
        bottleneck_assumptions: str,
        SLA_assumptions: str,
        safety_or_fatigue_assumptions: str,
        failure_conditions: str,
    ) -> None:
        import datetime
        now = datetime.datetime.utcnow().isoformat()

        plan = {
            "plan_id": plan_id,
            "case_id": case_id,
            "plan_title": plan_title,
            "labor_allocation_summary": labor_allocation_summary,
            "workers_assigned_by_function": workers_assigned_by_function,
            "priority_task_order": priority_task_order,
            "tasks_to_delay": tasks_to_delay,
            "expected_upside": expected_upside,
            "key_operational_risks": key_operational_risks,
            "bottleneck_assumptions": bottleneck_assumptions,
            "SLA_assumptions": SLA_assumptions,
            "safety_or_fatigue_assumptions": safety_or_fatigue_assumptions,
            "failure_conditions": failure_conditions,
            "submitted_by": gl.message.sender_account,
            "created_at": now,
        }

        existing = json.loads(self.plans[case_id])
        existing.append(plan)
        self.plans[case_id] = json.dumps(existing)

        case = json.loads(self.cases[case_id])
        case["case_status"] = "PLANS_REGISTERED"
        case["updated_at"] = now
        self.cases[case_id] = json.dumps(case)

    @gl.public.write
    def add_evidence_record(
        self,
        case_id: str,
        evidence_id: str,
        evidence_title: str,
        evidence_type: str,
        evidence_url: str,
        evidence_hash: str,
        source_name: str,
        source_credibility_note: str,
        relevance_to_operational_question: str,
        related_task_ids: str,
        related_labor_plan_ids: str,
        evidence_category: str,
    ) -> None:
        import datetime
        now = datetime.datetime.utcnow().isoformat()

        ev = {
            "evidence_id": evidence_id,
            "case_id": case_id,
            "evidence_title": evidence_title,
            "evidence_type": evidence_type,
            "evidence_url": evidence_url,
            "evidence_hash": evidence_hash,
            "source_name": source_name,
            "source_credibility_note": source_credibility_note,
            "relevance_to_operational_question": relevance_to_operational_question,
            "related_task_ids": related_task_ids,
            "related_labor_plan_ids": related_labor_plan_ids,
            "evidence_category": evidence_category,
            "submitter_wallet": gl.message.sender_account,
            "created_at": now,
        }

        existing = json.loads(self.evidence[case_id])
        existing.append(ev)
        self.evidence[case_id] = json.dumps(existing)

        case = json.loads(self.cases[case_id])
        case["case_status"] = "EVIDENCE_REGISTERED"
        case["updated_at"] = now
        self.cases[case_id] = json.dumps(case)

    @gl.public.view
    def get_operations_case(self, case_id: str) -> str:
        case = json.loads(self.cases[case_id])
        snapshots = json.loads(self.snapshots[case_id])
        tasks_list = json.loads(self.tasks[case_id])
        plans_list = json.loads(self.plans[case_id])
        evidence_list = json.loads(self.evidence[case_id])

        verdict = None
        if case_id in self.verdicts:
            verdict = json.loads(self.verdicts[case_id])

        return json.dumps({
            "case": case,
            "snapshots": snapshots,
            "tasks": tasks_list,
            "plans": plans_list,
            "evidence": evidence_list,
            "verdict": verdict,
        })

    @gl.public.view
    def list_operations_cases(self) -> str:
        result = []
        for i in range(len(self.case_ids)):
            cid = self.case_ids[i]
            case = json.loads(self.cases[cid])
            result.append({
                "case_id": case["case_id"],
                "case_title": case["case_title"],
                "facility_name": case["facility_name"],
                "case_status": case["case_status"],
                "review_status": case["review_status"],
                "final_verdict_label": case["final_verdict_label"],
                "current_pressure_level": case["current_pressure_level"],
                "created_at": case["created_at"],
            })
        return json.dumps(result)

    @gl.public.write
    def request_ops_consensus_review(self, case_id: str) -> None:
        import datetime
        now = datetime.datetime.utcnow().isoformat()

        case = json.loads(self.cases[case_id])
        case["review_status"] = "CONSENSUS_PENDING"
        case["case_status"] = "UNDER_CONSENSUS_REVIEW"
        case["updated_at"] = now
        self.cases[case_id] = json.dumps(case)

        snapshots = json.loads(self.snapshots[case_id])
        tasks_list = json.loads(self.tasks[case_id])
        plans_list = json.loads(self.plans[case_id])
        evidence_list = json.loads(self.evidence[case_id])

        prompt_text = f"""You are participating in a decentralized high-pressure operations review.

Evaluate which labor plan is most defensible under the supplied shift conditions.

Do not invent unavailable operational facts.
Do not treat urgency alone as proof of priority.
Consider SLA risk, bottleneck risk, execution risk, safety/fatigue risk if supplied, labor fit, evidence quality, contradictions, and supervisor action required.

OPERATIONS CASE:
{json.dumps(case, indent=2)}

SHIFT SNAPSHOTS:
{json.dumps(snapshots, indent=2)}

TASK QUEUE:
{json.dumps(tasks_list, indent=2)}

LABOR PLAN OPTIONS:
{json.dumps(plans_list, indent=2)}

EVIDENCE:
{json.dumps(evidence_list, indent=2)}

Return strict JSON only with these fields:
recommended_plan_id, verdict_label, confidence_score (0-100 integer), priority_level, SLA_risk_level, bottleneck_risk_level, execution_risk_level, safety_risk_level, labor_fit_level, evidence_quality_level, source_credibility_level, contradiction_level, recommended_labor_allocation, top_priority_tasks, tasks_to_delay, supervisor_action_required, short_reasoning_summary, key_supporting_evidence, key_concerns, follow_up_operational_evidence_needed"""

        result = gl.exec_prompt(prompt_text)

        try:
            cleaned = result.strip()
            if cleaned.startswith("```"):
                lines = cleaned.split("\n")
                cleaned = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])
            verdict_data = json.loads(cleaned)
        except Exception:
            case["review_status"] = "FAILED"
            case["updated_at"] = datetime.datetime.utcnow().isoformat()
            self.cases[case_id] = json.dumps(case)
            return

        verdict_data["case_id"] = case_id
        verdict_data["created_at"] = now

        if "confidence_score" in verdict_data:
            verdict_data["confidence_score"] = int(verdict_data["confidence_score"])

        self.verdicts[case_id] = json.dumps(verdict_data)

        case["review_status"] = "VERDICT_READY"
        case["case_status"] = "VERDICT_ISSUED"
        case["final_verdict_label"] = verdict_data.get("verdict_label", "UNKNOWN")
        case["updated_at"] = datetime.datetime.utcnow().isoformat()
        self.cases[case_id] = json.dumps(case)

        eq_principal = {
            "recommended_plan_id": verdict_data.get("recommended_plan_id", ""),
            "verdict_label": verdict_data.get("verdict_label", ""),
            "priority_level": verdict_data.get("priority_level", ""),
            "SLA_risk_level": verdict_data.get("SLA_risk_level", ""),
            "bottleneck_risk_level": verdict_data.get("bottleneck_risk_level", ""),
            "execution_risk_level": verdict_data.get("execution_risk_level", ""),
            "labor_fit_level": verdict_data.get("labor_fit_level", ""),
            "supervisor_action_required": verdict_data.get("supervisor_action_required", ""),
        }

        score = verdict_data.get("confidence_score", 0)
        if score >= 80:
            eq_principal["confidence_band"] = "VERY_STRONG"
        elif score >= 60:
            eq_principal["confidence_band"] = "STRONG"
        elif score >= 40:
            eq_principal["confidence_band"] = "MODERATE"
        else:
            eq_principal["confidence_band"] = "LOW"

        gl.eq_principle_strict_eq(json.dumps(eq_principal))
