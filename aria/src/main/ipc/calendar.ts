import { ipcMain } from 'electron'
import { readEvents, writeEvent } from '../google/calendar'
import { getAuthorizedClient } from '../google/auth'
import { readPreferences } from '../lib/preferences'
import type { ScheduleSlot } from '../../shared/types'

export function registerCalendarHandlers(): void {
  // Pre-authorize on startup so the consent flow happens before the user tries to plan
  ipcMain.handle('google-auth', async () => {
    try {
      await getAuthorizedClient()
      return { ok: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      return { error: msg }
    }
  })

  ipcMain.handle('read-calendar', async () => {
    return readEvents(3)
  })

  ipcMain.handle('write-calendar', async (_event, slots: ScheduleSlot[], date: string) => {
    const prefs = readPreferences()
    const created: string[] = []
    const skipped: string[] = []

    for (const slot of slots) {
      try {
        const [startTime, endTime] = slot.time.split('-')
        const startISO = `${date}T${startTime}:00`
        const endISO = `${date}T${endTime}:00`

        const result = await writeEvent({
          title: slot.task,
          startISO,
          endISO,
          notes: slot.notes ?? '',
          calendarName: prefs.calendarName
        })

        if (result.created) {
          created.push(slot.task)
        } else {
          skipped.push(slot.task)
        }
      } catch (err) {
        console.error(`[calendar] Failed to write event "${slot.task}":`, err)
      }
    }
    return { created, skipped, total: slots.length }
  })
}
