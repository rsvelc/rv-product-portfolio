import { execFileSync } from 'child_process'

export function sendNotification(title: string, body: string, sound = 'Glass'): void {
  const safeTitle = title.replace(/'/g, "\\'")
  const safeBody = body.replace(/'/g, "\\'")
  const script = `display notification "${safeBody}" with title "${safeTitle}" sound name "${sound}"`
  try {
    execFileSync('osascript', ['-e', script], { timeout: 5000 })
  } catch {
    // Non-critical — don't crash if notification fails
    console.error('[notifications] Failed to send macOS notification')
  }
}
