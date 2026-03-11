import cron from 'node-cron'
import { BrowserWindow } from 'electron'
import { taskCount, getTasks } from './apple/reminders'
import { sendNotification } from './apple/notifications'
import { readPreferences } from './lib/preferences'
import { saveSnapshot } from './lib/task-snapshot'

function parseCronExpression(timeStr: string): string {
  // timeStr format: "HH:MM" (24h)
  const [hour, minute] = timeStr.split(':').map(Number)
  return `${minute} ${hour} * * *`
}

export function setupCronJobs(getMainWindow: () => BrowserWindow | null): void {
  const prefs = readPreferences()

  // Early reminder: check if tasks exist, notify if not
  const earlyExpr = parseCronExpression(prefs.earlyReminderTime)
  cron.schedule(earlyExpr, async () => {
    try {
      const prefs = readPreferences() // Re-read in case updated
      const count = await taskCount(prefs.remindersListName)
      if (count === 0) {
        sendNotification(
          "aria",
          `You haven't added tasks to "${prefs.remindersListName}" yet. Add them before ${prefs.planningTime}!`
        )
      }
    } catch (err) {
      console.error('[cron] Early reminder check failed:', err)
    }
  })

  // Planning session: open/focus window and trigger greeting
  const planningExpr = parseCronExpression(prefs.planningTime)
  cron.schedule(planningExpr, async () => {
    try {
      const prefs = readPreferences()
      const win = getMainWindow()
      if (win) {
        if (win.isMinimized()) win.restore()
        win.show()
        win.focus()
        // Small delay to let renderer mount before sending the event
        setTimeout(() => {
          win.webContents.send('session-start')
        }, 500)
      }
      // Snapshot the task list at planning time for change tracking
      const tasks = await getTasks(prefs.remindersListName)
      saveSnapshot(tasks, 'planning', prefs.remindersListName)
    } catch (err) {
      console.error('[cron] Planning session trigger failed:', err)
    }
  })

  console.log(
    `[cron] Scheduled: early reminder at ${prefs.earlyReminderTime}, planning at ${prefs.planningTime}`
  )
}
