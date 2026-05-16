import { Pencil, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { ClientMedicalAlert, ClientProfile } from '@/types'
import { ProfileSectionCard } from '../ProfileSectionCard'

const alertColors: Record<ClientMedicalAlert['color'], string> = {
  purple: 'bg-primary/15 text-primary border-primary/20',
  teal: 'bg-teal-500/15 text-teal-700 border-teal-500/20 dark:text-teal-300',
  blue: 'bg-sky-500/15 text-sky-700 border-sky-500/20 dark:text-sky-300',
  orange: 'bg-orange-500/15 text-orange-700 border-orange-500/20 dark:text-orange-300',
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

interface OverviewTabProps {
  profile: ClientProfile
  onEditProfile?: () => void
}

export function OverviewTab({ profile, onEditProfile }: OverviewTabProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <ProfileSectionCard
          title="Profile Details"
          icon={<User className="h-5 w-5" />}
          action={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={onEditProfile}
              aria-label="Edit profile"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Name" value={profile.name} />
            <DetailField label="Gender" value={profile.gender} />
            <DetailField label="Patient ID" value={profile.patientId} />
            <DetailField label="Occupation" value={profile.occupation} />
            <DetailField label="Type" value={profile.patientType} />
            <DetailField label="Age" value={String(profile.age)} />
            <DetailField label="Funding" value={profile.funding} />
            <DetailField label="Date of Birth" value={profile.dateOfBirth} />
            <DetailField label="Email" value={profile.email} />
            <div className="sm:col-span-2">
              <DetailField label="Address" value={profile.address} />
            </div>
            <DetailField label="Phone" value={profile.phone} />
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard title="Injury & care summary" icon={<Shield className="h-5 w-5" />}>
          <div className="grid gap-4 lg:grid-cols-[minmax(140px,180px)_1fr]">
            <div className="relative flex flex-col items-center rounded-xl bg-muted/40 p-4">
              <div className="relative h-48 w-28">
                <svg viewBox="0 0 80 160" className="h-full w-full text-muted-foreground/40">
                  <ellipse cx="40" cy="18" rx="14" ry="16" fill="currentColor" />
                  <rect x="28" y="34" width="24" height="50" rx="8" fill="currentColor" />
                  <rect x="18" y="38" width="10" height="40" rx="4" fill="currentColor" />
                  <rect x="52" y="38" width="10" height="40" rx="4" fill="currentColor" />
                  <rect x="30" y="84" width="8" height="50" rx="4" fill="currentColor" />
                  <rect x="42" y="84" width="8" height="50" rx="4" fill="currentColor" />
                </svg>
                <span className="absolute left-6 top-10 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                <span className="absolute right-5 top-12 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                <span className="absolute left-1/2 top-14 h-3 w-3 -translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Drag &amp; Rotate</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{profile.injuryTitle}</h4>
              {profile.injuryNotes.map((note, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </ProfileSectionCard>
      </div>

      <ProfileSectionCard title="Alerts & medical history" icon={<User className="h-5 w-5" />}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {profile.alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn('rounded-xl border p-4', alertColors[alert.color])}
            >
              <p className="text-sm font-semibold">{alert.label}</p>
              <p className="mt-1 text-xs opacity-90">{alert.detail}</p>
            </div>
          ))}
        </div>
      </ProfileSectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProfileSectionCard title="Referrer" icon={<User className="h-5 w-5" />}>
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {profile.referrer.name}
            </p>
            <p className="text-muted-foreground">{profile.referrer.practice}</p>
            <DetailField label="Phone" value={profile.referrer.phone} />
            <DetailField label="Email" value={profile.referrer.email} />
            <DetailField label="Referred Address" value={profile.referrer.address} />
          </div>
        </ProfileSectionCard>

        <ProfileSectionCard title="Funding" icon={<Shield className="h-5 w-5" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Claim" value={profile.fundingDetails.claim} />
            <DetailField label="Provider" value={profile.fundingDetails.provider} />
            <DetailField label="Case Manager" value={profile.fundingDetails.caseManager} />
            <DetailField label="Employer" value={profile.fundingDetails.employer} />
          </div>
        </ProfileSectionCard>
      </div>
    </div>
  )
}
