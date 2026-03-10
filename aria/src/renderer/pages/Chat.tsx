import React, { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ScheduleProposal from '../components/Schedule/ScheduleProposal'
import type { ChatMessage, ScheduleProposal as ScheduleProposalType, Task, Goal } from '../../shared/types'

type SessionPhase = 'idle' | 'greeting' | 'checkin' | 'planning' | 'done'

function parseSchedule(text: string): ScheduleProposalType | null {
  const match = text.match(/<schedule>([\s\S]*?)<\/schedule>/)
  if (!match) return null
  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

function formatTasksForGreeting(tasks: Task[]): string {
  return tasks.map((t) => `• ${t.title}${t.notes ? ` — ${t.notes}` : ''}`).join('\n')
}

function MessageBubble({
  msg,
  goals,
  onApproveSchedule,
  onAdjustSchedule
}: {
  msg: ChatMessage
  goals: Goal[]
  onApproveSchedule: (proposal: ScheduleProposalType) => void
  onAdjustSchedule: () => void
}): React.ReactElement {
  const isUser = msg.role === 'user'
  const isSystem = msg.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          {msg.content}
        </span>
      </div>
    )
  }

  // Strip <schedule> block from displayed text
  const displayText = msg.content.replace(/<schedule>[\s\S]*?<\/schedule>/g, '').trim()

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mr-2 mt-0.5">
          ✦
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? '' : ''}`}>
        {displayText && (
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              isUser
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : 'bg-zinc-800 text-zinc-100 rounded-tl-sm'
            }`}
          >
            {displayText}
          </div>
        )}
        {msg.scheduleData && (
          <div className={isUser ? 'mt-2' : 'mt-2'}>
            <ScheduleProposal
              proposal={msg.scheduleData}
              goals={goals}
              onApprove={onApproveSchedule}
              onAdjust={onAdjustSchedule}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage(): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [phase, setPhase] = useState<SessionPhase>('idle')
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [listName, setListName] = useState('Daily Tasks')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  // Load preferences + trigger Google auth on mount
  useEffect(() => {
    window.api.getPreferences().then((p) => {
      setGoals(p.goals)
      setListName(p.remindersListName)
    })
    // Trigger Google OAuth on app open — if token exists this is instant;
    // if not, browser opens for consent before the first planning session.
    window.api.googleAuth().catch((err) => {
      console.warn('[chat] Google auth failed:', err)
    })
  }, [])

  // Register session-start listener (fired by cron at 11:30pm, or manually)
  useEffect(() => {
    const unsub = window.api.onSessionStart(() => {
      triggerSessionStart()
    })
    return unsub
  }, [])

  // Register streaming event listeners
  useEffect(() => {
    const unsubToken = window.api.onMindToken((token) => {
      setStreamingText((prev) => prev + token)
    })
    const unsubDone = window.api.onMindDone((fullText) => {
      setIsStreaming(false)
      setStreamingText('')
      const schedule = parseSchedule(fullText)
      const msg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: fullText,
        scheduleData: schedule ?? undefined,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, msg])
    })
    const unsubError = window.api.onMindError((err) => {
      setIsStreaming(false)
      setStreamingText('')
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: `Sorry, I ran into an issue: ${err}`,
          timestamp: Date.now()
        }
      ])
    })
    return () => {
      unsubToken()
      unsubDone()
      unsubError()
    }
  }, [])

  const triggerSessionStart = useCallback(async () => {
    setPhase('greeting')
    setMessages([])

    let fetchedTasks: Task[] = []
    try {
      fetchedTasks = await window.api.getReminders()
      setTasks(fetchedTasks)
    } catch {
      // Reminders access may need permission grant on first run
    }

    const prefs = await window.api.getPreferences()
    setGoals(prefs.goals)
    setListName(prefs.remindersListName)

    if (fetchedTasks.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          role: 'assistant',
          content: `Good evening, Ramya!\n\nI checked your "${prefs.remindersListName}" list in Reminders, but it looks empty. Please add your tasks for tomorrow there, then come back and say "ready to plan" when you're done!`,
          timestamp: Date.now()
        }
      ])
      setPhase('idle')
      return
    }

    // Compute task diff against last snapshot (launch or planning session)
    const currentTitles = fetchedTasks.map((t) => t.title)
    const diff = await window.api.getTaskDiff(currentTitles).catch(() => null)
    const hasDiff = diff && (diff.added.length > 0 || diff.removed.length > 0)

    const taskListText = formatTasksForGreeting(fetchedTasks)

    let diffSection = ''
    if (hasDiff) {
      const lines: string[] = []
      if (diff.added.length > 0) {
        lines.push(`➕ Added: ${diff.added.join(', ')}`)
      }
      if (diff.removed.length > 0) {
        lines.push(`➖ Removed: ${diff.removed.join(', ')}`)
      }
      diffSection = `\n\nI noticed some changes since your last ${diff.source} session:\n${lines.join('\n')}\n\nAnything I should know about these — new priorities, something you dropped, context that might help me plan better?`
    }

    const greeting: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: `Good evening, Ramya! 👋\n\nHere are your tasks for tomorrow:\n\n${taskListText}${diffSection}\n\n—\n\nBefore we plan — how did today go? Tell me what worked and what didn't. Even a sentence helps me schedule better next time.`,
      timestamp: Date.now()
    }
    setMessages([greeting])
    setPhase('checkin')
  }, [])

  // Let user manually trigger the session
  const handleManualTrigger = (): void => {
    triggerSessionStart()
  }

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || isStreaming) return

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now()
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)

    // Handle check-in phase: save before sending to Claude
    if (phase === 'checkin') {
      await window.api.saveCheckin(text.trim(), tasks.length)
      setPhase('planning')
    }

    // Build conversation history for Claude (exclude system messages)
    const history = newMessages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content.replace(/<schedule>[\s\S]*?<\/schedule>/g, '').trim()
      }))

    await window.api.startMindStream({
      messages: history,
      includeContext: true
    })
  }

  const handleApproveSchedule = async (proposal: ScheduleProposalType): Promise<void> => {
    try {
      const result = await window.api.writeCalendar(proposal.slots, proposal.date)
      const addedPart = `✓ ${result.created.length} event${result.created.length !== 1 ? 's' : ''} added to your calendar`
      const skippedPart =
        result.skipped.length > 0
          ? ` (${result.skipped.length} already existed — skipped)`
          : ''
      const confirmMsg: ChatMessage = {
        id: uuidv4(),
        role: 'system',
        content: addedPart + skippedPart,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, confirmMsg])

      // Extract and save a pattern from this session
      const sessionContext = messages
        .filter((m) => m.role !== 'system')
        .map((m) => `${m.role === 'user' ? 'Ramya' : 'Planner'}: ${m.content}`)
        .join('\n')
        .slice(0, 2000)

      const patternText = await window.api.extractPattern(sessionContext)
      if (patternText) {
        await window.api.appendPattern(patternText)
      }

      setPhase('done')
    } catch (err) {
      console.error('[chat] Failed to write calendar events:', err)
    }
  }

  const handleAdjustSchedule = (): void => {
    setInput("I'd like to adjust the schedule — ")
    inputRef.current?.focus()
  }

  const handleShowBacklog = async (): Promise<void> => {
    try {
      const backlog = await window.api.getBacklog()
      const backlogMsg: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content:
          backlog.length > 0
            ? `Here's your backlog:\n\n${backlog.map((t) => `• ${t.title}${t.notes ? ` — ${t.notes}` : ''}`).join('\n')}\n\nWant to move any of these into tomorrow's plan?`
            : "Your backlog list is empty right now.",
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, backlogMsg])
    } catch {
      //
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = messages.length === 0 && !isStreaming

  return (
    <div className="flex flex-col h-full">
      {/* Top bar with context actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {tasks.length > 0 ? (
              <>
                <span className="text-indigo-400 font-medium">{tasks.length}</span>{' '}
                task{tasks.length !== 1 ? 's' : ''} in{' '}
                <span className="text-zinc-400">"{listName}"</span>
              </>
            ) : (
              <span className="text-zinc-600">No tasks loaded</span>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShowBacklog}
            className="text-xs text-zinc-500 hover:text-zinc-300 px-3 py-1 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            View Backlog
          </button>
          {isEmpty && (
            <button
              onClick={handleManualTrigger}
              className="text-xs text-indigo-400 hover:text-indigo-300 px-3 py-1 rounded-lg border border-indigo-800 hover:border-indigo-600 transition-colors"
            >
              Start Session
            </button>
          )}
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-2xl mb-4">
              ✦
            </div>
            <p className="text-zinc-400 font-medium mb-1">Your Mind is ready</p>
            <p className="text-zinc-600 text-sm max-w-xs">
              I'll open automatically at your planning time, or you can start a session now.
            </p>
            <button
              onClick={handleManualTrigger}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Start Planning Session
            </button>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            goals={goals}
            onApproveSchedule={handleApproveSchedule}
            onAdjustSchedule={handleAdjustSchedule}
          />
        ))}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex mb-4 justify-start">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mr-2 mt-0.5">
              ✦
            </div>
            <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-800 text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap">
              {streamingText || (
                <span className="flex gap-1 items-center text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-4 pt-2 border-t border-zinc-800">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              phase === 'checkin'
                ? 'How did today go?'
                : phase === 'planning'
                  ? 'Chat with your Mind...'
                  : 'Start a session or type a message...'
            }
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm px-4 py-3 rounded-xl resize-none outline-none border border-zinc-700 focus:border-indigo-600 transition-colors disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ minHeight: '44px' }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-zinc-700 mt-1.5 text-center">
          Return to send · Shift+Return for new line
        </p>
      </div>
    </div>
  )
}
