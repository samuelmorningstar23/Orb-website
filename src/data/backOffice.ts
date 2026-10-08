// ─── The rest of the hospital ───
// The administrative modules that run on the same computer as the ward. Each
// line describes the screen in the capture beside it, as the product stands on
// 6 October 2026. None of these is part of the founding programme, where the
// hospital's own systems stay in charge.

export interface BackOfficeModule { name: string; line: string; shot: string }

export const BACK_OFFICE_LEDE = 'Front desk, billing, payments, insurance, stores, housekeeping, rosters, equipment, the kitchen, NABH evidence and ABDM records run on the same computer and the same record as the ward. Each one can be switched off hospital by hospital, and none is part of the founding programme, where your own systems stay in charge.'

export const BACK_OFFICE: BackOfficeModule[] = [
  { name: 'Front desk', shot: 'module-frontdesk', line: 'Register an outpatient visit and issue a token, and move patients between wards. With outpatient consultations switched on, the doctor calls, skips and recalls the queue.' },
  { name: 'Billing', shot: 'module-billing', line: 'A price list, charges captured from the ward, interim and final invoices, and credit notes, all printable.' },
  { name: 'Payments', shot: 'module-payments', line: 'Receipts, advances and refunds at a counter whose cash is counted at the end of each shift. A difference is recorded, never absorbed.' },
  { name: 'Insurance and TPA', shot: 'module-payer', line: 'Cover on file, pre-authorisations, claims and denials, with what is stuck and for how long. Orb sends nothing to a payer; the desk records what it did on the payer’s portal.' },
  { name: 'Procurement and stores', shot: 'module-procurement', line: 'Vendors, indents, purchase orders, goods receipt and stock for everything that is not a medicine.' },
  { name: 'Housekeeping', shot: 'module-housekeeping', line: 'Cleaning requests, turnaround times, linen, and each ward’s bed readiness.' },
  { name: 'Workforce', shot: 'module-workforce', line: 'The duty roster, attendance and overtime, with a payroll export. Statutory deductions stay with your payroll provider.' },
  { name: 'Biomedical equipment', shot: 'module-biomedical', line: 'The equipment register with calibration and maintenance due dates, breakdowns and service contracts. A monitor past its calibration is flagged, because Orb reads numbers from it.' },
  { name: 'Diet and kitchen', shot: 'dietary', line: 'Diet orders by ward, meal counts and the kitchen indent. Nil by mouth is shown on its own, with who ordered it and until when.' },
  { name: 'NABH evidence', shot: 'module-nabh', line: 'Quality indicators from Orb’s own records, an incident register from report to closure, and a dated evidence pack. An indicator without enough data says so instead of showing zero.' },
  { name: 'ABDM records', shot: 'module-abdm', line: 'ABHA numbers, care-context links and consents, recorded as the desk does them on the national portal. Orb is not connected to ABDM and sends nothing to it.' },
]

/** Said once, under the list: what is not finished. */
export const BACK_OFFICE_BUILDING = 'Beds and admissions, the laboratory and the pharmacy store are being built, and stay switched off until they are finished.'
