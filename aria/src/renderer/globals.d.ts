import type {
  Preferences,
  ScheduleSlot,
  MindStreamPayload,
  Task,
  CalendarEvent,
  PatternsData,
  Pattern
} from '../shared/types'

declare global {
  interface Window {
    api: {
      googleAuth: () => Promise<{ ok?: boolean; error?: string }>
      getReminders: () => Promise<Task[]>
      getBacklog: () => Promise<Task[]>
      completeTask: (taskTitle: string, listName?: string) => Promise<{ ok?: boolean; error?: string }>
      readCalendar: () => Promise<CalendarEvent[]>
      writeCalendar: (slots: ScheduleSlot[], date: string) => Promise<{ created: string[]; skipped: string[]; total: number }>
      getPreferences: () => Promise<Preferences>
      setPreferences: (prefs: Preferences) => Promise<{ ok: boolean }>
      getPatterns: () => Promise<PatternsData>
      appendPattern: (observation: string) => Promise<Pattern>
      deletePattern: (id: string) => Promise<{ ok: boolean }>
      saveCheckin: (checkIn: string, tasksPlanned?: number) => Promise<{ ok: boolean }>
      startMindStream: (payload: MindStreamPayload) => Promise<{ ok?: boolean; error?: string }>
      extractPattern: (sessionSummary: string) => Promise<string>
      onMindToken: (cb: (token: string) => void) => () => void
      onMindDone: (cb: (fullText: string) => void) => () => void
      onMindError: (cb: (err: string) => void) => () => void
      onSessionStart: (cb: () => void) => () => void
    }
  }
}
