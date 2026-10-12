import type { Faq as FaqItem } from '../content/faqs';

interface FaqProps {
  items: FaqItem[];
}

/** Accessible question-and-answer list using native details elements. */
export default function Faq({ items }: FaqProps) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.question} className="faq__item">
          <summary className="faq__question">{item.question}</summary>
          <p className="faq__answer">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
