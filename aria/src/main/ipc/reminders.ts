import { ipcMain } from 'electron'
import { getTasks, getBacklog, completeTask } from '../apple/reminders'
import { readPreferences } from '../lib/preferences'
import { loadSnapshot } from '../lib/task-snapshot'

export function registerRemindersHandlers(): void {
  ipcMain.handle('get-reminders', async () => {
    const prefs = readPreferences()
    return await getTasks(prefs.remindersListName)
  })

  ipcMain.handle('get-backlog', async () => {
    const prefs = readPreferences()
    return await getBacklog(prefs.backlogListName)
  })

  // Returns added/removed task titles compared to the last snapshot (launch or planning session).
  // The renderer passes the current task titles it already fetched to avoid a double round-trip.
  ipcMain.handle('get-task-diff', (_event, currentTitles: string[]) => {
    const snapshot = loadSnapshot()
    if (!snapshot) return null

    const currentNorm = new Set(currentTitles.map((t) => t.trim().toLowerCase()))
    const snapshotNorm = new Set(snapshot.taskTitles.map((t) => t.toLowerCase()))

    const added = currentTitles.filter((t) => !snapshotNorm.has(t.trim().toLowerCase()))
    const removed = snapshot.taskTitles.filter((t) => !currentNorm.has(t.toLowerCase()))

    return { added, removed, source: snapshot.source, timestamp: snapshot.timestamp }
  })

  ipcMain.handle('complete-task', async (_event, taskTitle: string, listName?: string) => {
    const prefs = readPreferences()
    const list = listName ?? prefs.remindersListName
    try {
      await completeTask(list, taskTitle)
      return { ok: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return { error: msg }
    }
  })
}
