import { useCallback, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAppSelector } from '@/redux/hooks'
import { Button } from '@/components/ui/button'
import type { ClientProfileTab } from '@/types'
import { getClientProfileById } from './clientProfileData'
import { ClientProfileShell } from './components/ClientProfileShell'
import { OverviewTab } from './components/tabs/OverviewTab'
import { SessionsTab } from './components/tabs/SessionsTab'
import { NotesTab } from './components/tabs/NotesTab'
import { ComingSoonTab } from './components/tabs/ComingSoonTab'

const VALID_TABS: ClientProfileTab[] = [
  'overview',
  'sessions',
  'notes',
  'documents',
  'report',
  'exercises',
  'invoice',
  'outcome',
]

function parseTab(value: string | null): ClientProfileTab {
  if (value && VALID_TABS.includes(value as ClientProfileTab)) {
    return value as ClientProfileTab
  }
  return 'overview'
}

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { list } = useAppSelector((state) => state.myPatientsList)

  const profile = useMemo(
    () => (id ? getClientProfileById(list, id) : null),
    [id, list]
  )

  const activeTab = parseTab(searchParams.get('tab'))

  const setActiveTab = useCallback(
    (tab: ClientProfileTab) => {
      setSearchParams({ tab }, { replace: true })
    },
    [setSearchParams]
  )

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-lg text-muted-foreground">Patient not found</p>
        <Button variant="link" onClick={() => navigate('/my-patients-list')}>
          Back to patients management
        </Button>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            profile={profile}
            onEditProfile={() => navigate(`/my-patients-list/${profile.id}/edit`)}
          />
        )
      case 'sessions':
        return <SessionsTab profile={profile} />
      case 'notes':
        return <NotesTab profile={profile} />
      case 'documents':
        return <ComingSoonTab label="Documents" />
      case 'report':
        return <ComingSoonTab label="Report" />
      case 'exercises':
        return <ComingSoonTab label="Exercises" />
      case 'invoice':
        return <ComingSoonTab label="Invoice" />
      case 'outcome':
        return <ComingSoonTab label="Outcome" />
      default:
        return <OverviewTab profile={profile} />
    }
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
        onTabChange={setActiveTab}
        onEdit={() => navigate(`/my-patients-list/${profile.id}/edit`)}
        onDelete={() => toast.info('Delete patient is not available in demo mode.')}
      >
        {renderTab()}
      </ClientProfileShell>
    </motion.div>
  )
}
