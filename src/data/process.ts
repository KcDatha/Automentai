export interface ProcessStage {
  title: string;
  description: string;
  output: string;
}

export const processStages: ProcessStage[] = [
  {
    title: 'Discover',
    description:
      'We map the process as it runs today, find where time and errors pile up, and agree what success looks like.',
    output: 'Output: process map and priority list',
  },
  {
    title: 'Prototype',
    description:
      'A working version on a slice of your real data, so you judge accuracy before committing to a full build.',
    output: 'Output: working pilot',
  },
  {
    title: 'Build',
    description:
      'Production system with integrations, review queues, access control and logging for every automated decision.',
    output: 'Output: live system',
  },
  {
    title: 'Operate',
    description:
      'We monitor accuracy, tune prompts and models, and extend the system to the next process on your list.',
    output: 'Output: monthly performance review',
  },
];
