import { motion } from 'framer-motion'
import type { FAQ } from '@/types'

interface FAQTableProps {
  faqs: FAQ[]
}

export function FAQTable({
  faqs,
}: FAQTableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-card text-accent p-6">
            <th className="px-6 py-4 text-left text-sm font-bold">Question</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Answer</th>
            {/* <th className="px-6 py-4 text-left text-sm font-bold">Created At</th>
            <th className="px-6 py-4 text-left text-sm font-bold">Updated At</th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {faqs.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="px-6 py-8 text-center text-gray-500"
              >
                No FAQs found
              </td>
            </tr>
          ) : (
            faqs.map((faq, index) => (
              <motion.tr
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Question Column */}
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-accent">
                    {faq.question}
                  </span>
                </td>

                {/* Answer Column */}
                <td className="px-6 py-4">
                  <span className="text-sm text-accent line-clamp-2 max-w-lg">
                    {faq.answer}
                  </span>
                </td>

                {/* Created At Column */}
                {/* <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {formatDate(faq.createdAt, 'dd MMM yyyy HH:mm')}
                  </span>
                </td> */}

                {/* Updated At Column */}
                {/* <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {formatDate(faq.updatedAt, 'dd MMM yyyy HH:mm')}
                  </span>
                </td> */}

              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

