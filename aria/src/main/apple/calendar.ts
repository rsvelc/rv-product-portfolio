import { execFileSync } from 'child_process'
import type { CalendarEvent } from '../../shared/types'

function runScript(script: string, timeoutMs = 20000): string {
  try {
    return execFileSync('osascript', ['-e', script], {
      encoding: 'utf-8',
      timeout: timeoutMs
    }).trim()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`AppleScript error: ${msg}`)
  }
}

export function readEvents(days = 3): CalendarEvent[] {
  // Use a temp .scpt file approach via stdin to avoid shell escaping issues with dates.
  // We build the date range in JS and pass day offsets so the script stays simple.
  const script = `
tell application "Calendar"
  set output to ""
  set startDate to current date
  set endDate to startDate + (${days} * days)
  repeat with aCal in calendars
    set calName to name of aCal
    try
      set matched to (every event of aCal whose start date >= startDate and start date <= endDate)
      repeat with e in matched
        try
          set eTitle to summary of e
          set eStart to start date of e as string
          set eEnd to end date of e as string
          set output to output & calName & "|||" & eTitle & "|||" & eStart & "|||" & eEnd & "\n"
        end try
      end repeat
    end try
  end repeat
  return output
end tell`

  try {
    const raw = runScript(script, 25000)
    if (!raw) return []
    return raw
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const parts = line.split('|||')
        return {
          calendarName: parts[0]?.trim() ?? '',
          title: parts[1]?.trim() ?? '',
          start: parts[2]?.trim() ?? '',
          end: parts[3]?.trim() ?? ''
        }
      })
      .filter((e) => e.title)
  } catch (err) {
    console.error('[calendar] readEvents failed:', err)
    return []
  }
}

export function ensureCalendarExists(calendarName: string): void {
  const script = `
tell application "Calendar"
  try
    set theCalendar to calendar "${calendarName}"
  on error
    make new calendar with properties {name:"${calendarName}"}
  end try
end tell`
  runScript(script)
}

export function writeEvent(params: {
  title: string
  startISO: string
  endISO: string
  notes: string
  calendarName: string
}): void {
  const { title, startISO, endISO, notes, calendarName } = params

  // Convert ISO to AppleScript date string: "Wednesday, March 9, 2026 at 9:00:00 AM"
  const startDate = new Date(startISO)
  const endDate = new Date(endISO)

  const formatForAS = (d: Date): string => {
    return d.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const safeTitle = title.replace(/"/g, '\\"')
  const safeNotes = notes.replace(/"/g, '\\"')
  const safeCalendar = calendarName.replace(/"/g, '\\"')

  const script = `
tell application "Calendar"
  tell calendar "${safeCalendar}"
    set newEvent to make new event with properties {summary:"${safeTitle}", start date:date "${formatForAS(startDate)}", end date:date "${formatForAS(endDate)}", description:"${safeNotes}"}
  end tell
  reload calendars
end tell`

  runScript(script)
}
