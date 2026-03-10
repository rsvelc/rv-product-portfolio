import React, { useState, useEffect } from 'react'
import type { Task } from '../../shared/types'

type Tab = 'active' | 'backlog'

function TaskCard({
  task,
  listName,
  onComplete
}: {
  task: Task
  listName: string
  onComplete: (title: string) => void
}): React.ReactElement {
  const [completing, setCompleting] = useState(false)
  const [done, setDone] = useState(false)

  const handleComplete = async (): Promise<void> => {
    setCompleting(true)
    try {
      await window.api.completeTask(task.title, listName)
      setDone(true)
      // Remove from list after short animation
      setTimeout(() => onComplete(task.title), 500)
    } catch {
      setCompleting(false)
    }
  }

  if (done) {
    return (
      <div className="px-4 py-3 border border-zinc-800/40 rounded-xl bg-zinc-900/40 transition-all opacity-40">
        <p className="text-sm font-medium text-zinc-500 line-through">{task.title}</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-900 hover:border-zinc-700 transition-colors flex items-start gap-3 group">
      {/* Checkbox */}
      <button
        onClick={handleComplete}
        disabled={completing}
        className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors
          ${completing
            ? 'bg-emerald-600 border-emerald-600'
            : 'border-zinc-600 hover:border-emerald-500 group-hover:border-zinc-400'
          }`}
        title="Mark as done in Reminders"
      >
        {completing && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-100 leading-snug">{task.title}</p>
        {task.notes && (
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{task.notes}</p>
        )}
        {task.dueDate && (
          <p className="text-xs text-zinc-600 mt-1.5">Due: {task.dueDate}</p>
        )}
      </div>
    </div>
  )
}

export default function TasksPage(): React.ReactElement {
  const [tab, setTab] = useState<Tab>('active')
  const [activeTasks, setActiveTasks] = useState<Task[]>([])
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([])
  const [activeListName, setActiveListName] = useState('Daily Tasks')
  const [backlogListName, setBacklogListName] = useState('Backlog')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async (t: Tab): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      if (t === 'active') {
        const tasks = await window.api.getReminders()
        setActiveTasks(tasks)
      } else {
        const tasks = await window.api.getBacklog()
        setBacklogTasks(tasks)
      }
    } catch (err) {
      setError('Could not load tasks. Make sure the app has Reminders access in System Settings → Privacy.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.api.getPreferences().then((p) => {
      setActiveListName(p.remindersListName)
      setBacklogListName(p.backlogListName)
    })
    fetchTasks('active')
  }, [])

  const handleTabChange = (t: Tab): void => {
    setTab(t)
    fetchTasks(t)
  }

  const handleComplete = (title: string): void => {
    setActiveTasks((prev) => prev.filter((t) => t.title !== title))
    setBacklogTasks((prev) => prev.filter((t) => t.title !== title))
  }

  const tasks = tab === 'active' ? activeTasks : backlogTasks
  const currentListName = tab === 'active' ? activeListName : backlogListName

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-zinc-100">Tasks</h1>
          <p className="text-xs text-zinc-500 mt-0.5">From Reminders: "{currentListName}"</p>
        </div>
        <button
          onClick={() => fetchTasks(tab)}
          className="text-xs text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-zinc-800 px-4">
        {(['active', 'backlog'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors mr-2
              ${tab === t
                ? 'text-white border-b-2 border-indigo-500 -mb-px'
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            {t === 'active' ? `Active${activeTasks.length > 0 ? ` (${activeTasks.length})` : ''}` : 'Backlog'}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl border border-red-900 bg-red-950/30 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-zinc-500 text-sm">No tasks in "{currentListName}"</p>
            <p className="text-zinc-700 text-xs mt-1">Open Reminders.app to add tasks</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              listName={currentListName}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
