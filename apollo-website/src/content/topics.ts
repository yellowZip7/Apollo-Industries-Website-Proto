export interface ContactTopic {
  value: 'project' | 'other';
  label: string;
  subject: string;
}

export const contactTopics: ContactTopic[] = [
  { value: 'project', label: 'A new software project', subject: 'New project enquiry' },
  { value: 'other', label: 'Something else', subject: 'Question for Apollo' },
];
