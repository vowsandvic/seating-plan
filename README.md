# seating plant

Event floorplan and guest-list editor: arrange round/long tables, a stage and doors on a canvas, assign guests to seats, and export a `data.json` that the companion [seating-display](https://github.com/supat0417/seating-display) app renders for guests.

React + TypeScript + Vite, organized as:

- `src/domain/` — pure business logic (floorplan/guest models, theme color math, CSV parsing, JSON import/export schema, i18n dictionaries). No React/DOM dependency; covered by Vitest.
- `src/state/` — the app's reducer (undo/redo, selection, persistence-worthy state).
- `src/infrastructure/` — localStorage persistence.
- `src/ui/` — React components, organized by feature (`edit/`, `guests/`, `view/`, `topbar/`).

## Event link & QR code

**Link & QR** in the top bar sets the event path, for example `somchai-nida-261031`. The path:

- can only use lowercase a–z, 0–9 and inner hyphens, up to 64 characters
- is saved in the browser and written to the exported `data.json` as `"path"`

seating-display's deploy workflow reads this field and publishes the seat finder at `https://vowsandvic.github.io/seating-display/<path>/`. The same dialog shows that URL as a QR code you can download as a PNG. The QR works once the export has been deployed. The path rules live in `src/domain/eventPath.ts` and must match the check in seating-display's `deploy.yml`.

## Development

```bash
npm install
npm run dev      # dev server
npm test         # domain-layer unit tests
npm run build    # production build to dist/
```

Deploys automatically to GitHub Pages on push to `main` (see `.github/workflows/deploy.yml`).
