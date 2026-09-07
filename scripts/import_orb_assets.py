"""Import real product captures from the Orb repo into this site.

Reads docs/website-assets/ in the Orb checkout (frames + manifests from capture.cjs,
2x PNG screenshots) and writes:
  public/orb/flows/<flow>/NN.webp       workflow frames (1512 px wide)
  public/orb/screens/<theme>/<name>.webp module screenshots (1512 px wide, both themes)
  src/data/orbCaptures.ts               manifests + screen titles, typed

Usage: python3 scripts/import_orb_assets.py [/path/to/Orb]
Needs Pillow (the Orb server venv has it).
"""
import json, os, sys
from pathlib import Path
from PIL import Image

ORB = Path(sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/Documents/Projects/Orb'))
SRC = ORB / 'docs' / 'website-assets'
SITE = Path(__file__).resolve().parents[1]
OUT_FLOWS = SITE / 'public' / 'orb' / 'flows'
OUT_SCREENS = SITE / 'public' / 'orb' / 'screens'
WIDTH = 1512

# Screens the site actually shows (name -> short title). Everything else stays in the Orb repo.
SCREENS = {
    'today-doctor-home': 'Today: the doctor home screen',
    'vigil-patient-board': 'Vigil: the ward ordered by NEWS2',
    'vigil-patient-chart': 'Vigil: a chart with live vitals and the Sepsis Six clock',
    'vigil-news2-explained': 'Vigil: every NEWS2 point explained',
    'vigil-patient-story': 'Patient Story: one clinical narrative',
    'vigil-medications-emar': 'Medications and eMAR from the chart',
    'ward-round': 'Ward round',
    'nurse-my-shift': 'Nurse mode: what is due now',
    'nurse-observations-news2-live': 'Nurse mode: NEWS2 computed as the values go in',
    'nurse-administer-medication': 'Nurse mode: administering a dose',
    'nurse-handover-ipass': 'Nurse mode: I-PASS handover draft',
    'orders-cpoe': 'Orders: lab, imaging and procedure orders',
    'orders-order-sets': 'Orders: cited order sets',
    'orders-sepsis-six': 'Orders: Sepsis Six with the allergy interlock',
    'relay-case-rooms': 'Relay: case rooms',
    'relay-case-room': 'Relay: a case room with Vigil alerts inline',
    'sage-panel': 'Sage',
    'scribe': 'Scribe',
    'lens': 'Lens',
    'forecast-census': 'Forecast: census',
    'forecast-capacity': 'Forecast: ward capacity',
    'forecast-discharge-board': 'Forecast: discharge board',
    'command-center': 'Command Center',
    'capacity-simulator': 'Surge Simulator',
    'revenue-integrity': 'Revenue Integrity',
    'appointments': 'Appointments',
    'dietary': 'Diet and Kitchen',
    'pulse-environmental': 'Pulse: environmental signals',
    'surgical-suite-schedule': 'Surgical Suite: schedule',
    'surgical-suite-day': 'Surgical Suite: the day',
    'surgical-suite-active-cases': 'Surgical Suite: active cases',
    'pharmacy-helix-overview': 'Helix: pharmacy overview',
    'pharmacy-verify-queue': 'Helix: pharmacist verification queue',
    'pharmacy-formulary': 'Helix: formulary',
    'bridge-patient-portal': 'Bridge: the patient portal',
    'bridge-medications': 'Bridge: my medications',
    'bridge-labs': 'Bridge: my results',
    'bridge-documents': 'Bridge: my documents',
    'admin-trust': 'Admin: Trust Center',
    'admin-flight': 'Admin: Flight Recorder',
    'admin-models': 'Admin: Model Governance',
    'admin-scorecard': 'Admin: Pilot Scorecard',
    'admin-security': 'Admin: Security',
    'admin-audit': 'Admin: Audit logs',
    'admin-users': 'Admin: Users and roles',
    'admin-data': 'Admin: Data and backups',
    'module-frontdesk': 'Front Desk',
    'module-billing': 'Billing',
    'module-payments': 'Payments',
    'module-payer': 'Insurance and TPA',
    'module-procurement': 'Procurement',
    'module-housekeeping': 'Housekeeping',
    'module-nabh': 'NABH accreditation',
    'module-abdm': 'ABDM',
    'module-workforce': 'Workforce',
    'module-biomedical': 'Equipment',
    'downtime-mode': 'Downtime pack: the printable snapshot',
    'handoff-ipass': 'I-PASS handoff sheet',
    'mfa-enrolment': 'MFA enrolment',
    'command-palette': 'Command palette',
    'login-staff': 'Staff sign-in',
}

def to_webp(src: Path, dst: Path, quality: int) -> int:
    im = Image.open(src).convert('RGB')
    if im.width > WIDTH:
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, 'WEBP', quality=quality, method=6)
    return dst.stat().st_size

flows = []
for mpath in sorted((SRC / 'frames').glob('*/manifest.json')):
    m = json.loads(mpath.read_text())
    steps = []
    for s in m['steps']:
        src = mpath.parent / s['file']
        if not src.exists():
            continue
        dst = OUT_FLOWS / m['id'] / (Path(s['file']).stem + '.webp')
        size = to_webp(src, dst, 84)
        steps.append({'n': s['n'], 'caption': s['caption'], 'src': f"/orb/flows/{m['id']}/{dst.name}", 'hold': s.get('hold', 3200)})
    flows.append({'id': m['id'], 'title': m['title'], 'subtitle': m.get('subtitle', ''), 'user': m.get('user', ''), 'steps': steps})
    print(f"flow {m['id']}: {len(steps)} frames")

screens = {}
total = 0
for theme in ('dark', 'light'):
    for name, title in SCREENS.items():
        src = SRC / 'screenshots' / theme / f'{name}.png'
        if not src.exists():
            print('  missing', theme, name); continue
        dst = OUT_SCREENS / theme / f'{name}.webp'
        total += to_webp(src, dst, 82)
        screens.setdefault(name, {'title': title})
        screens[name][theme] = f'/orb/screens/{theme}/{name}.webp'
print(f'screens: {len(screens)} x 2 themes, {total/1e6:.1f} MB')

ORDER = ['ward-is-alive', 'allergy-interlock', 'wrong-room-warning', 'sage-ask', 'sage-refusal',
         'nurse-shift', 'show-your-work', 'scribe-note', 'pharmacy-verify', 'patient-portal']
flows.sort(key=lambda f: ORDER.index(f['id']) if f['id'] in ORDER else 99)

ts = ['// GENERATED by scripts/import_orb_assets.py from the Orb repo. Do not edit by hand.',
      '// Real screens of a running Orb appliance on seeded demo data (nothing is mocked up).',
      'export interface FlowStep { n: number; caption: string; src: string; hold: number }',
      'export interface Flow { id: string; title: string; subtitle: string; user: string; steps: FlowStep[] }',
      'export interface Screen { title: string; dark: string; light: string }',
      f'export const FLOWS: Flow[] = {json.dumps(flows, indent=2, ensure_ascii=False)}',
      f'export const SCREENS: Record<string, Screen> = {json.dumps(screens, indent=2, ensure_ascii=False)}',
      'export const flowById = (id: string): Flow => { const f = FLOWS.find(x => x.id === id); if (!f) throw new Error("unknown flow " + id); return f }',
      '']
(SITE / 'src' / 'data' / 'orbCaptures.ts').write_text('\n'.join(ts))
print('wrote src/data/orbCaptures.ts')
