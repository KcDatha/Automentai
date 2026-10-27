export interface Reason {
  title: string;
  text: string;
}

export const reasons: Reason[] = [
  {
    title: 'People stay in control',
    text: 'Low-confidence results go to a review queue. Nothing sensitive happens without an approval rule you set.',
  },
  {
    title: 'Your data stays yours',
    text: 'Access controls, audit logs and clear rules on what is sent to which model.',
  },
  {
    title: 'Measured, not promised',
    text: 'We agree on accuracy and time-saved targets before the build, and report against them every month.',
  },
  {
    title: 'Fits what you already use',
    text: 'We connect to your current software instead of asking you to replace it.',
  },
];
