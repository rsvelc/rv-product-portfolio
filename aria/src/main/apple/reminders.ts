import { execFileSync } from 'child_process'
import { v4 as uuidv4 } from 'uuid'
import type { Task } from '../../shared/types'

function runScript(script: string): string {
  try {
    return execFileSync('osascript', ['-e', script], {
      encoding: 'utf-8',
      timeout: 10000
    }).trim()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`AppleScript error: ${msg}`)
  }
}

function parseTasksOutput(raw: string, listName: string): Task[] {
  if (!raw) return []
  return raw
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split('|||')
      return {
        id: uuidv4(),
        title: parts[0]?.trim() ?? '',
        notes: parts[1]?.trim() ?? '',
        dueDate: parts[2]?.trim() || null,
        listName
      }
    })
    .filter((t) => t.title)
}

export function getTasks(listName: string): Task[] {
  const script = `
tell application "Reminders"
  set output to ""
  try
    set theList to list "${listName}"
    set theTasks to (reminders of theList whose completed is false)
    repeat with t in theTasks
      set d to ""
      try
        if due date of t is not missing value then
          set d to due date of t as string
        end if
      end try
      set output to output & (name of t) & "|||" & (body of t) & "|||" & d & "\n"
    end repeat
  end try
  return output
end tell`
  const raw = runScript(script)
  return parseTasksOutput(raw, listName)
}

export function getBacklog(listName: string): Task[] {
  return getTasks(listName)
}

export function completeTask(listName: string, taskTitle: string): void {
  // Escape double quotes in title for AppleScript
  const safeTitle = taskTitle.replace(/"/g, '\\"')
  const safeList = listName.replace(/"/g, '\\"')
  const script = `
tell application "Reminders"
  try
    set theList to list "${safeList}"
    set matched to (reminders of theList whose name is "${safeTitle}" and completed is false)
    repeat with t in matched
      set completed of t to true
    end repeat
  end try
end tell`
  runScript(script)
}

export function taskCount(listName: string): number {
  const script = `
tell application "Reminders"
  try
    set theList to list "${listName}"
    set c to count of (reminders of theList whose completed is false)
    return c as string
  on error
    return "0"
  end try
end tell`
  const raw = runScript(script)
  return parseInt(raw, 10) || 0
}
