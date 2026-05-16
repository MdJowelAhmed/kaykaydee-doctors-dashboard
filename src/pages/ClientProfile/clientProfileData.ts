import type {
  ClientMedicalAlert,
  ClientNote,
  ClientProfile,
  ClientSessionAppointment,
  MyPatientListRecord,
} from '@/types'

const INJURY_NOTES = [
  'Pain intensity 6/10, worse with prolonged sitting. MRI shows L4-L5 disc bulge with mild nerve root compression.',
  'Restricted lumbar flexion and extension. Radicular symptoms into left leg. Avoid heavy lifting and prolonged flexion.',
]

const NOTE_BODY = `Subjective: Patient reports gradual improvement in lumbar pain over the past two weeks. Pain 4/10 at rest, 6/10 with prolonged sitting. No new neurological symptoms.

Objective: Lumbar flexion 70°, extension 25°. SLR negative bilaterally. Palpation: mild paraspinal tenderness L4-L5.

Assessment: L4-L5 disc bulge with radicular pain — improving with conservative management.

Plan: Continue current exercise programme. Review in 2 weeks. Consider referral for hydrotherapy if plateau.`

function buildSessions(record: MyPatientListRecord): ClientSessionAppointment[] {
  const rows: ClientSessionAppointment[] = []
  for (let i = 0; i < 8; i++) {
    rows.push({
      id: `${record.id}-sess-${i}`,
      serialNo: String(Number(record.serialNo) + i),
      userId: record.userId,
      patientName: record.patientName,
      service: record.service,
      patientType: i % 2 === 0 ? 'new' : 'returning',
      status: i % 3 === 0 ? 'pending' : 'confirmed',
    })
  }
  return rows
}

function buildNotes(): ClientNote[] {
  return [
    {
      id: 'n1',
      category: 'SOAP',
      title: 'Mid-claim review (SOAP)',
      date: '2-2-2026 / 2:20',
      practitioner: 'Dr. Maya Chen',
      body: NOTE_BODY,
    },
    {
      id: 'n2',
      category: 'AI',
      title: 'AI summary — week 4',
      date: '28-1-2026 / 11:00',
      practitioner: 'Dr. Maya Chen',
      body: 'AI-generated summary: Functional improvement noted. Patient adherent to home exercise programme. Recommend continuation of current plan.',
    },
    {
      id: 'n3',
      category: 'Dictation',
      title: 'Initial assessment dictation',
      date: '15-1-2026 / 9:45',
      practitioner: 'Dr. Linh Tran',
      body: 'Dictated note: Patient presented with acute lumbar pain following workplace injury. Full assessment completed. Workcover claim active.',
    },
    {
      id: 'n4',
      category: 'Reports',
      title: 'MRI report summary',
      date: '10-1-2026 / 14:30',
      practitioner: 'Dr. Maya Chen',
      body: 'MRI lumbar spine: L4-L5 disc bulge with mild nerve root contact. No cauda equina. Correlates with clinical findings.',
    },
  ]
}

function buildAlerts(): ClientMedicalAlert[] {
  return [
    { id: 'a1', label: 'Penicillin', detail: 'Rash — Childhood', color: 'purple' },
    { id: 'a2', label: 'Hypertension', detail: 'Controlled lisinopril 10mg', color: 'teal' },
    { id: 'a3', label: 'Type 2 Diabetes', detail: 'Hba1c 6.4%', color: 'blue' },
    { id: 'a4', label: 'Workcover', detail: 'unit 2026-06-15', color: 'orange' },
  ]
}

export function buildClientProfile(record: MyPatientListRecord): ClientProfile {
  const name = record.patientName.includes('Clinic')
    ? 'Asadujjaman Mahfuz'
    : record.patientName

  return {
    id: record.id,
    patientId: `PID${record.serialNo.slice(-3)}`,
    name,
    email: `${name.split(' ')[0].toLowerCase()}@gmail.com`,
    phone: record.contactNo.replace('+', '0').slice(0, 12) || '073 155 4568',
    emergencyContact: '073 155 3652',
    patientType: 'new patient',
    funding: 'DVA',
    gender: 'Male',
    occupation: 'Student',
    age: 26,
    dateOfBirth: '25 jan, 2000',
    address: '284 Daffodil Dr, Mount Frere, Eastern Cape -5088 South Africa',
    sessionProgress: 60,
    injuryTitle: 'L4-L5 disc bulge with radicular pain',
    injuryNotes: INJURY_NOTES,
    alerts: buildAlerts(),
    referrer: {
      name: 'Dr. Linh Tran',
      practice: 'GP. Brunswick Family Medical',
      phone: '+61 3 9388 1234',
      email: 'linh.tran@brunswickfm.com.au',
      address: '12 Sydney Rd, Brunswick VIC 3056',
    },
    fundingDetails: {
      claim: 'wc-654-6498',
      provider: 'Workcover Victoria',
      caseManager: 'Helena Voss — Allianz',
      employer: 'Carer logistics pty ltd',
    },
    notes: buildNotes(),
    sessions: buildSessions(record),
    sessionStats: {
      approved: 12,
      attended: 8,
      noShows: 1,
      remaining: 5,
    },
  }
}

export function getClientProfileById(
  list: MyPatientListRecord[],
  id: string
): ClientProfile | null {
  const record = list.find((r) => r.id === id)
  if (!record) return null
  return buildClientProfile(record)
}
