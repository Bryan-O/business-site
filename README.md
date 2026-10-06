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

## Before launch

- Replace the placeholder email (`hello@example.com`) in `src/site.json` and `public/script.js`.
- The contact form opens the visitor's email app. Connect a real form service.
- Prices, turnaround times and the concept projects on the Work page are examples.
