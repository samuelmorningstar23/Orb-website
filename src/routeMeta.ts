// Single source of truth for per-route <head> content and the prerendered
// static shell. Consumed at runtime by <RouteHead /> (SPA navigation) and at
// build time by scripts/prerender.mjs (static HTML, sitemap).
// Add an entry here whenever a route is added to App.tsx.

export const SITE_ORIGIN = 'https://orbintelligence.co'

export type RouteMeta = {
  path: string
  /** Full <title> tag content. */
  title: string
  /** Meta description — aim for 140–160 characters. */
  description: string
  /** H1 for the prerendered static shell. */
  h1: string
  /** One-paragraph summary for the prerendered static shell. */
  summary: string
}

export const ROUTE_META: RouteMeta[] = [
  {
    path: '/',
    title: 'Orb — Hospital Intelligence. Same data, better decisions.',
    description:
      'Orb is local-first hospital intelligence: AI that runs on hardware inside your hospital, works alongside the systems you already have, and acts the moment a clinician confirms. Patient data never leaves the building.',
    h1: 'Hospital Intelligence. Same data, better decisions.',
    summary:
      'Orb runs on hardware inside your hospital walls, works alongside your existing systems, and acts on what it sees — the moment a clinician confirms. Fourteen modules, one intelligence, no patient data leaving the building.',
  },
  {
    path: '/sage',
    title: 'Sage — Ambient Clinical Copilot · Orb',
    description:
      'Sage follows the conversation on the ward, understands the moment, and carries out the next step — the order, the alert, the note — the instant a clinician confirms.',
    h1: 'Sage — Ambient Clinical Copilot',
    summary:
      'Ask it anything clinical, or let it follow the conversation on the ward. Sage drafts the next step and carries it through the instant a clinician confirms.',
  },
  {
    path: '/vigil',
    title: 'Vigil — Live Vitals & Early Warning · Orb',
    description:
      'Vigil monitors physiological changes and flags early signs of patient risk, so nurses can react before a patient deteriorates.',
    h1: 'Vigil — Live Vitals & Early Warning',
    summary:
      'Monitors physiological changes and flags early signs of patient risk, so ward teams can react before a patient deteriorates.',
  },
  {
    path: '/scribe',
    title: 'Scribe — Hands-Free Clinical Documentation · Orb',
    description:
      'Scribe turns spoken bedside conversations into structured clinical notes and discharge summaries — processed entirely on-site, so what is said in the room stays in the room.',
    h1: 'Scribe — Hands-Free Documentation',
    summary:
      'Turns spoken bedside conversations into structured clinical notes and discharge summaries, hands-free — with all audio processed on hospital hardware.',
  },
  {
    path: '/lens',
    title: 'Lens — Bedside Image Review · Orb',
    description:
      'Lens reviews X-rays, ECGs, and scans at the bedside and surfaces draft observations for a clinician to confirm — processed on-site.',
    h1: 'Lens — Bedside Image Review',
    summary:
      'Reviews X-rays, ECGs, and scans at the bedside and surfaces draft observations for a clinician to confirm.',
  },
  {
    path: '/relay',
    title: 'Relay — Secure Clinical Messaging · Orb',
    description:
      'Relay brings ward escalations, case reviews, and clinical agreements into secure, archived team channels — where Orb notices what matters and offers to act.',
    h1: 'Relay — Secure Clinical Messaging',
    summary:
      'Secure, case-focused rooms that connect clinical teams, with ward escalations landing in the right channel with context attached.',
  },
  {
    path: '/helix',
    title: 'Helix — Medication Operations · Orb',
    description:
      'Helix tracks pharmacy operations, drug histories, and bedside administration — with allergy and interaction checks at the point of order, running on-site.',
    h1: 'Helix — Medication Operations',
    summary:
      'Tracks pharmacy operations, drug histories, and bedside administration — with allergy and interaction checks at the point of order.',
  },
  {
    path: '/surgical-suite',
    title: 'Surgical Suite — Operating-Room Coordination · Orb',
    description:
      'Live surgical schedules, safety checklists, and emergency alerts that keep operating rooms coordinated.',
    h1: 'Surgical Suite — Operating-Room Coordination',
    summary:
      'Live surgical schedules, safety checklists, and emergency alerts that keep operating rooms coordinated.',
  },
  {
    path: '/pulse',
    title: 'Pulse — Environmental & Population Signals · Orb',
    description:
      'Pulse watches local air quality, weather, and community illness — and flags which wards will feel the pressure first.',
    h1: 'Pulse — Environmental & Population Signals',
    summary:
      'Watches local air quality, weather, and community illness activity that drive admissions — and flags which wards will feel the pressure first.',
  },
  {
    path: '/bridge',
    title: 'Bridge — Patient Understanding · Orb',
    description:
      'Bridge explains care, medications, and next steps in plain, reassuring language for patients and families.',
    h1: 'Bridge — Patient Understanding',
    summary:
      'Explains care, medications, and next steps in plain, reassuring language for patients and families.',
  },
  {
    path: '/forecast',
    title: 'Forecast — Predictive Capacity Planning · Orb',
    description:
      'Forecast anticipates length-of-stay and discharge readiness, giving teams a clear bed-availability picture for the days ahead.',
    h1: 'Forecast — Predictive Capacity Planning',
    summary:
      'Anticipates length-of-stay and discharge readiness, giving teams a clear bed-availability picture for the days ahead.',
  },
  {
    path: '/appointments',
    title: 'Appointments — Scheduling & Follow-up · Orb',
    description:
      'Appointments keeps every follow-up, review, and clinic slot in order — with reminders routed through the messaging gateway your hospital already runs.',
    h1: 'Appointments — Scheduling & Follow-up',
    summary:
      'Keeps every follow-up, review, and clinic slot in order, so no patient falls through the gap between visits.',
  },
  {
    path: '/command-center',
    title: 'Command Center — House-Wide Operations · Orb',
    description:
      'The whole hospital on one screen — census, acuity, and emerging pressure — so operational teams see problems before they become crises.',
    h1: 'Command Center — House-Wide Operations',
    summary:
      'The whole hospital on one screen — census, acuity, and emerging pressure — so you see problems before they become crises.',
  },
  {
    path: '/revenue-integrity',
    title: 'Revenue Integrity — Coding & Reimbursement · Orb',
    description:
      'Revenue Integrity catches the coding and documentation gaps that quietly cost hospitals millions — every suggestion reviewed and confirmed by your coders.',
    h1: 'Revenue Integrity — Coding & Reimbursement',
    summary:
      'Catches the coding and documentation gaps that quietly cost hospitals millions — turning care already delivered into reimbursement owed.',
  },
  {
    path: '/surge-simulator',
    title: 'Surge Simulator — Capacity & Surge Planning · Orb',
    description:
      'Model a surge, a closure, or a staffing gap before it happens — and see hours-to-overflow while there is still time to act.',
    h1: 'Surge Simulator — Capacity & Surge Planning',
    summary:
      'Model a surge, a closure, or a staffing gap before it happens — and see hours-to-overflow while there is still time to act.',
  },
  {
    path: '/about',
    title: 'About — The team behind Orb',
    description:
      'Orb is built by a small founding team pairing engineering with day-one clinical judgement: Samuel Christ, Dr. Ashritha Vedagiri, and Hemkumar Amasa.',
    h1: 'The team behind Orb',
    summary:
      'Orb pairs engineering with clinical judgement from day one. Meet the founding team: Samuel Christ, Dr. Ashritha Vedagiri, and Hemkumar Amasa.',
  },
  {
    path: '/security',
    title: 'Security & Data Boundaries · Orb',
    description:
      'Exactly what stays inside your hospital and what crosses the network: Orb processes patient data on-site with no cloud egress, an allowlisted outbound path, and a clinician-confirm gate on every action.',
    h1: 'Security & data boundaries',
    summary:
      'Patient data is processed on hospital hardware and never leaves the building. Outbound traffic is limited to an allowlist you control. Every action is clinician-confirmed and recorded to a tamper-evident audit trail.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy · Orb',
    description:
      'How the Orb website handles visitor data: no advertising trackers, no analytics cookies, self-hosted fonts, and a demo form used only to respond to your enquiry.',
    h1: 'Privacy Policy',
    summary:
      'This website sets no advertising trackers and loads no third-party fonts. The demo form is used only to respond to your enquiry.',
  },
  {
    path: '/terms',
    title: 'Terms of Use · Orb',
    description:
      'Terms of use for the Orb website: informational content, simulated product visuals, and no medical advice.',
    h1: 'Terms of Use',
    summary:
      'The content of this website is informational, product visuals are simulated demonstrations, and nothing here constitutes medical advice.',
  },
]

export function metaForPath(pathname: string): RouteMeta {
  const clean = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return ROUTE_META.find((m) => m.path === clean) ?? ROUTE_META[0]
}
