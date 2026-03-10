import { ipcMain } from 'electron'
import {
  readPatterns,
  appendPattern,
  deletePattern,
  recordSession
} from '../lib/patterns'

export function registerPatternsHandlers(): void {
  ipcMain.handle('get-patterns', async () => {
    return readPatterns()
  })

  ipcMain.handle('append-pattern', async (_event, observation: string) => {
    return appendPattern(observation)
  })

  ipcMain.handle('delete-pattern', async (_event, id: string) => {
    deletePattern(id)
    return { ok: true }
  })

  ipcMain.handle('save-checkin', async (_event, checkIn: string, tasksPlanned = 0) => {
    recordSession(checkIn, tasksPlanned)
    return { ok: true }
  })
}
