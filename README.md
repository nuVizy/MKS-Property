# MKS Property Management

Boutique property management marketing site built with Vite, React, and React Router.

## Local Development

Prerequisite: Node.js 20+

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`

## Environment Variables

Copy `.env.example` to `.env.local` and set:

- `VITE_FORMSPREE_CONTACT_ENDPOINT` for live contact form submissions

If the value is left as a placeholder, the contact flow stays usable but live submission is disabled and the UI shows a fallback contact message.

## Quality Checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run check`

## Netlify

The project includes a `netlify.toml` configured for:

- build command: `npm run check`
- publish directory: `dist`
- SPA rewrite: `/* -> /index.html`

In Netlify, add `VITE_FORMSPREE_CONTACT_ENDPOINT` as a site environment variable before publishing the live contact form.
