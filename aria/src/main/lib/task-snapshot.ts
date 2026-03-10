import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { app } from 'electron'
import type { Task } from '../../shared/types'

export interface TaskSnapshot {
  timestamp: string // ISO string
  source: 'planning' | 'launch'
  listName: string
  taskTitles: string[] // original-case titles
}

export interface TaskDiff {
  added: string[]
  removed: string[]
  snapshot: TaskSnapshot
}

function getSnapshotPath(): string {
  if (!app.isPackaged) {
    return join(process.cwd(), 'data', 'task-snapshot.json')
  }
  return join(app.getPath('userData'), 'task-snapshot.json')
}

export function saveSnapshot(
  tasks: Task[],
  source: 'planning' | 'launch',
  listName: string
): void {
  const snapshot: TaskSnapshot = {
    timestamp: new Date().toISOString(),
    source,
    listName,
    taskTitles: tasks.map((t) => t.title.trim())
  }
  const path = getSnapshotPath()
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(snapshot, null, 2), 'utf-8')
  console.log(`[snapshot] Saved ${source} snapshot: ${tasks.length} tasks`)
}

export function loadSnapshot(): TaskSnapshot | null {
  try {
    const raw = readFileSync(getSnapshotPath(), 'utf-8')
    return JSON.parse(raw) as TaskSnapshot
  } catch {
    return null
  }
}

export function computeDiff(currentTasks: Task[], snapshot: TaskSnapshot): TaskDiff {
  const currentNorm = new Set(currentTasks.map((t) => t.title.trim().toLowerCase()))
  const snapshotNorm = new Set(snapshot.taskTitles.map((t) => t.toLowerCase()))

  const added = currentTasks
    .map((t) => t.title.trim())
    .filter((title) => !snapshotNorm.has(title.toLowerCase()))

  const removed = snapshot.taskTitles.filter((title) => !currentNorm.has(title.toLowerCase()))

  return { added, removed, snapshot }
}
