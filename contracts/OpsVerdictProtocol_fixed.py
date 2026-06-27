# v0.2.18
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
import json


@allow_storage
@dataclass
class OpsCase:
    case_id: u32
    title: str
    facility_name: str
    facility_type: str
    shift_name: str
    business_objective: str
    pressure_level: u32
    shift_start: str
    shift_end: str
    decision_deadline: str
    available_workers: u32
    worker_skill_summary: str
    equipment_constraints: str
    supervisor_notes: str
    operational_hypothesis: str
    owner: Address
    status: u32
    created_at: str
    task_count: u32
    plan_count: u32
    evidence_count: u32


@allow_storage
@dataclass
class TaskEntry:
    task_id: u32
    case_id: u32
    title: str
    task_type: str
    department: str
    deadline: str
    sla_impact: str
    customer_priority: str
    estimated_effort: str
    required_skill: str
    required_equipment: str
    dependency: str
    delay_risk: str
    safety_note: str
    status_at_submission: str
    submitter: Address


@allow_storage
@dataclass
class LaborPlan:
    plan_id: u32
    case_id: u32
    title: str
    allocation_summary: str
    workers_by_function: str
    priority_task_order: str
    tasks_to_delay: str
    expected_upside: str
    operational_risks: str
    bottleneck_assumptions: str
    sla_assumptions: str
    safety_assumptions: str
    failure_conditions: str
    submitter: Address


@allow_storage
@dataclass
class EvidenceRecord:
    evidence_id: u32
    case_id: u32
    title: str
    evidence_type: str
    url: str
    evidence_hash: str
    source_name: str
    source_credibility: str
    relevance: str
    related_task_ids: str
    related_plan_ids: str
    category: str
    submitted_at: str
    submitter: Address


@allow_storage
@dataclass
class OpsVerdikt:
    verdikt_id: u32
    case_id: u32
    recommended_plan_id: u32
    verdikt_label: str
    confidence: u32
    priority_level: str
    sla_risk: str
    bottleneck_risk: str
    execution_risk: str
    safety_risk: str
    labor_fit: str
    evidence_quality: str
    source_credibility: str
    contradiction_level: str
    recommended_allocation: str
    top_priority_tasks: str
    tasks_to_delay: str
    supervisor_action: str
    reasoning: str
    supporting_evidence: str
    key_concerns: str
    follow_up_needed: str
    issued_at: str


def _trunc(val: str, max_len: int = 512) -> str:
    if len(val) > max_len:
        return val[:max_len]
    return val


def _clamp(val: int, low: int, high: int) -> int:
    if val < low:
        return low
    if val > high:
        return high
    return val


def _safe_enum(val, allowed: list, default: str) -> str:
    v = str(val).lower().strip() if val else default
    if v in allowed:
        return v
    return default


VALID_RISK = ["critical", "high", "medium", "low", "none"]
VALID_PRIORITY = ["critical", "high", "medium", "low"]
VALID_FIT = ["strong", "adequate", "weak", "insufficient"]
VALID_QUALITY = ["high", "medium-high", "medium", "medium-low", "low"]
VALID_CONTRADICTION = ["none", "low", "moderate", "high", "severe"]


class OpsVerdiktContract(gl.Contract):
    next_case_id: u32
    next_task_id: u32
    next_plan_id: u32
    next_evidence_id: u32
    next_verdikt_id: u32

    cases: TreeMap[u32, OpsCase]
    tasks: TreeMap[u32, TaskEntry]
    plans: TreeMap[u32, LaborPlan]
    evidence: TreeMap[u32, EvidenceRecord]
    verdikts: TreeMap[u32, OpsVerdikt]

    case_tasks: TreeMap[u32, DynArray[u32]]
    case_plans: TreeMap[u32, DynArray[u32]]
    case_evidence: TreeMap[u32, DynArray[u32]]
    case_verdikts: TreeMap[u32, DynArray[u32]]
    owner_cases: TreeMap[Address, DynArray[u32]]

    def __init__(self) -> None:
        self.next_case_id = u32(1)
        self.next_task_id = u32(1)
        self.next_plan_id = u32(1)
        self.next_evidence_id = u32(1)
        self.next_verdikt_id = u32(1)

    # ── WRITE METHODS ──────────────────────────────────────────────

    @gl.public.write
    def create_case(
        self,
        title: str,
        facility_name: str,
        facility_type: str,
        shift_name: str,
        business_objective: str,
        pressure_level: u32,
        shift_start: str,
        shift_end: str,
        decision_deadline: str,
        available_workers: u32,
        worker_skill_summary: str,
        equipment_constraints: str,
        supervisor_notes: str,
        operational_hypothesis: str,
    ) -> None:
        case_id = self.next_case_id
        self.next_case_id = u32(case_id + 1)

        case = OpsCase(
            case_id=case_id,
            title=_trunc(title, 128),
            facility_name=_trunc(facility_name, 128),
            facility_type=_trunc(facility_type, 64),
            shift_name=_trunc(shift_name, 64),
            business_objective=_trunc(business_objective, 512),
            pressure_level=u32(_clamp(int(pressure_level), 1, 5)),
            shift_start=_trunc(shift_start, 64),
            shift_end=_trunc(shift_end, 64),
            decision_deadline=_trunc(decision_deadline, 64),
            available_workers=available_workers,
            worker_skill_summary=_trunc(worker_skill_summary, 256),
            equipment_constraints=_trunc(equipment_constraints, 256),
            supervisor_notes=_trunc(supervisor_notes, 512),
            operational_hypothesis=_trunc(operational_hypothesis, 512),
            owner=gl.message.sender_account,
            status=u32(0),
            created_at=_trunc(shift_start, 64),
            task_count=u32(0),
            plan_count=u32(0),
            evidence_count=u32(0),
        )

        self.cases[case_id] = case
        self.case_tasks[case_id] = DynArray[u32]()
        self.case_plans[case_id] = DynArray[u32]()
        self.case_evidence[case_id] = DynArray[u32]()
        self.case_verdikts[case_id] = DynArray[u32]()

        sender = gl.message.sender_account
        if sender not in self.owner_cases:
            self.owner_cases[sender] = DynArray[u32]()
        self.owner_cases[sender].append(case_id)

    @gl.public.write
    def add_task(
        self,
        case_id: u32,
        title: str,
        task_type: str,
        department: str,
        deadline: str,
        sla_impact: str,
        customer_priority: str,
        estimated_effort: str,
        required_skill: str,
        required_equipment: str,
        dependency: str,
        delay_risk: str,
        safety_note: str,
        status_at_submission: str,
    ) -> None:
        if case_id not in self.cases:
            raise gl.UserError("Case not found")
        case = self.cases[case_id]
        if gl.message.sender_account != case.owner:
            raise gl.UserError("Not case owner")
        if case.task_count >= u32(20):
            raise gl.UserError("Max 20 tasks per case")

        task_id = self.next_task_id
        self.next_task_id = u32(task_id + 1)

        task = TaskEntry(
            task_id=task_id,
            case_id=case_id,
            title=_trunc(title, 128),
            task_type=_trunc(task_type, 64),
            department=_trunc(department, 64),
            deadline=_trunc(deadline, 64),
            sla_impact=_safe_enum(sla_impact, ["none", "low", "medium", "high", "critical"], "medium"),
            customer_priority=_trunc(customer_priority, 64),
            estimated_effort=_trunc(estimated_effort, 64),
            required_skill=_trunc(required_skill, 64),
            required_equipment=_trunc(required_equipment, 64),
            dependency=_trunc(dependency, 128),
            delay_risk=_trunc(delay_risk, 256),
            safety_note=_trunc(safety_note, 256),
            status_at_submission=_trunc(status_at_submission, 32),
            submitter=gl.message.sender_account,
        )

        self.tasks[task_id] = task
        self.case_tasks[case_id].append(task_id)
        case.task_count = u32(case.task_count + 1)
        if case.status == u32(0):
            case.status = u32(1)
        self.cases[case_id] = case

    @gl.public.write
    def add_labor_plan(
        self,
        case_id: u32,
        title: str,
        allocation_summary: str,
        workers_by_function: str,
        priority_task_order: str,
        tasks_to_delay: str,
        expected_upside: str,
        operational_risks: str,
        bottleneck_assumptions: str,
        sla_assumptions: str,
        safety_assumptions: str,
        failure_conditions: str,
    ) -> None:
        if case_id not in self.cases:
            raise gl.UserError("Case not found")
        case = self.cases[case_id]
        if gl.message.sender_account != case.owner:
            raise gl.UserError("Not case owner")
        if case.plan_count >= u32(5):
            raise gl.UserError("Max 5 plans per case")

        plan_id = self.next_plan_id
        self.next_plan_id = u32(plan_id + 1)

        plan = LaborPlan(
            plan_id=plan_id,
            case_id=case_id,
            title=_trunc(title, 128),
            allocation_summary=_trunc(allocation_summary, 512),
            workers_by_function=_trunc(workers_by_function, 512),
            priority_task_order=_trunc(priority_task_order, 256),
            tasks_to_delay=_trunc(tasks_to_delay, 256),
            expected_upside=_trunc(expected_upside, 256),
            operational_risks=_trunc(operational_risks, 512),
            bottleneck_assumptions=_trunc(bottleneck_assumptions, 256),
            sla_assumptions=_trunc(sla_assumptions, 256),
            safety_assumptions=_trunc(safety_assumptions, 256),
            failure_conditions=_trunc(failure_conditions, 256),
            submitter=gl.message.sender_account,
        )

        self.plans[plan_id] = plan
        self.case_plans[case_id].append(plan_id)
        case.plan_count = u32(case.plan_count + 1)
        if case.status == u32(0):
            case.status = u32(1)
        self.cases[case_id] = case

    @gl.public.write
    def add_evidence(
        self,
        case_id: u32,
        title: str,
        evidence_type: str,
        url: str,
        evidence_hash: str,
        source_name: str,
        source_credibility: str,
        relevance: str,
        related_task_ids: str,
        related_plan_ids: str,
        category: str,
    ) -> None:
        if case_id not in self.cases:
            raise gl.UserError("Case not found")
        case = self.cases[case_id]
        if gl.message.sender_account != case.owner:
            raise gl.UserError("Not case owner")
        if case.evidence_count >= u32(20):
            raise gl.UserError("Max 20 evidence per case")

        eid = self.next_evidence_id
        self.next_evidence_id = u32(eid + 1)

        rec = EvidenceRecord(
            evidence_id=eid,
            case_id=case_id,
            title=_trunc(title, 128),
            evidence_type=_trunc(evidence_type, 32),
            url=_trunc(url, 512),
            evidence_hash=_trunc(evidence_hash, 64),
            source_name=_trunc(source_name, 128),
            source_credibility=_safe_enum(source_credibility, ["high", "medium", "low", "unknown"], "medium"),
            relevance=_trunc(relevance, 256),
            related_task_ids=_trunc(related_task_ids, 256),
            related_plan_ids=_trunc(related_plan_ids, 256),
            category=_trunc(category, 32),
            submitted_at=_trunc(url, 64),
            submitter=gl.message.sender_account,
        )

        self.evidence[eid] = rec
        self.case_evidence[case_id].append(eid)
        case.evidence_count = u32(case.evidence_count + 1)
        if case.status == u32(0):
            case.status = u32(1)
        self.cases[case_id] = case

    @gl.public.write
    def request_verdikt(self, case_id: u32) -> None:
        if case_id not in self.cases:
            raise gl.UserError("Case not found")
        case = self.cases[case_id]
        if gl.message.sender_account != case.owner:
            raise gl.UserError("Not case owner")
        if case.task_count < u32(1):
            raise gl.UserError("At least 1 task required")
        if case.plan_count < u32(2):
            raise gl.UserError("At least 2 labor plans required")
        if case.evidence_count < u32(1):
            raise gl.UserError("At least 1 evidence record required")
        if case.status == u32(2):
            raise gl.UserError("Already reviewing")

        case.status = u32(2)
        self.cases[case_id] = case

        task_ids = self.case_tasks[case_id]
        plan_ids = self.case_plans[case_id]
        evidence_ids = self.case_evidence[case_id]

        tasks_data = []
        for tid in task_ids:
            t = self.tasks[tid]
            tasks_data.append({
                "task_id": int(t.task_id),
                "title": t.title,
                "type": t.task_type,
                "department": t.department,
                "deadline": t.deadline,
                "sla_impact": t.sla_impact,
                "delay_risk": t.delay_risk,
                "required_skill": t.required_skill,
            })

        plans_data = []
        for pid in plan_ids:
            p = self.plans[pid]
            plans_data.append({
                "plan_id": int(p.plan_id),
                "title": p.title,
                "allocation_summary": p.allocation_summary,
                "priority_task_order": p.priority_task_order,
                "tasks_to_delay": p.tasks_to_delay,
                "operational_risks": p.operational_risks,
                "bottleneck_assumptions": p.bottleneck_assumptions,
                "failure_conditions": p.failure_conditions,
            })

        evidence_data = []
        for eid in evidence_ids:
            e = self.evidence[eid]
            evidence_data.append({
                "evidence_id": int(e.evidence_id),
                "title": e.title,
                "type": e.evidence_type,
                "url": e.url,
                "source_name": e.source_name,
                "source_credibility": e.source_credibility,
                "relevance": e.relevance,
                "category": e.category,
            })

        case_mem = gl.storage.copy_to_memory(case)

        prompt = f"""You are an operational judgment engine evaluating a high-pressure operational decision case.

FACILITY: {case_mem.facility_name} ({case_mem.facility_type})
SHIFT: {case_mem.shift_name} | {case_mem.shift_start} to {case_mem.shift_end}
DECISION DEADLINE: {case_mem.decision_deadline}
BUSINESS OBJECTIVE: {case_mem.business_objective}
PRESSURE LEVEL: {int(case_mem.pressure_level)}/5
AVAILABLE WORKERS: {int(case_mem.available_workers)}
WORKER SKILLS: {case_mem.worker_skill_summary}
EQUIPMENT CONSTRAINTS: {case_mem.equipment_constraints}
SUPERVISOR NOTES: {case_mem.supervisor_notes}
OPERATIONAL HYPOTHESIS: {case_mem.operational_hypothesis}

TASKS COMPETING FOR PRIORITY:
{json.dumps(tasks_data, indent=2)}

LABOR PLAN OPTIONS:
{json.dumps(plans_data, indent=2)}

EVIDENCE REFERENCES:
{json.dumps(evidence_data, indent=2)}

Evaluate which labor plan is most defensible given the operational context, task urgency, evidence quality, and risk factors.

You MUST return a JSON object with exactly these keys:
{{
  "recommended_plan_id": <integer - must be one of the plan_id values above>,
  "verdikt_label": "<SHORT_UPPERCASE_LABEL describing the decision>",
  "confidence": <integer 0-100>,
  "priority_level": "<critical|high|medium|low>",
  "sla_risk": "<critical|high|medium|low|none>",
  "bottleneck_risk": "<critical|high|medium|low|none>",
  "execution_risk": "<critical|high|medium|low|none>",
  "safety_risk": "<critical|high|medium|low|none>",
  "labor_fit": "<strong|adequate|weak|insufficient>",
  "evidence_quality": "<high|medium-high|medium|medium-low|low>",
  "source_credibility": "<high|medium-high|medium|medium-low|low>",
  "contradiction_level": "<none|low|moderate|high|severe>",
  "recommended_allocation": "<describe worker assignments>",
  "top_priority_tasks": "<comma-separated task titles to execute first>",
  "tasks_to_delay": "<comma-separated task titles to delay>",
  "supervisor_action": "<required supervisor action or none>",
  "reasoning": "<2-3 sentence justification>",
  "supporting_evidence": "<comma-separated evidence titles that support this>",
  "key_concerns": "<comma-separated concerns>",
  "follow_up_needed": "<comma-separated follow-up items>"
}}"""

        valid_plan_ids = [int(p.plan_id) for p in [self.plans[pid] for pid in plan_ids]]

        def leader_fn():
            result = gl.nondet.exec_prompt(prompt, response_format="json")
            if not isinstance(result, dict):
                raise gl.UserError("LLM did not return valid JSON")
            return result

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False

            validator_data = leader_fn()
            leader_data = leader_result.calldata

            l_plan = leader_data.get("recommended_plan_id", 0)
            v_plan = validator_data.get("recommended_plan_id", 0)
            if l_plan != v_plan:
                return False

            l_priority = str(leader_data.get("priority_level", "")).lower().strip()
            v_priority = str(validator_data.get("priority_level", "")).lower().strip()
            if l_priority != v_priority:
                return False

            l_sla = str(leader_data.get("sla_risk", "")).lower().strip()
            v_sla = str(validator_data.get("sla_risk", "")).lower().strip()
            if l_sla != v_sla:
                return False

            l_btn = str(leader_data.get("bottleneck_risk", "")).lower().strip()
            v_btn = str(validator_data.get("bottleneck_risk", "")).lower().strip()
            if l_btn != v_btn:
                return False

            l_exec = str(leader_data.get("execution_risk", "")).lower().strip()
            v_exec = str(validator_data.get("execution_risk", "")).lower().strip()
            if l_exec != v_exec:
                return False

            l_conf = leader_data.get("confidence", 50)
            v_conf = validator_data.get("confidence", 50)
            try:
                l_conf = int(l_conf)
                v_conf = int(v_conf)
            except (ValueError, TypeError):
                return False

            if abs(l_conf - v_conf) > 10:
                return False

            return True

        raw_result = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        rec_plan = raw_result.get("recommended_plan_id", 0)
        try:
            rec_plan = int(rec_plan)
        except (ValueError, TypeError):
            rec_plan = valid_plan_ids[0] if valid_plan_ids else 0
        if rec_plan not in valid_plan_ids and valid_plan_ids:
            rec_plan = valid_plan_ids[0]

        confidence = raw_result.get("confidence", 50)
        try:
            confidence = int(float(str(confidence)))
        except (ValueError, TypeError):
            confidence = 50
        confidence = _clamp(confidence, 0, 100)

        vid = self.next_verdikt_id
        self.next_verdikt_id = u32(vid + 1)

        verdikt = OpsVerdikt(
            verdikt_id=vid,
            case_id=case_id,
            recommended_plan_id=u32(rec_plan),
            verdikt_label=_trunc(str(raw_result.get("verdikt_label", "EVALUATION_COMPLETE")), 64),
            confidence=u32(confidence),
            priority_level=_safe_enum(raw_result.get("priority_level"), VALID_PRIORITY, "medium"),
            sla_risk=_safe_enum(raw_result.get("sla_risk"), VALID_RISK, "medium"),
            bottleneck_risk=_safe_enum(raw_result.get("bottleneck_risk"), VALID_RISK, "medium"),
            execution_risk=_safe_enum(raw_result.get("execution_risk"), VALID_RISK, "medium"),
            safety_risk=_safe_enum(raw_result.get("safety_risk"), VALID_RISK, "low"),
            labor_fit=_safe_enum(raw_result.get("labor_fit"), VALID_FIT, "adequate"),
            evidence_quality=_safe_enum(raw_result.get("evidence_quality"), VALID_QUALITY, "medium"),
            source_credibility=_safe_enum(raw_result.get("source_credibility"), VALID_QUALITY, "medium"),
            contradiction_level=_safe_enum(raw_result.get("contradiction_level"), VALID_CONTRADICTION, "low"),
            recommended_allocation=_trunc(str(raw_result.get("recommended_allocation", "")), 512),
            top_priority_tasks=_trunc(str(raw_result.get("top_priority_tasks", "")), 512),
            tasks_to_delay=_trunc(str(raw_result.get("tasks_to_delay", "")), 512),
            supervisor_action=_trunc(str(raw_result.get("supervisor_action", "none")), 512),
            reasoning=_trunc(str(raw_result.get("reasoning", "")), 512),
            supporting_evidence=_trunc(str(raw_result.get("supporting_evidence", "")), 512),
            key_concerns=_trunc(str(raw_result.get("key_concerns", "")), 512),
            follow_up_needed=_trunc(str(raw_result.get("follow_up_needed", "")), 512),
            issued_at=case_mem.decision_deadline,
        )

        self.verdikts[vid] = verdikt
        self.case_verdikts[case_id].append(vid)

        case = self.cases[case_id]
        case.status = u32(3)
        self.cases[case_id] = case

    # ── VIEW METHODS ───────────────────────────────────────────────

    @gl.public.view
    def get_case(self, case_id: u32) -> str:
        if case_id not in self.cases:
            raise gl.UserError("Case not found")
        c = self.cases[case_id]
        return json.dumps({
            "case_id": int(c.case_id),
            "title": c.title,
            "facility_name": c.facility_name,
            "facility_type": c.facility_type,
            "shift_name": c.shift_name,
            "business_objective": c.business_objective,
            "pressure_level": int(c.pressure_level),
            "shift_start": c.shift_start,
            "shift_end": c.shift_end,
            "decision_deadline": c.decision_deadline,
            "available_workers": int(c.available_workers),
            "worker_skill_summary": c.worker_skill_summary,
            "equipment_constraints": c.equipment_constraints,
            "supervisor_notes": c.supervisor_notes,
            "operational_hypothesis": c.operational_hypothesis,
            "owner": str(c.owner),
            "status": int(c.status),
            "created_at": c.created_at,
            "task_count": int(c.task_count),
            "plan_count": int(c.plan_count),
            "evidence_count": int(c.evidence_count),
        })

    @gl.public.view
    def get_case_tasks(self, case_id: u32) -> str:
        if case_id not in self.case_tasks:
            return "[]"
        result = []
        for tid in self.case_tasks[case_id]:
            t = self.tasks[tid]
            result.append({
                "task_id": int(t.task_id),
                "case_id": int(t.case_id),
                "title": t.title,
                "task_type": t.task_type,
                "department": t.department,
                "deadline": t.deadline,
                "sla_impact": t.sla_impact,
                "customer_priority": t.customer_priority,
                "estimated_effort": t.estimated_effort,
                "required_skill": t.required_skill,
                "required_equipment": t.required_equipment,
                "dependency": t.dependency,
                "delay_risk": t.delay_risk,
                "safety_note": t.safety_note,
                "status_at_submission": t.status_at_submission,
                "submitter": str(t.submitter),
            })
        return json.dumps(result)

    @gl.public.view
    def get_case_plans(self, case_id: u32) -> str:
        if case_id not in self.case_plans:
            return "[]"
        result = []
        for pid in self.case_plans[case_id]:
            p = self.plans[pid]
            result.append({
                "plan_id": int(p.plan_id),
                "case_id": int(p.case_id),
                "title": p.title,
                "allocation_summary": p.allocation_summary,
                "workers_by_function": p.workers_by_function,
                "priority_task_order": p.priority_task_order,
                "tasks_to_delay": p.tasks_to_delay,
                "expected_upside": p.expected_upside,
                "operational_risks": p.operational_risks,
                "bottleneck_assumptions": p.bottleneck_assumptions,
                "sla_assumptions": p.sla_assumptions,
                "safety_assumptions": p.safety_assumptions,
                "failure_conditions": p.failure_conditions,
                "submitter": str(p.submitter),
            })
        return json.dumps(result)

    @gl.public.view
    def get_case_evidence(self, case_id: u32) -> str:
        if case_id not in self.case_evidence:
            return "[]"
        result = []
        for eid in self.case_evidence[case_id]:
            e = self.evidence[eid]
            result.append({
                "evidence_id": int(e.evidence_id),
                "case_id": int(e.case_id),
                "title": e.title,
                "evidence_type": e.evidence_type,
                "url": e.url,
                "hash": e.evidence_hash,
                "source_name": e.source_name,
                "source_credibility": e.source_credibility,
                "relevance": e.relevance,
                "related_task_ids": e.related_task_ids,
                "related_plan_ids": e.related_plan_ids,
                "category": e.category,
                "submitted_at": e.submitted_at,
                "submitter": str(e.submitter),
            })
        return json.dumps(result)

    @gl.public.view
    def get_case_verdikts(self, case_id: u32) -> str:
        if case_id not in self.case_verdikts:
            return "[]"
        result = []
        for vid in self.case_verdikts[case_id]:
            v = self.verdikts[vid]
            result.append(self._verdikt_to_dict(v))
        return json.dumps(result)

    @gl.public.view
    def get_verdikt(self, verdikt_id: u32) -> str:
        if verdikt_id not in self.verdikts:
            raise gl.UserError("Verdikt not found")
        v = self.verdikts[verdikt_id]
        return json.dumps(self._verdikt_to_dict(v))

    @gl.public.view
    def get_owner_cases(self, owner: Address) -> str:
        if owner not in self.owner_cases:
            return "[]"
        result = []
        for cid in self.owner_cases[owner]:
            result.append(int(cid))
        return json.dumps(result)

    @gl.public.view
    def get_case_count(self) -> u32:
        return u32(self.next_case_id - 1)

    @gl.public.view
    def get_case_summary(self, case_id: u32) -> str:
        if case_id not in self.cases:
            raise gl.UserError("Case not found")
        c = self.cases[case_id]
        return json.dumps({
            "case_id": int(c.case_id),
            "title": c.title,
            "facility_name": c.facility_name,
            "facility_type": c.facility_type,
            "pressure_level": int(c.pressure_level),
            "status": int(c.status),
            "task_count": int(c.task_count),
            "plan_count": int(c.plan_count),
            "evidence_count": int(c.evidence_count),
            "owner": str(c.owner),
        })

    # ── INTERNAL HELPERS ───────────────────────────────────────────

    def _verdikt_to_dict(self, v: OpsVerdikt) -> dict:
        return {
            "verdikt_id": int(v.verdikt_id),
            "case_id": int(v.case_id),
            "recommended_plan_id": int(v.recommended_plan_id),
            "verdikt_label": v.verdikt_label,
            "confidence": int(v.confidence),
            "priority_level": v.priority_level,
            "sla_risk": v.sla_risk,
            "bottleneck_risk": v.bottleneck_risk,
            "execution_risk": v.execution_risk,
            "safety_risk": v.safety_risk,
            "labor_fit": v.labor_fit,
            "evidence_quality": v.evidence_quality,
            "source_credibility": v.source_credibility,
            "contradiction_level": v.contradiction_level,
            "recommended_allocation": v.recommended_allocation,
            "top_priority_tasks": v.top_priority_tasks,
            "tasks_to_delay": v.tasks_to_delay,
            "supervisor_action": v.supervisor_action,
            "reasoning": v.reasoning,
            "supporting_evidence": v.supporting_evidence,
            "key_concerns": v.key_concerns,
            "follow_up_needed": v.follow_up_needed,
            "issued_at": v.issued_at,
        }
