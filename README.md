# AssistFlow — Remote Executive Assistant Workspace

AssistFlow is a client-side productivity workspace engineered for Virtual Assistants (VAs), Executive Assistants (EAs), and Operations Coordinators to manage daily executive administrative workflows.

## Overview

Designed with an intentional warm-palette SaaS aesthetic, AssistFlow provides administrative tooling for high-volume task tracking, calendar management, 3-stage meeting debriefs, stakeholder follow-ups, client directories, business travel dossiers, and printable executive weekly workload reports.

## Core Features

- **Executive Daily Dashboard**: Live greeting, calculated workload statistics, schedule timeline, priority tasks, blocked "Waiting On" tracking, and quick creation shortcuts.
- **Executive Calendar**: Month-view calendar with day-selection drawer, event categorization (Meetings, Calls, Deadlines, Travel, Deep Work), and scheduling.
- **Task Management**: Filterable task board with both List and Kanban views, priority levels, category tags, overdue indicators, and client linkages.
- **Meetings Management**: Structured three-stage workflow: Pre-meeting preparation checklist, Live in-session transcript/notes editor, and Post-meeting decisions and assigned action items with one-click conversion to tasks.
- **Follow-up Tracker**: Systematic tracking of outbound communications, response status cycles (Pending, Due Today, Waiting Response, Followed Up, Closed), and reschedule tools.
- **Client Accounts Directory**: Corporate stakeholder profiles connected directly to associated tasks, meetings, and follow-ups.
- **Stakeholder Contacts**: Filterable directory for executives, clients, legal counsel, and vendors.
- **Business Travel Planner**: Travel dossier builder featuring flight parameters, lodging, day-by-day itineraries, and an executive pre-departure readiness checklist (preloaded with a realistic sample: "Lagos to London Business Week").
- **Executive Workload Reports**: Real-time computed reporting summaries with automated executive prose, workload statistics, and print-ready stylesheet (PDF export).
- **Global Search**: Modal search (`Cmd+K` / `Ctrl+K`) querying tasks, meetings, clients, contacts, and follow-ups.
- **Attention Center**: Notification drawer tracking overdue deliverables, same-day meetings, and items awaiting external approvals.
- **Data Persistence & Portability**: Local browser persistence via `localStorage`, JSON export/import backups, and sample demonstration data reset.

## Technology Stack

- **Framework**: React 19, TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS
- **Iconography**: Lucide React
- **Persistence**: Browser `localStorage` (Zero external backend or cloud database dependencies)

## Local Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/assistflow.git
cd assistflow
npm install
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build

Create an optimized static build:

```bash
npm run build
```

The production output will be generated inside the `dist/` directory.

## GitHub Pages Deployment

The application includes an automated GitHub Actions deployment workflow in `.github/workflows/deploy.yml` and is pre-configured with relative asset paths (`base: './'` in `vite.config.ts`).

To publish via GitHub Actions:

1. Push this repository to GitHub (ensure branch is `main` or `master`).
2. In your repository on GitHub, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, ensure **GitHub Actions** is selected.
4. Click the **Actions** tab at the top of your GitHub repository. The workflow `Deploy to GitHub Pages` will trigger automatically (or click **Run workflow**).
5. Once the job completes with a green checkmark, your live URL will appear under **Settings > Pages** (e.g. `https://<username>.github.io/<repo-name>/`).

## Limitations of Browser-Local Storage

- Workspace records are saved locally in the client browser's `localStorage`.
- Data is isolated to the specific browser and device being used; it does not automatically synchronize across multiple distinct browsers or machines.
- Clearing browser site data or clearing cache will remove locally saved records unless previously backed up via the JSON Export feature in Workspace Settings.
- To transfer data between devices, use **Settings > Export JSON File** and upload the file using **Upload JSON Backup** on the new device.
