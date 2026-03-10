import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import type { Preferences } from '../../shared/types'

function getDataPath(): string {
  // In dev: project root/data. In prod: userData/data.
  if (!app.isPackaged) {
    return join(process.cwd(), 'data', 'preferences.json')
  }
  return join(app.getPath('userData'), 'preferences.json')
}

const DEFAULTS: Preferences = {
  goals: [],
  remindersListName: 'Daily Tasks',
  backlogListName: 'Backlog',
  calendarName: "Ramya's Planner",
  workingHours: { start: '09:00', end: '21:00' },
  deepWorkTime: 'morning',
  bufferMinutes: 15,
  earliestEventTime: '10:00',
  latestEventTime: '22:30',
  earlyReminderTime: '22:30',
  planningTime: '23:30'
}

export function readPreferences(): Preferences {
  try {
    const raw = readFileSync(getDataPath(), 'utf-8')
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function writePreferences(prefs: Preferences): void {
  writeFileSync(getDataPath(), JSON.stringify(prefs, null, 2), 'utf-8')
}
