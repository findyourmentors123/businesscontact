# businesscontact

Verified experts, startups, and investors marketplace demo.

This repo contains a small Vite + React app demonstrating the Marketplace UI with an admin approval workflow. Submissions go to a pending queue and can be approved or rejected from the `admin` tab. Data is persisted in `localStorage` for demo purposes.

Run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Publishing options:

- Deploy the build with Vercel / Netlify (recommended) by connecting the repo.
- Or use GitHub Pages: build and publish the `dist` output (or add `gh-pages`).

Core files:

- [src/App.jsx](src/App.jsx) — main UI + approval workflow
- [src/main.jsx](src/main.jsx) — app entry

Automatic deploy options

- **GitHub Pages**: a GitHub Action is included at [.github/workflows/deploy-gh-pages.yml](.github/workflows/deploy-gh-pages.yml). On push to `main` the action builds and publishes the `dist` folder to the `gh-pages` branch. Enable Pages in repository Settings → Pages and pick the `gh-pages` branch (root) if it's not set automatically.
- **Netlify**: a `netlify.toml` is included for easy Netlify deploys. Connect the repo in Netlify and the default build settings will use the `npm run build` command and publish the `dist` folder.
- **Vercel**: connect the repo and use the default Vite settings — Vercel will detect the project and deploy automatically. No extra config required.

Vercel CI deploy (optional)

- A `vercel.json` is included to set the static-build output: [vercel.json](vercel.json).
- If you prefer automated CI deploys via GitHub Actions, a workflow is included at [.github/workflows/deploy-vercel.yml](.github/workflows/deploy-vercel.yml). To use it add the following repository secrets:
	- `VERCEL_TOKEN` — a personal token from Vercel (User Settings → Tokens)
	- `VERCEL_ORG_ID` — your Vercel organization ID (project settings)
	- `VERCEL_PROJECT_ID` — your Vercel project ID (project settings)

Steps to deploy with Vercel (recommended quick option):

1. Go to https://vercel.com/new and import this repository.
2. Set the Framework Preset to `Vite` if not auto-detected.
3. Build command: `npm run build`, Output Directory: `dist`.
4. Deploy; Vercel will provide a production URL.


