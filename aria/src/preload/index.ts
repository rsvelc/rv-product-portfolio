import { contextBridge, ipcRenderer } from 'electron'
import type {
  Preferences,
  ScheduleSlot,
  MindStreamPayload,
  Task,
  CalendarEvent,
  PatternsData,
  Pattern
} from '../shared/types'

// Expose a safe, typed API to the renderer via window.api
contextBridge.exposeInMainWorld('api', {
  // Reminders
  getReminders: (): Promise<Task[]> => ipcRenderer.invoke('get-reminders'),
  getBacklog: (): Promise<Task[]> => ipcRenderer.invoke('get-backlog'),
  completeTask: (taskTitle: string, listName?: string): Promise<{ ok?: boolean; error?: string }> =>
    ipcRenderer.invoke('complete-task', taskTitle, listName),
  getTaskDiff: (
    currentTitles: string[]
  ): Promise<{
    added: string[]
    removed: string[]
    source: string
    timestamp: string
  } | null> => ipcRenderer.invoke('get-task-diff', currentTitles),

  // Google auth (triggers consent flow on first run)
  googleAuth: (): Promise<{ ok?: boolean; error?: string }> =>
    ipcRenderer.invoke('google-auth'),

  // Calendar (Google)
  readCalendar: (): Promise<CalendarEvent[]> => ipcRenderer.invoke('read-calendar'),
  writeCalendar: (slots: ScheduleSlot[], date: string) =>
    ipcRenderer.invoke('write-calendar', slots, date),

  // Preferences
  getPreferences: (): Promise<Preferences> => ipcRenderer.invoke('get-preferences'),
  setPreferences: (prefs: Preferences): Promise<{ ok: boolean }> =>
    ipcRenderer.invoke('set-preferences', prefs),

  // Patterns
  getPatterns: (): Promise<PatternsData> => ipcRenderer.invoke('get-patterns'),
  appendPattern: (observation: string): Promise<Pattern> =>
    ipcRenderer.invoke('append-pattern', observation),
  deletePattern: (id: string): Promise<{ ok: boolean }> =>
    ipcRenderer.invoke('delete-pattern', id),
  saveCheckin: (checkIn: string, tasksPlanned?: number): Promise<{ ok: boolean }> =>
    ipcRenderer.invoke('save-checkin', checkIn, tasksPlanned ?? 0),

  // Mind (Claude streaming)
  startMindStream: (payload: MindStreamPayload): Promise<{ ok?: boolean; error?: string }> =>
    ipcRenderer.invoke('start-mind-stream', payload),
  extractPattern: (sessionSummary: string): Promise<string> =>
    ipcRenderer.invoke('extract-pattern', sessionSummary),

  // Event listeners (streaming + lifecycle)
  onMindToken: (cb: (token: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, token: string): void => cb(token)
    ipcRenderer.on('mind-token', handler)
    return () => ipcRenderer.removeListener('mind-token', handler)
  },
  onMindDone: (cb: (fullText: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, text: string): void => cb(text)
    ipcRenderer.on('mind-done', handler)
    return () => ipcRenderer.removeListener('mind-done', handler)
  },
  onMindError: (cb: (err: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, err: string): void => cb(err)
    ipcRenderer.on('mind-error', handler)
    return () => ipcRenderer.removeListener('mind-error', handler)
  },
  onSessionStart: (cb: () => void) => {
    const handler = (): void => cb()
    ipcRenderer.on('session-start', handler)
    return () => ipcRenderer.removeListener('session-start', handler)
  }
})
