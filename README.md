# AIVolution Official

Official website for **AIVolution** — an AI/DS-focused student organization site built with React and Tailwind CSS.

## What this project does

- Public homepage with cinematic hero, stats, projects, skills, vision, events, sponsors, faculty advisors, and team sections.
- Interactive navigation and animated section transitions using GSAP/ScrollTrigger.
- Contact form backed by Supabase.
- Newsletter/email capture via Mailchimp.
- Event registration modal and event highlights.
- Separate Team page routed with React Router.
- Production build deployed on Vercel.

## Tech stack

- React 18
- React Router DOM
- Tailwind CSS
- GSAP + `@gsap/react`
- `react-multi-carousel`
- Supabase JS client
- Mailchimp subscribe
- React Bootstrap + Bootstrap icons
- Vercel for deployment

## Scripts

```bash
npm start
npm run build
npm test
```

## Environment

Create `.env.local` with the required Supabase/Mailchimp keys.

## Deployment

This repo is configured for Vercel. Ensure npm install scripts are approved if CI blocks postinstall.
