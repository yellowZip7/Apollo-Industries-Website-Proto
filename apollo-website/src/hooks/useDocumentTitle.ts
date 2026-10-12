import { useEffect } from 'react';

const SITE_NAME = 'Apollo Industries';

/** Sets the browser tab title and meta description for the current page. */
export function useDocumentTitle(title?: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = 'description';
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}
