import type { ReactNode } from 'react'

type RevealDelay = 1 | 2 | 3 | 4 | 5

type PageRevealProps = {
  children: ReactNode
  className?: string
  delay?: RevealDelay
}

export function PageReveal({ children, className, delay }: PageRevealProps) {
  const classes = ['fade-up', delay ? `delay-${delay}` : '', className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
