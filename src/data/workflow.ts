import type { IconName } from '../components/Icon';

export interface WorkflowStep {
  title: string;
  detail: string;
  time: string;
  icon: IconName;
}

export const workflowSteps: WorkflowStep[] = [
  {
    title: 'Invoice arrives by email',
    detail: 'PDF attachment detected',
    time: '00:01',
    icon: 'mail',
  },
  {
    title: 'AI extracts the fields',
    detail: 'Vendor, amount, due date, PO number',
    time: '00:04',
    icon: 'document',
  },
  {
    title: 'Checked against the PO',
    detail: 'Mismatches flagged for a person',
    time: '00:06',
    icon: 'check',
  },
  {
    title: 'Posted to your system',
    detail: 'ERP entry created, approver notified',
    time: '00:09',
    icon: 'database',
  },
];
