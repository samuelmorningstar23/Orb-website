import { useMemo, useState } from 'react'
import Capture, { type CaptureFrame, type CaptureTab } from './Capture'
import { flowById } from '../../data/orbCaptures'

interface FlowCaptureProps {
  /** One or more workflow ids from orbCaptures. Several become a switcher. */
  flows: string[]
  /** Short labels for the switcher, in the same order as `flows`. */
  labels?: string[]
  label?: string
  autoplay?: boolean
}

/**
 * A captured workflow from the demo script (docs/DEMO_SCRIPT.md in the Orb
 * repo): real frames, in order, each with the caption the capture wrote for it.
 */
export default function FlowCapture({ flows, labels, label, autoplay }: FlowCaptureProps) {
  const [active, setActive] = useState(flows[0])
  const tabs: CaptureTab[] | undefined = flows.length > 1
    ? flows.map((id, i) => ({ id, label: labels?.[i] ?? flowById(id).title }))
    : undefined

  const flow = flowById(active)
  const frames = useMemo<CaptureFrame[]>(() => flow.steps.map(s => ({
    src: s.src,
    caption: s.caption,
    hold: Math.max(2800, Math.min(s.hold, 7000)),
    fit: 'cover',
    group: flows.length > 1 ? flow.title : undefined,
  })), [flow, flows.length])

  return (
    <Capture
      frames={frames}
      label={label ?? flow.title}
      tabs={tabs}
      activeTab={active}
      onTabChange={setActive}
      autoplay={autoplay}
    />
  )
}
