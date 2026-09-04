import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

/** One easing for every reveal on the site, so motion reads as a single voice. */
export const EASE = [0.22, 1, 0.36, 1] as const

type Tag = 'div' | 'section' | 'ul' | 'li' | 'span' | 'p'

type RevealProps = {
  children: ReactNode
  className?: string
  id?: string
  style?: CSSProperties
  as?: Tag
  /** Seconds to wait once in view. */
  delay?: number
  /** Pixels to lift from. */
  y?: number
  /** Fraction of the element that must be visible before it plays. */
  amount?: number
}

/** Fades and lifts its children into place the first time they scroll on screen. */
export function Reveal({ children, className, id, style, as = 'div', delay = 0, y = 28, amount = 0.2 }: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      id={id}
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Tag>
  )
}

const parentVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

type StaggerProps = { children: ReactNode; className?: string; as?: Tag; amount?: number; style?: CSSProperties }

/** A group whose items appear one after another as the group scrolls into view. */
export function Stagger({ children, className, as = 'div', amount = 0.2, style }: StaggerProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag className={className} style={style} variants={parentVariants} initial={reduce ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Tag>
  )
}

export function StaggerItem({ children, className, as = 'div', style }: Omit<StaggerProps, 'amount'>) {
  const Tag = motion[as]
  return (
    <Tag className={className} style={style} variants={childVariants}>
      {children}
    </Tag>
  )
}
