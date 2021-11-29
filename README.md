# Compose Community

This is our Discord or Slack alternative, built on top of Compose, mainly to dogfood, and also because we want to explore super-niche community-created, community software, and end-programmer programming.

## How to use

- Install dependencies `npm install`
- Run dev server `npm start`

## Project structure

This project uses Create React App.

- `public/`
  - `index.html` - entry point, where React binds to, some styles
  - `manifest.json` - [read more here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
- `src/`
  - `App.tsx` (the top-level React component)
  - `components/` (all the React components)
  - `state/` (all the Compose state)
  - `compose-client-dist` (the rsync'd `dist` folder from `compose-node/client`)

## Deployment

This project isn't deployed anywhere currently. We may use github pages 🤷