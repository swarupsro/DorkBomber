# DorkBomber

A simple passive reconnaissance launcher for bug bounty workflows.

DorkBomber helps you build target-scoped Google dork queries for finding common endpoints, exposed files, API documentation, authentication flows, and public OSINT pivots. It is designed for authorized testing only.

## Live Demo

Production URL: <https://dork-bomber-git-main-swarup-sahas-projects.vercel.app/>

## Features

- Target-scoped dork generation for authorized domains
- Endpoint discovery workflow for APIs, admin panels, uploads, callbacks, and staging hosts
- Leak hunting queries for configs, backups, logs, database dumps, and secrets
- Auth and SSO pivots for login, OAuth, SAML, OIDC, and reset flows
- External OSINT pivots for crt.sh, Wayback, GitHub, Shodan, Censys, VirusTotal, and more
- Copy single queries or export a full workflow pack
- Lightweight static frontend with no backend requirement

## How To Use

1. Open the live demo or run the project locally.
2. Enter an authorized target domain, for example:

   ```text
   example.com, api.example.com
   ```

3. Choose a workflow from the sidebar.
4. Select a dork action.
5. Open the generated search query or copy it for manual review.

## Local Usage

This project is a static web app. No build step is required.

```bash
git clone https://github.com/swarupsro/DorkBomber.git
cd DorkBomber
```

Then open `index.html` in your browser.

## Important Scope Note

DorkBomber does not scan hosts, exploit systems, bypass access controls, or scrape Google. It only prepares passive search queries and external OSINT links.

Use this tool only on assets you are authorized to test, such as bug bounty programs, private labs, or your own systems.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

## Disclaimer

This project is intended for ethical security research and authorized bug bounty reconnaissance. The user is responsible for following all applicable laws, platform rules, and program scope requirements.
