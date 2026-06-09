# Belgrave Capital LTD

Client research portal — a minimal memo site styled after [kostasmurkudis.org/aw26](https://kostasmurkudis.org/aw26).

## Local development

```bash
npm install
npm run dev
```

If you see `Cannot find module './331.js'`, clear the build cache:

```bash
npm run dev:clean
```

The site is public. Use the top-right **client login** link for authorised access.

Default login: `client` / `belgrave2026` (override via `BELGRAVE_USERNAME` and `BELGRAVE_PASSWORD`).

**Remember me:** checked = 30-day cookie; unchecked = session cookie (cleared when the browser closes).

## Deploy

Set `BELGRAVE_USERNAME` and `BELGRAVE_PASSWORD` in Vercel environment variables.
