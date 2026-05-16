import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { toast } from 'sonner'
import { useAppSelector } from '@/redux/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ClientProfileTab } from '@/types'
import { getClientProfileById } from './clientProfileData'
import { ClientProfileShell } from './components/ClientProfileShell'
export default function ClientProfileEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { list } = useAppSelector((state) => state.myPatientsList)
  const [activeTab] = useState<ClientProfileTab>('overview')

  const baseProfile = useMemo(
    () => (id ? getClientProfileById(list, id) : null),
    [id, list]
  )

  const [form, setForm] = useState(() =>
    baseProfile
      ? {
          name: baseProfile.name,
          phone: baseProfile.phone,
          emergencyContact: baseProfile.emergencyContact,
          occupation: baseProfile.occupation,
          dateOfBirth: baseProfile.dateOfBirth,
          gender: baseProfile.gender,
          address: baseProfile.address,
        }
      : null
  )

  if (!baseProfile || !form) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-lg text-muted-foreground">Patient not found</p>
        <Button variant="link" onClick={() => navigate('/my-patients-list')}>
          Back to patients management
        </Button>
      </div>
    )
  }

  const profile = { ...baseProfile, ...form }

  const handleSave = () => {
    toast.success('Profile updated successfully')
    navigate(`/my-patients-list/${baseProfile.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <ClientProfileShell
        profile={profile}
        activeTab={activeTab}
        onTabChange={() => {}}
        pageTitle="Edit Clients Profile"
        backHref={`/my-patients-list/${baseProfile.id}`}
        backLabel="Back to Clients Profile"
        showActions={false}
      >
        <div className="rounded-2xl bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-foreground">Edit Profile Details</h3>
            </div>
            <Button
              type="button"
              className="h-10 rounded-xl bg-secondary px-6 text-secondary-foreground hover:bg-secondary/90"
              onClick={handleSave}
            >
              Save &amp; Change
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="rounded-xl border-0 bg-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                className="rounded-xl border-0 bg-input"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                className="rounded-xl border-0 bg-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                className="rounded-xl border-0 bg-input"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency contact</Label>
              <Input
                id="emergency"
                className="rounded-xl border-0 bg-input"
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                className="rounded-xl border-0 bg-input"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="rounded-xl border-0 bg-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>
      </ClientProfileShell>
    </motion.div>
  )
}
