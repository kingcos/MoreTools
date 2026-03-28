# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Google Ads (AdSense)

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `VITE_ADSENSE_CLIENT_ID` (publisher id, default is `ca-pub-9925978992661955`)
   - `VITE_ADSENSE_SLOT_TOOLS` (recommended: one slot shared by all tools)
   - Optional: use `VITE_ADSENSE_SLOT_*` per page to override.
3. Build and deploy in production mode.

Notes:
- Ads only render in production (`import.meta.env.PROD`).
- If slot env vars are missing, the ad area is hidden automatically.
