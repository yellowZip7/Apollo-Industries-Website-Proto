export interface Testimonial {
  quote: string;
  name: string;
  company?: string;
}

// Add real client quotes here. While this list is empty,
// the testimonials section stays hidden on the Home page.
export const testimonials: Testimonial[] = [];
