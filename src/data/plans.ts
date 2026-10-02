// ─── The plans page ───
//
// No price is published on this site. The page describes the founding hospital
// programme: three places in Hyderabad, one ward each, beside the hospital
// software the hospital already runs. Terms are agreed in person.
//
// The lede and the "not, today" list were approved by the founder word for
// word on 3 October 2026. They say what Orb is not as plainly as what it is.
// Change them only with him, and put no figure back here without his say.

/** The one paragraph under the title. Also the search body and the page description. */
export const PLANS_LEDE = 'Founding hospital programme. Three places in Hyderabad. Orb runs beside your hospital software on one ward. It is not ABDM-certified, does not replace your hospital system, and has not yet run in a hospital. Talk to us.'

/** The four rows of the card beside the title. */
export const AT_A_GLANCE: { label: string; value: string; sub: string }[] = [
  { label: 'Where', value: 'Hyderabad', sub: 'three hospitals, by conversation' },
  { label: 'The start', value: 'One ward', sub: 'beside the hospital software you already run' },
  { label: 'What it replaces', value: 'Nothing', sub: 'your hospital system stays exactly as it is' },
  { label: 'Terms', value: 'In person', sub: 'agreed with you, and not published here yet' },
]

/** What Orb is not, today. Shown as a numbered list. */
export const NOT_TODAY: { title: string; body: string }[] = [
  { title: 'It has not yet run in a hospital', body: 'The product is built and tested on the bench. The founding hospitals are the first wards it runs on, which is why there are only three places.' },
  { title: 'It is not ABDM-certified', body: 'Your hospital system stays your ABDM system. Orb sends nothing to ABDM.' },
  { title: 'It does not replace your hospital system', body: 'Registration, billing, pharmacy and lab stay where they are. Orb runs beside them on one ward.' },
  { title: 'It is one founder today', body: 'That is the honest answer to the question you should ask before signing anything, and it is why the programme starts with one ward.' },
]
