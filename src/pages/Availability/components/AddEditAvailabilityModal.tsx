import { useEffect, useState, type FormEvent } from 'react'
import { ModalWrapper } from '@/components/common/ModalWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import type { AvailabilityRecord, AvailabilityStatus } from '@/types'

function toDateInputValue(iso: string): string {
  return format(parseISO(iso), 'yyyy-MM-dd')
}

function fromDateInput(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString()
}

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const BLOCK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 14]

export interface AvailabilityFormPayload {
  applyDate: string
  blockDays: number
  rangeStart: string
  rangeEnd: string
  status: AvailabilityStatus
}

interface AddEditAvailabilityModalProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  record: AvailabilityRecord | null
  onSave: (payload: AvailabilityFormPayload) => void
}

const emptyForm = (): AvailabilityFormPayload => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return {
    applyDate: fromDateInput(today),
    blockDays: 1,
    rangeStart: fromDateInput(today),
    rangeEnd: fromDateInput(today),
    status: 'pending',
  }
}

export function AddEditAvailabilityModal({
  open,
  onClose,
  mode,
  record,
  onSave,
}: AddEditAvailabilityModalProps) {
  const [form, setForm] = useState<AvailabilityFormPayload>(emptyForm)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && record) {
      setForm({
        applyDate: record.applyDate,
        blockDays: record.blockDays,
        rangeStart: record.rangeStart,
        rangeEnd: record.rangeEnd,
        status: record.status,
      })
    } else {
      setForm(emptyForm())
    }
  }, [open, mode, record])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const start = parseISO(form.rangeStart).getTime()
    const end = parseISO(form.rangeEnd).getTime()
    if (end < start) {
      toast.error('End date must be on or after start date.')
      return
    }
    onSave(form)
  }

  return (
    <ModalWrapper
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Add availability' : 'Edit availability'}
      description={
        mode === 'edit' && record
          ? `Reference #${record.serialNo}`
          : 'Create a new unavailability block for your schedule.'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="space-y-2">
          <Label htmlFor="avail-apply">Apply date</Label>
          <Input
            id="avail-apply"
            type="date"
            value={toDateInputValue(form.applyDate)}
            onChange={(e) =>
              setForm((f) => ({ ...f, applyDate: fromDateInput(e.target.value) }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Leave time (days)</Label>
          <Select
            value={String(form.blockDays)}
            onValueChange={(v) => setForm((f) => ({ ...f, blockDays: Number(v) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BLOCK_OPTIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d} Day
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="avail-start">Period start</Label>
            <Input
              id="avail-start"
              type="date"
              value={toDateInputValue(form.rangeStart)}
              onChange={(e) =>
                setForm((f) => ({ ...f, rangeStart: fromDateInput(e.target.value) }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avail-end">Period end</Label>
            <Input
              id="avail-end"
              type="date"
              value={toDateInputValue(form.rangeEnd)}
              onChange={(e) =>
                setForm((f) => ({ ...f, rangeEnd: fromDateInput(e.target.value) }))
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, status: v as AvailabilityStatus }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90 dark:text-white">
            {mode === 'add' ? 'Save' : 'Update'}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}
