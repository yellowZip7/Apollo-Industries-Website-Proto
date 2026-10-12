export interface ProcessStep {
  title: string;
  text: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: 'We talk',
    text: 'Tell us what you want to build, or what problem you want to solve. We ask questions until we both understand it.',
  },
  {
    title: 'We make a plan',
    text: 'You get a clear plan with a price and a timeline, in plain words, before any work starts.',
  },
  {
    title: 'We do the work',
    text: 'We build it and keep you updated along the way, so nothing comes as a surprise.',
  },
  {
    title: 'We stay in touch',
    text: 'When it is done, we are still here. Questions and follow-ups go to the same people.',
  },
];
