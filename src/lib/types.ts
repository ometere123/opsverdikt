export interface FullCaseData {
  case: Record<string, any>;
  snapshots: any[];
  tasks: any[];
  plans: any[];
  evidence: any[];
  verdict: Record<string, any> | null;
}
