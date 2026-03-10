import { ipcMain, BrowserWindow } from 'electron'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from '../../shared/system-prompt'
import { readPreferences } from '../lib/preferences'
import { readPatterns } from '../lib/patterns'
import { getTasks } from '../apple/reminders'
import { readEvents } from '../google/calendar'
import type { MindStreamPayload } from '../../shared/types'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in environment')
    client = new Anthropic({ apiKey })
  }
  return client
}

export function registerMindHandlers(getMainWindow: () => BrowserWindow | null): void {
  // Streaming: renderer calls invoke, main streams tokens back via webContents.send
  ipcMain.handle('start-mind-stream', async (_event, payload: MindStreamPayload) => {
    const win = getMainWindow()
    if (!win) return { error: 'No window' }

    const prefs = readPreferences()
    const patterns = readPatterns()

    let systemPrompt: string
    if (payload.includeContext) {
      // Fetch context sources independently — a failure in one shouldn't block Claude
      const [tasks, events] = await Promise.all([
        Promise.resolve().then(() => getTasks(prefs.remindersListName)).catch((err) => {
          console.error('[mind] Failed to fetch reminders:', err)
          return []
        }),
        Promise.resolve().then(() => readEvents(3)).catch((err) => {
          console.error('[mind] Failed to fetch calendar:', err)
          return []
        })
      ])
      systemPrompt = buildSystemPrompt(prefs, patterns, tasks, events)
    } else {
      systemPrompt = buildSystemPrompt(prefs, patterns, [], [])
    }

    const anthropic = getClient()

    try {
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemPrompt,
        messages: payload.messages
      })

      let fullText = ''

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          const token = chunk.delta.text
          fullText += token
          win.webContents.send('mind-token', token)
        }
      }

      win.webContents.send('mind-done', fullText)
      return { ok: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      win.webContents.send('mind-error', msg)
      return { error: msg }
    }
  })

  // Silent pattern extraction after a planning session
  ipcMain.handle('extract-pattern', async (_event, sessionSummary: string) => {
    const anthropic = getClient()
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Based on this planning session summary, write ONE concise behavioral insight about this person's planning preferences or work patterns (max 20 words, no bullet points, plain sentence):\n\n${sessionSummary}`
        }
      ]
    })
    const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
    return text
  })
}
