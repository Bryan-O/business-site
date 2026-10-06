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

## Deploying on Netlify

`netlify.toml` already sets the build command (`npm run build`) and publish folder (`dist`).

1. In Netlify choose **Add new site, Import an existing project**, and pick this GitHub repository.
2. Set the production branch to the branch you want live. Netlify fills in the build settings from `netlify.toml`.
3. Deploy. Netlify Forms picks up the contact form automatically.
4. Under **Forms, Form notifications** add an email notification to `fieldstone.webagency@gmail.com` so submissions reach your inbox.
5. Under **Domain management** add your own domain.

## Before launch

- Contact email is set in `src/site.json` and `public/script.js`.
- Prices, turnaround times and the concept projects on the Work page are examples. Replace them with real ones.
