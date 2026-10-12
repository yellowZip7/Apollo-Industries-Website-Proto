export interface Faq {
  question: string;
  answer: string;
}

// TODO: confirm these answers match how Apollo actually works.

export const faqs: Faq[] = [
  {
    question: 'How do I get started?',
    answer:
      'Send us a message. Tell us what you want to build or what problem you are trying to solve, and who will use it. Sketches, links or examples help if you have them.',
  },
  {
    question: 'What happens after I send a message?',
    answer:
      'A real person reads it and replies, usually with a question or two so we understand what you need. Then we suggest a sensible first step and tell you what to expect.',
  },
  {
    question: 'Do you take on small software projects?',
    answer:
      'Yes. Tell us what you are trying to do and we will say honestly whether it is a good fit, and what a sensible first step would be.',
  },
  {
    question: 'Can you take over or improve software we already have?',
    answer:
      'Usually, yes. We start by looking at what you have, then tell you what is working, what is not, and what we would change first.',
  },
  {
    question: 'How much will it cost?',
    answer:
      'We agree the scope and give you a clear price before work starts, so there are no surprises along the way.',
  },
];
