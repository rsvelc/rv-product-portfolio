import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import type { PatternsData, Pattern, SessionRecord } from '../../shared/types'

function getDataPath(): string {
  if (!app.isPackaged) {
    return join(process.cwd(), 'data', 'patterns.json')
  }
  return join(app.getPath('userData'), 'patterns.json')
}

const DEFAULTS: PatternsData = {
  patterns: [],
  sessionHistory: []
}

export function readPatterns(): PatternsData {
  try {
    const raw = readFileSync(getDataPath(), 'utf-8')
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function writePatterns(data: PatternsData): void {
  writeFileSync(getDataPath(), JSON.stringify(data, null, 2), 'utf-8')
}

export function appendPattern(observation: string, confidence = 0.7): Pattern {
  const data = readPatterns()
  const pattern: Pattern = {
    id: uuidv4(),
    observation,
    confidence,
    updatedAt: new Date().toISOString()
  }
  data.patterns.push(pattern)
  writePatterns(data)
  return pattern
}

export function deletePattern(id: string): void {
  const data = readPatterns()
  data.patterns = data.patterns.filter((p) => p.id !== id)
  writePatterns(data)
}

export function recordSession(checkIn: string, tasksPlanned: number): void {
  const data = readPatterns()
  const record: SessionRecord = {
    date: new Date().toISOString().split('T')[0],
    checkIn,
    tasksPlanned
  }
  data.sessionHistory.push(record)
  // Keep last 30 sessions
  if (data.sessionHistory.length > 30) {
    data.sessionHistory = data.sessionHistory.slice(-30)
  }
  writePatterns(data)
}
