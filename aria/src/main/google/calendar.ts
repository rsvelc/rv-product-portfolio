import { google } from 'googleapis'
import { getAuthorizedClient } from './auth'
import type { CalendarEvent } from '../../shared/types'

/**
 * Fetch events from ALL calendars (primary + subscribed) for the next N days.
 */
export async function readEvents(days = 3): Promise<CalendarEvent[]> {
  const auth = await getAuthorizedClient()
  const cal = google.calendar({ version: 'v3', auth })

  const timeMin = new Date().toISOString()
  const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

  // Get all calendars the user has access to (primary + subscribed)
  const listRes = await cal.calendarList.list({ showHidden: false })
  const calendars = listRes.data.items ?? []

  const events: CalendarEvent[] = []

  await Promise.all(
    calendars.map(async (c) => {
      if (!c.id) return
      try {
        const evRes = await cal.events.list({
          calendarId: c.id,
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: 'startTime',
          maxResults: 100
        })
        for (const e of evRes.data.items ?? []) {
          if (!e.summary) continue
          events.push({
            calendarName: c.summary ?? c.id ?? 'Unknown',
            title: e.summary,
            start: e.start?.dateTime ?? e.start?.date ?? '',
            end: e.end?.dateTime ?? e.end?.date ?? ''
          })
        }
      } catch (err) {
        // Some calendars (e.g. read-only shared) may fail — skip silently
        console.warn(`[google-cal] Skipping calendar "${c.summary}":`, err)
      }
    })
  )

  // Sort all events by start time
  return events.sort((a, b) => a.start.localeCompare(b.start))
}

/**
 * Find or create a calendar by name, then insert an event into it.
 * Returns { created: true } if the event was added, or { created: false } if a
 * duplicate (same title + overlapping time window) already exists.
 */
export async function writeEvent(params: {
  title: string
  startISO: string
  endISO: string
  notes: string
  calendarName: string
}): Promise<{ created: boolean }> {
  const auth = await getAuthorizedClient()
  const cal = google.calendar({ version: 'v3', auth })
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Find the target calendar by display name
  const listRes = await cal.calendarList.list()
  let calendarId =
    listRes.data.items?.find((c) => c.summary === params.calendarName)?.id ?? null

  // Create the calendar if it doesn't exist
  if (!calendarId) {
    const created = await cal.calendars.insert({
      requestBody: { summary: params.calendarName }
    })
    calendarId = created.data.id!
    // Add it to the user's calendar list so it shows in Calendar.app
    await cal.calendarList.insert({ requestBody: { id: calendarId } })
    console.log(`[google-cal] Created calendar: ${params.calendarName}`)
  }

  // Deduplication: check for an existing event with the same title in the same time window
  const existingRes = await cal.events.list({
    calendarId,
    timeMin: params.startISO,
    timeMax: params.endISO,
    singleEvents: true,
    maxResults: 25
  })
  const duplicate = (existingRes.data.items ?? []).some(
    (e) => e.summary?.trim().toLowerCase() === params.title.trim().toLowerCase()
  )
  if (duplicate) {
    console.log(`[google-cal] Skipping duplicate: "${params.title}" at ${params.startISO}`)
    return { created: false }
  }

  await cal.events.insert({
    calendarId,
    requestBody: {
      summary: params.title,
      description: params.notes || undefined,
      start: { dateTime: params.startISO, timeZone: tz },
      end: { dateTime: params.endISO, timeZone: tz }
    }
  })
  return { created: true }
}
