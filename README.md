# Fieldstone Web Studio

Marketing site for a web design studio serving service businesses in the US and Canada.

## Structure

- `src/pages/*.html` – the content of each page (the `<main>` block only)
- `src/partials/layout.html` – shared head, header, nav and footer
- `src/site.json` – studio name, email, nav links, and each page's title and description
- `public/` – CSS and JavaScript, copied as-is
- `dist/` – the built site (generated, but committed so it can be hosted directly)

## Build

```
npm run build
```

This needs only Node, with no dependencies. Edit files in `src/` or `public/`, then rebuild and commit `dist/`.

To add a page: create `src/pages/<name>.html`, then add an entry to `pages` (and `nav`, if it should be in the menu) in `src/site.json`.

## Deploying on Vercel

`vercel.json` sets the build command (`npm run build`) and output folder (`dist`). The contact form posts to `api/contact.js`, a small Vercel function that emails each message to `fieldstone.webagency@gmail.com` using Resend.

1. In Vercel choose **Add New, Project**, import this GitHub repository, and set the production branch.
2. Leave the framework preset as **Other**. Build settings come from `vercel.json`.
3. Create a free account at resend.com, using the same email address you want to receive messages at, and create an API key.
4. In Vercel go to **Settings, Environment Variables** and add `RESEND_API_KEY` with that key. Optionally add `CONTACT_TO` to receive messages somewhere else. Redeploy.
5. Send a test message through the live form.
6. Add your own domain under **Settings, Domains**. To send from your own address instead of Resend's test sender, verify the domain in Resend and set `CONTACT_FROM`.

Until `RESEND_API_KEY` is set, the form falls back to opening the visitor's email app.

Note: Vercel's free Hobby plan is for personal, non-commercial use. Check their current terms and use the Pro plan for a business site.

## Before launch

- Contact email is set in `src/site.json` and `public/script.js`.
- Prices, turnaround times and the concept projects on the Work page are examples. Replace them with real ones.
