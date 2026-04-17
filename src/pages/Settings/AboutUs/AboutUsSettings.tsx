import { useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { SearchInput } from '@/components/common/SearchInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type DateFilter = 'all' | '7d' | '30d' | '90d'

export type AboutSection = {
  id: string
  title: string
  body: string
  updatedAt: number
}

function daysAgoMs(days: number) {
  return Date.now() - days * 24 * 60 * 60 * 1000
}

const initialSections: AboutSection[] = [
  {
    id: 'our-story',
    title: 'Our Story',
    body: 'Hello every one welcome to the about us page, here you can add your content and it will be displayed on the About Us page. It can be edited later.',
    updatedAt: daysAgoMs(2),
  },
  {
    id: 'our-vision',
    title: 'Our Vision',
    body: 'Hello every one welcome to the about us page, here you can add your content and it will be displayed on the About Us page. It can be edited later.',
    updatedAt: daysAgoMs(10),
  },
  {
    id: 'our-goal',
    title: 'Our Goal',
    body: 'hello world',
    updatedAt: daysAgoMs(40),
  },
]

function formatDisplayDate(ts: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts))
}

function matchesDateFilter(updatedAt: number, filter: DateFilter) {
  if (filter === 'all') return true
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90
  return Date.now() - updatedAt <= days * 24 * 60 * 60 * 1000
}

export default function AboutUsSettings() {
  const [sections] = useState<AboutSection[]>(initialSections)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sections.filter((s) => {
      if (!matchesDateFilter(s.updatedAt, dateFilter)) return false
      if (!q) return true
      return (
        s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
      )
    })
  }, [sections, search, dateFilter])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="-mx-6 -mt-6 mb-0 min-h-[calc(100vh-5rem)] bg-[#F3F4F6] px-6 pb-10 pt-6 lg:-mx-8 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search here"
            className="w-full sm:w-[min(100%,280px)] sm:ml-auto"
            inputClassName=" rounded-lg border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] shadow-sm"
          />
          <Select
            value={dateFilter}
            onValueChange={(v) => setDateFilter(v as DateFilter)}
          >
            <SelectTrigger className=" w-full rounded-lg border-[#E5E7EB] bg-white text-[#374151] shadow-sm sm:w-[140px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Date</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-10 text-center text-sm text-[#6B7280] shadow-sm">
              No sections match your search or date filter.
            </div>
          ) : (
            filtered.map((section) => (
              <article
                key={section.id}
                className="flex gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-[#111827]">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                    {section.body}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-center justify-center gap-3 sm:flex-row">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#374151]"
                        aria-label={`About ${section.title}`}
                      >
                        <Info className="h-5 w-5" strokeWidth={1.75} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="max-w-xs border-[#E5E7EB] bg-white text-left text-[#374151] shadow-md"
                    >
                      <p className="font-medium text-[#111827]">
                        {section.title}
                      </p>
                      <p className="mt-1 text-xs text-[#6B7280]">
                        Last updated: {formatDisplayDate(section.updatedAt)}
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {section.body.length} characters
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
