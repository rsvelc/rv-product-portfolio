import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Preferences, Goal, Pattern } from '../../shared/types'

const GOAL_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6'
]

function GoalEditor({
  goal,
  onSave,
  onCancel
}: {
  goal: Partial<Goal>
  onSave: (g: Goal) => void
  onCancel: () => void
}): React.ReactElement {
  const [title, setTitle] = useState(goal.title ?? '')
  const [description, setDescription] = useState(goal.description ?? '')
  const [color, setColor] = useState(goal.color ?? GOAL_COLORS[0])

  return (
    <div className="p-4 border border-zinc-700 rounded-xl bg-zinc-900 flex flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal title (e.g. Launch my startup)"
        className="bg-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Why does this matter to you? What does success look like?"
        rows={3}
        className="bg-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors resize-none"
      />
      <div className="flex gap-2 items-center">
        <span className="text-xs text-zinc-500">Color:</span>
        {GOAL_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-5 h-5 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-zinc-900' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (!title.trim()) return
            onSave({
              id: goal.id ?? uuidv4(),
              title: title.trim(),
              description: description.trim(),
              color,
              createdAt: goal.createdAt ?? new Date().toISOString()
            })
          }}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Save Goal
        </button>
        <button
          onClick={onCancel}
          className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function PreferencesPage(): React.ReactElement {
  const [prefs, setPrefs] = useState<Preferences | null>(null)
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [editingGoal, setEditingGoal] = useState<Partial<Goal> | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.api.getPreferences().then(setPrefs)
    window.api.getPatterns().then((p) => setPatterns(p.patterns))
  }, [])

  const save = async (p: Preferences): Promise<void> => {
    await window.api.setPreferences(p)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateField = <K extends keyof Preferences>(key: K, value: Preferences[K]): void => {
    if (!prefs) return
    const updated = { ...prefs, [key]: value }
    setPrefs(updated)
    save(updated)
  }

  const addOrUpdateGoal = (goal: Goal): void => {
    if (!prefs) return
    const exists = prefs.goals.find((g) => g.id === goal.id)
    const goals = exists
      ? prefs.goals.map((g) => (g.id === goal.id ? goal : g))
      : [...prefs.goals, goal]
    const updated = { ...prefs, goals }
    setPrefs(updated)
    save(updated)
    setEditingGoal(null)
  }

  const deleteGoal = (id: string): void => {
    if (!prefs) return
    const updated = { ...prefs, goals: prefs.goals.filter((g) => g.id !== id) }
    setPrefs(updated)
    save(updated)
  }

  const deletePattern = async (id: string): Promise<void> => {
    await window.api.deletePattern(id)
    setPatterns((prev) => prev.filter((p) => p.id !== id))
  }

  if (!prefs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-zinc-100">Preferences</h1>
        {saved && (
          <span className="text-xs text-emerald-400 font-medium">✓ Saved</span>
        )}
      </div>

      {/* Life Goals */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Life Goals</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Your Mind uses these to understand why tasks matter — outcome-driven scheduling.
            </p>
          </div>
          {!editingGoal && (
            <button
              onClick={() => setEditingGoal({})}
              className="text-xs text-indigo-400 hover:text-indigo-300 px-3 py-1.5 border border-indigo-800 hover:border-indigo-600 rounded-lg transition-colors"
            >
              + Add Goal
            </button>
          )}
        </div>

        {editingGoal && (
          <div className="mb-3">
            <GoalEditor
              goal={editingGoal}
              onSave={addOrUpdateGoal}
              onCancel={() => setEditingGoal(null)}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {prefs.goals.length === 0 && !editingGoal && (
            <p className="text-sm text-zinc-600 italic">No goals yet. Add one to get started.</p>
          )}
          {prefs.goals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 border border-zinc-800 rounded-xl bg-zinc-900 flex gap-3 items-start"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: goal.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100">{goal.title}</p>
                {goal.description && (
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{goal.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setEditingGoal(goal)}
                  className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-xs text-zinc-700 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-zinc-800" />

      {/* Reminders Configuration */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-200 mb-3">Reminders Setup</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Active tasks list name</span>
            <input
              value={prefs.remindersListName}
              onChange={(e) => updateField('remindersListName', e.target.value)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Backlog list name</span>
            <input
              value={prefs.backlogListName}
              onChange={(e) => updateField('backlogListName', e.target.value)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Calendar name (for scheduled events)</span>
            <input
              value={prefs.calendarName}
              onChange={(e) => updateField('calendarName', e.target.value)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
        </div>
      </section>

      <div className="border-t border-zinc-800" />

      {/* Scheduling Preferences */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-200 mb-3">Scheduling</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Earliest event start</span>
            <input
              type="time"
              value={prefs.earliestEventTime ?? '10:00'}
              onChange={(e) => updateField('earliestEventTime', e.target.value)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Latest event end</span>
            <input
              type="time"
              value={prefs.latestEventTime ?? '22:30'}
              onChange={(e) => updateField('latestEventTime', e.target.value)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Work starts</span>
            <input
              type="time"
              value={prefs.workingHours.start}
              onChange={(e) =>
                updateField('workingHours', { ...prefs.workingHours, start: e.target.value })
              }
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Work ends</span>
            <input
              type="time"
              value={prefs.workingHours.end}
              onChange={(e) =>
                updateField('workingHours', { ...prefs.workingHours, end: e.target.value })
              }
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Deep work preference</span>
            <select
              value={prefs.deepWorkTime}
              onChange={(e) =>
                updateField('deepWorkTime', e.target.value as 'morning' | 'afternoon' | 'evening')
              }
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Buffer between tasks (min)</span>
            <input
              type="number"
              min={0}
              max={60}
              value={prefs.bufferMinutes}
              onChange={(e) => updateField('bufferMinutes', parseInt(e.target.value, 10) || 0)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
        </div>
      </section>

      <div className="border-t border-zinc-800" />

      {/* Trigger Times */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-200 mb-1">Daily Triggers</h2>
        <p className="text-xs text-zinc-500 mb-3">Times are in 24-hour format. Restart the app to apply changes.</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Early reminder (no tasks yet)</span>
            <input
              type="time"
              value={prefs.earlyReminderTime}
              onChange={(e) => updateField('earlyReminderTime', e.target.value)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">Planning session opens</span>
            <input
              type="time"
              value={prefs.planningTime}
              onChange={(e) => updateField('planningTime', e.target.value)}
              className="bg-zinc-800 text-zinc-100 text-sm px-3 py-2 rounded-lg border border-zinc-700 focus:border-indigo-600 outline-none transition-colors"
            />
          </label>
        </div>
      </section>

      {/* Learned Patterns */}
      {patterns.length > 0 && (
        <>
          <div className="border-t border-zinc-800" />
          <section>
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">Learned Patterns</h2>
            <p className="text-xs text-zinc-500 mb-3">
              Insights your Mind has gathered over time. These inform future scheduling.
            </p>
            <div className="flex flex-col gap-2">
              {patterns.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-900"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <p className="flex-1 text-sm text-zinc-300 leading-relaxed">{p.observation}</p>
                  <button
                    onClick={() => deletePattern(p.id)}
                    className="text-xs text-zinc-700 hover:text-red-400 shrink-0 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="h-4" />
    </div>
  )
}
