# Compose Community

This is our Discord or Slack alternative, built on top of Compose, mainly to dogfood, and also because we want to explore super-niche community-created, community software, and end-programmer programming.

## How to use

This project is currently pointed at a local Compose Websocket Server (`ws://localhost:3000`), so you'll need to setup and run `compose-node` to provide the local backend for this project. (You can also point this at the production compose server link, found on Railway.)

- Install dependencies `npm install`
- Run dev server `npm start`

## Project structure

This project uses Create React App for hot-module reloading.

- `public/`
  - `index.html` - entry point, where React binds to, some styles
  - `manifest.json` - [read more here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
- `src/`
  - `App.tsx` (the top-level React component)
  - `components/` (all the React components)
  - `state/` (all the Compose state)
  - `compose-client-dist` (the rsync'd `dist` folder from `compose-node/client`)

## Deployment

Deployment happens automatically on new pull requests and on merging to main, via Vercel.
