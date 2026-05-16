interface ComingSoonTabProps {
  label: string
}

export function ComingSoonTab({ label }: ComingSoonTabProps) {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-card p-8 shadow-sm">
      <p className="text-center text-muted-foreground">
        <span className="block text-base font-medium text-foreground">{label}</span>
        Content coming soon.
      </p>
    </div>
  )
}
