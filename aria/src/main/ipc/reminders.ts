import { ipcMain } from 'electron'
import { getTasks, getBacklog, completeTask } from '../apple/reminders'
import { readPreferences } from '../lib/preferences'

export function registerRemindersHandlers(): void {
  ipcMain.handle('get-reminders', async () => {
    const prefs = readPreferences()
    return getTasks(prefs.remindersListName)
  })

  ipcMain.handle('get-backlog', async () => {
    const prefs = readPreferences()
    return getBacklog(prefs.backlogListName)
  })

  ipcMain.handle('complete-task', async (_event, taskTitle: string, listName?: string) => {
    const prefs = readPreferences()
    const list = listName ?? prefs.remindersListName
    try {
      completeTask(list, taskTitle)
      return { ok: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return { error: msg }
    }
  })
}
