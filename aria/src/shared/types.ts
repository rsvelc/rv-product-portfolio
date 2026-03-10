export interface Goal {
  id: string
  title: string
  description: string
  color: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  notes: string
  dueDate: string | null
  listName: string
}

export interface Pattern {
  id: string
  observation: string
  confidence: number
  updatedAt: string
}

export interface SessionRecord {
  date: string
  checkIn: string
  tasksPlanned: number
}

export interface Preferences {
  goals: Goal[]
  remindersListName: string
  backlogListName: string
  calendarName: string
  workingHours: { start: string; end: string }
  deepWorkTime: 'morning' | 'afternoon' | 'evening'
  bufferMinutes: number
  earliestEventTime: string   // HH:MM — no events before this (default 10:00)
  latestEventTime: string     // HH:MM — no events after this (default 22:30)
  earlyReminderTime: string
  planningTime: string
}

export interface PatternsData {
  patterns: Pattern[]
  sessionHistory: SessionRecord[]
}

export interface ScheduleSlot {
  time: string
  task: string
  goalId: string
  notes: string
  durationMin?: number
}

export interface SkippedTask {
  task: string
  reason: string
}

export interface ScheduleProposal {
  date: string
  slots: ScheduleSlot[]
  skipped: SkippedTask[]
}

export interface CalendarEvent {
  title: string
  start: string
  end: string
  calendarName: string
}

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  scheduleData?: ScheduleProposal
  timestamp: number
}

// IPC payload types
export interface MindStreamPayload {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  includeContext: boolean
}
