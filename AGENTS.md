<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npx next build --webpack` — build with webpack instead of turbopack

# Notes

- Route groups `(name)` strip their name from the URL. Use regular `dashboard/` directories for nested routes.
- In Next.js 16, `middleware.ts` is renamed to `proxy.ts` and the function export is named `proxy`.
- Firebase must be guarded with `NEXT_PUBLIC_FIREBASE_API_KEY` check to prevent SSR errors.
- `next/font/google` fails offline; fonts load via CSS `<link>` tags at runtime instead.
- If you see "The system cannot find the path specified" or SST file errors, delete `.next/` and restart.
