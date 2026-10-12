# Apollo Industries website

A four-page marketing site built with **React 18, TypeScript and Vite**, using React Router.

## Run it

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run typecheck  # TypeScript check
npm run build      # production build into /dist
npm run preview    # serve the production build locally
```

## Edit the content (no component changes needed)

Everything a visitor reads lives in `src/content/`:

| File               | What it controls                                                       |
| ------------------ | ---------------------------------------------------------------------- |
| `site.ts`          | Email, phone, address, hours, response time, nav links           |
| `home.ts`          | The Home page headline and intro                                       |
| `services.ts`      | Software development description, tags and lists                |
| `projects.ts`      | Featured work, with screenshot, facts and link. Add more as you ship   |
| `technologies.ts`  | The grouped technology list on the Home page                           |
| `process.ts`       | The four "how we work" steps                                           |
| `values.ts`        | The three values on the About page                                     |
| `faqs.ts`          | Common questions on the Services page                           |
| `stats.ts`         | Real numbers for a stats row. The row stays hidden while this is empty |
| `testimonials.ts`  | Client quotes. The section stays hidden while this is empty            |
| `mission.ts`       | Vision, mission and core values (About page)                           |
| `team.ts`          | Team names and roles, certifications and partners. Hidden while empty  |
| `topics.ts`        | Options in the contact form's topic dropdown                           |

Search the project for `TODO` to find every placeholder that needs real details.

## Branding

- Colors, type, radii and spacing are CSS variables in `src/styles/tokens.css`.
  Gold is used sparingly (primary button, active nav underline, list dashes).
- The site follows the viewer's light or dark setting. The logo has a light and a dark
  version in `public/images/`. Replace both with SVGs for the sharpest result.
- The font is Geist, loaded from Google Fonts in `index.html`, with Inter and system fonts
  as fallbacks.

## Contact form

The form builds a pre-filled email in the visitor's own mail app (a `mailto:` link), and a
button copies the address for people who use webmail. Nothing is sent from the server. To switch to a real form later, change only
`src/components/ContactForm.tsx`.

## Deploying

This is a single-page app, so the host must send every URL to `index.html`.
`public/_redirects` handles this on Netlify and Cloudflare Pages. On other hosts, add the
equivalent rewrite rule (for Vercel, a `vercel.json` rewrite from `/(.*)` to `/`).

Before launch, replace `www.your-domain.com` in `public/robots.txt` and `public/sitemap.xml`.
