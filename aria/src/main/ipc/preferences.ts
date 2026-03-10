import { ipcMain } from 'electron'
import { readPreferences, writePreferences } from '../lib/preferences'
import type { Preferences } from '../../shared/types'

export function registerPreferencesHandlers(): void {
  ipcMain.handle('get-preferences', async () => {
    return readPreferences()
  })

  ipcMain.handle('set-preferences', async (_event, prefs: Preferences) => {
    writePreferences(prefs)
    return { ok: true }
  })
}
