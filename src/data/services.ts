import type { IconName } from '../components/Icon';

export interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: IconName;
}

export const services: Service[] = [
  {
    id: 'workflow',
    title: 'Workflow automation',
    description:
      'Replace copy-paste handoffs between inboxes, spreadsheets and internal tools with flows that run on their own.',
    tags: ['Approvals', 'Routing', 'Reporting'],
    icon: 'flow',
  },
  {
    id: 'agents',
    title: 'AI agents and copilots',
    description:
      'Assistants that answer staff and customer questions from your own knowledge and take action in your systems.',
    tags: ['Support', 'Sales ops', 'Internal help'],
    icon: 'robot',
  },
  {
    id: 'documents',
    title: 'Document intelligence',
    description:
      'Turn invoices, contracts, forms and emails into clean, structured data with confidence scores and review queues.',
    tags: ['Extraction', 'Classification', 'Search'],
    icon: 'document',
  },
  {
    id: 'integrations',
    title: 'Integrations and data',
    description:
      'Connect CRMs, ERPs, databases and APIs so the automation has clean, current information to work from.',
    tags: ['APIs', 'Pipelines', 'Sync'],
    icon: 'link',
  },
  {
    id: 'apps',
    title: 'Custom web and apps',
    description:
      'Dashboards, portals and internal tools that give your team a clear front end for the automation behind it.',
    tags: ['Portals', 'Dashboards', 'Mobile'],
    icon: 'monitor',
  },
  {
    id: 'strategy',
    title: 'AI strategy and audits',
    description:
      'A ranked list of the processes worth automating first, with effort, risk and expected payback for each.',
    tags: ['Roadmap', 'Risk review', 'ROI model'],
    icon: 'bulb',
  },
];
