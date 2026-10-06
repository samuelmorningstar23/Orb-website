// ─── The plans page ───
//
// No price is published on this site. The page describes the founding hospital
// programme: three places in Hyderabad, one ward each, beside the hospital
// software the hospital already runs. Terms are agreed in person.
//
// PLANS_LEDE is the founder's approved wording, word for word, 3 October 2026.
// The card rows and the "where Orb stands" list restate it and have not been
// signed off line by line. Change the lede only with him, and put no figure
// back here without his say.

/** The one paragraph under the title. Also the search body and the page description. */
export const PLANS_LEDE = 'Founding hospital programme. Three places in Hyderabad. Orb runs beside your hospital software on one ward. It is not ABDM-certified, does not replace your hospital system, and has not yet run in a hospital. Talk to us.'

/** The four rows of the card beside the title. */
export const AT_A_GLANCE: { label: string; value: string; sub: string }[] = [
  { label: 'Where', value: 'Hyderabad', sub: 'three places, terms agreed in person' },
  { label: 'The start', value: 'One ward', sub: 'beside the software you already run' },
  { label: 'Your hospital system', value: 'Stays', sub: 'Orb replaces nothing you run today' },
  { label: 'Terms', value: 'In person', sub: 'agreed with you, and not published here' },
]

/** Where Orb stands today. Shown as a numbered list. */
export const NOT_TODAY: { title: string; body: string }[] = [
  { title: 'It has not run in a hospital yet', body: 'So far Orb has run on a test computer with demo patients. Parts of the ward record are still being built. The founding hospitals are the first wards it runs on, which is why there are only three places.' },
  { title: 'It is not ABDM-certified', body: 'Orb sends nothing to ABDM. Whatever you do with ABDM today stays in your hospital system.' },
  { title: 'It does not replace your hospital system', body: 'Registration, billing, pharmacy and lab stay where they are. Orb runs beside them, on one ward.' },
  { title: 'It is one person today', body: 'I build Orb and I support it. That is why the programme takes three hospitals, one ward each, and no more until there is a second pair of hands.' },
  { title: 'It is not everything on this site', body: 'The founding programme is two things. One of your ward clerks copies the observation sheet into Orb, so your nurses change nothing and no paper stops, and your quality team gets a file each month showing which observation rounds were done, late or left blank. The NEWS2 score, the alerts, the drug checks and the AI screens on other pages are not part of it.' },
]
