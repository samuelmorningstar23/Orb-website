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

/** What a founding ward gets, as built on 9 October 2026. Shown as a numbered list. */
export const WARD_RECORD: { title: string; body: string }[] = [
  { title: 'A screen for the clerk', body: 'She copies each round at the time written on the sheet. A reading she cannot read is marked unreadable, and a box left blank stays blank, never filled in as alert or on air.' },
  { title: 'Mistakes leave a trail', body: 'A set copied wrong is struck out with a reason. It stays on the record, and nothing reads it as current.' },
  { title: 'Your interval, in writing', body: 'The nursing superintendent sets how often rounds are due on the ward, and every change is logged with the old and new values. With no interval set, Orb produces no file rather than guess one.' },
  { title: 'The monthly file', body: 'Rounds due, done, late and missed by shift, readings left blank or unreadable, and the clerk’s typing delay on a line of its own, never counted as late. As a spreadsheet or a readable document.' },
  { title: 'Proof it is the same file', body: 'Each file produced is logged with a fingerprint of the exact document, so the file the assessor saw can be checked against the one on record.' },
  { title: 'Nothing else switched on', body: 'On a founding ward’s computer every other screen is off the menu, and no score, alert or AI model runs.' },
]

/** Where Orb stands today. Shown as a numbered list. */
export const NOT_TODAY: { title: string; body: string }[] = [
  { title: 'It has not run in a hospital yet', body: 'So far Orb has run on a test computer with demo patients. Parts of the ward record are still being built. The founding hospitals are the first wards it runs on, which is why there are only three places.' },
  { title: 'It is not ABDM-certified', body: 'Orb sends nothing to ABDM. Whatever you do with ABDM today stays in your hospital system.' },
  { title: 'It does not replace your hospital system', body: 'Registration, billing, pharmacy and lab stay where they are. Orb runs beside them, on one ward.' },
  { title: 'It is one person today', body: 'I build Orb and I support it. That is why the programme takes three hospitals, one ward each, and no more until there is a second pair of hands.' },
  { title: 'It is not everything on this site', body: 'The founding programme is two things. One of your ward clerks copies the observation sheet into Orb, at the time written on the sheet, so your nurses change nothing and no paper stops. Each month your quality team downloads a file showing which observation rounds were done, late or missed and which readings were left blank or unreadable. On a founding ward’s computer the NEWS2 score, the alerts and the AI screens are switched off, and the drug chart and the other modules on this site are not part of it.' },
]
