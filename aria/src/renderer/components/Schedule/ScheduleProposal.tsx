import React, { useState } from 'react'
import type { ScheduleProposal as ScheduleProposalType, Goal } from '../../../shared/types'

interface Props {
  proposal: ScheduleProposalType
  goals: Goal[]
  onApprove: (proposal: ScheduleProposalType) => void
  onAdjust: () => void
}

function goalColor(goals: Goal[], goalId: string): string {
  return goals.find((g) => g.id === goalId)?.color ?? '#6366f1'
}

function goalTitle(goals: Goal[], goalId: string): string {
  return goals.find((g) => g.id === goalId)?.title ?? ''
}

export default function ScheduleProposal({
  proposal,
  goals,
  onApprove,
  onAdjust
}: Props): React.ReactElement {
  const [approved, setApproved] = useState(false)

  const handleApprove = (): void => {
    setApproved(true)
    onApprove(proposal)
  }

  return (
    <div className="my-2 rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden w-full max-w-lg">
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
            Proposed Schedule
          </p>
          <p className="text-sm font-semibold text-white mt-0.5">
            {new Date(proposal.date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        {approved && (
          <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
            ✓ Added to Calendar
          </span>
        )}
      </div>

      {/* Slots */}
      <div className="divide-y divide-zinc-800">
        {proposal.slots.map((slot, i) => {
          const color = goalColor(goals, slot.goalId)
          const gtitle = goalTitle(goals, slot.goalId)
          return (
            <div key={i} className="px-4 py-3 flex gap-3 items-start">
              <div className="text-xs text-zinc-500 font-mono mt-0.5 w-24 shrink-0">
                {slot.time}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 leading-snug">
                  {slot.task}
                </p>
                {slot.notes && (
                  <p className="text-xs text-zinc-500 mt-0.5 leading-snug">
                    {slot.notes}
                  </p>
                )}
                {gtitle && (
                  <span
                    className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: color + '22', color }}
                  >
                    {gtitle}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Skipped */}
      {proposal.skipped.length > 0 && (
        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-wider">
            Not scheduled
          </p>
          {proposal.skipped.map((s, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <span className="text-xs text-zinc-600">•</span>
              <span className="text-xs text-zinc-500">
                <span className="text-zinc-400">{s.task}</span> — {s.reason}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {!approved && (
        <div className="px-4 py-3 border-t border-zinc-700 flex gap-2 bg-zinc-800/50">
          <button
            onClick={handleApprove}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Approve & Add to Calendar
          </button>
          <button
            onClick={onAdjust}
            className="px-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Adjust
          </button>
        </div>
      )}
    </div>
  )
}
