# UrbanHub-X

UrbanHub-X is a role-based community safety and property-operations prototype for the City of Elmina. It brings resident safety tools, security incident response, and property hazard management into one browser app.

**Live deployment:** [urban-hub-x-sdp.vercel.app](https://urban-hub-x-sdp.vercel.app/)

> **Prototype notice:** This project is a demonstration, not a production emergency-response or property-management service. It uses seeded and simulated data, and it does not provide real emergency dispatch, live resident tracking, a remote database, or authenticated access control.

## Features

### Resident

- View the resident home and safety information.
- Select an origin and destination and compare **Safest**, **Fastest**, and **Shortest** walking-route options.
- Start a journey and view its route and checkpoint information.
- Submit community hazard reports.
- Trigger simulated SOS, fall-detection, and unsafe-assistance flows.
- Use the **Walking Demo** and **Fall Demo** controls to exercise prototype scenarios.

Custom walking routes use the Google Maps JavaScript Routes library and request pedestrian directions. When three custom routes cannot be loaded, the route comparison falls back to the fixed Elmina demo routes. The UI identifies that fallback and its fixed endpoints; it is not a route for the locations the user selected. Route safety scores are estimates based on mapped prototype hazard and lamp data, not a safety guarantee.

### Security

- Review seeded and simulated safety alerts.
- Acknowledge alerts, mark responses in progress, assign guards, add incident notes, and resolve alerts.
- Review checkpoint event information.
- View alert totals grouped by status.

### Property management

- View hazard information and the township hazard map.
- Review the verification queue and priority ranking.
- Update hazard status and report metrics.
- Compare route-cost impacts and explore intervention and budget scenarios.

## Requirements

- Node.js and npm
- A modern web browser
- Optional: a Google Maps Platform API key with the required Maps JavaScript and Routes APIs enabled and billing/quota configured. Without a usable key or quota, Google Maps features may be unavailable; the app provides schematic maps and demo routes where applicable.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To enable Google Maps, create a `.env.local` file in the project root:

```dotenv
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Restart the Vite server after changing environment variables. Do not commit API keys. Configure appropriate API restrictions and quotas in Google Cloud.

## Build and preview

```powershell
npm run build
npm run preview
```

The production build is written to `dist/`. Vite may report a large JavaScript chunk during the build; this is currently a warning and does not by itself mean the build failed.

## Demo usage

1. Open the app and choose **Resident**, **Security**, or **Property** from the role-selection screen.
2. Use the role navigation to explore that dashboard.
3. In the resident experience, choose **Night Path** to select route locations, then compare the available route options.
4. Use the demo controls to simulate walking or fall-detection events.
5. Switch between roles to see shared prototype data updates in the same browser.

The sign-in screen is a role-selection demo, not a real authentication system. Its displayed demo credentials are illustrative and do not secure the application.

## Data and persistence

This application has no server-side database. The NightSafe prototype stores selected state in browser `localStorage`, including role, alerts, hazards, checkpoint events, budget, and applied interventions. The state is local to the browser profile and is not synchronized across devices or users. Some other prototype views also use browser-local state.

Use the in-app demo reset when you want to return supported NightSafe data to its seeded scenario. Clearing the site’s browser storage also removes locally persisted prototype state.

## Project structure

```text
src/
  components/       Shared UI components, maps, notifications, and dialogs
  context/          Shared application and NightSafe prototype state
  data/             Seed records, Elmina locations, map coordinates, and models
  utils/            Google Maps loader and pedestrian-routing helpers
  views/
    resident/       Resident safety, route, journey, and reporting flows
    security/       Security alert and checkpoint dashboard
    property/       Property hazard, priority, and intervention dashboard
  App.jsx           Role-based application shell
  main.jsx          React entry point and context provider
```

## Technology

- React 19
- Vite 6
- Tailwind CSS
- Lucide React icons
- Google Maps JavaScript API and Routes library (optional)

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

There is no test script configured in `package.json` at this time.
