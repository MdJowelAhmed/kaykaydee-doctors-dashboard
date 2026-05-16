import type { ElementType, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DashboardStatCardProps {
  title: string
  value: string
  footer: ReactNode
  icon: ElementType
  index?: number
}

export function DashboardStatCard({
  title,
  value,
  footer,
  icon: Icon,
  index = 0,
}: DashboardStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl bg-card p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      <div className="mt-2 text-xs text-muted-foreground">{footer}</div>
    </motion.div>
  )
}
