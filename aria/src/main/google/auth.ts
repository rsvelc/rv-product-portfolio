import { google } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { app, shell } from 'electron'
import * as http from 'http'

// Google Calendar read + write scope
const SCOPES = ['https://www.googleapis.com/auth/calendar']

// Port for the local OAuth callback server
const CALLBACK_PORT = 4242

function getCredentialsPath(): string {
  return app.isPackaged
    ? join(app.getPath('userData'), 'credentials.json')
    : join(process.cwd(), 'data', 'credentials.json')
}

function getTokenPath(): string {
  return app.isPackaged
    ? join(app.getPath('userData'), 'token.json')
    : join(process.cwd(), 'data', 'token.json')
}

// Singleton OAuth2 client
let _client: OAuth2Client | null = null

function buildClient(): OAuth2Client {
  const raw = readFileSync(getCredentialsPath(), 'utf-8')
  const { client_id, client_secret } = JSON.parse(raw).installed
  return new google.auth.OAuth2(client_id, client_secret, `http://localhost:${CALLBACK_PORT}`)
}

/**
 * Returns an authorized OAuth2 client.
 * On first call (no token.json): opens browser for consent, waits for callback.
 * On subsequent calls: loads stored token and auto-refreshes if expired.
 */
export async function getAuthorizedClient(): Promise<OAuth2Client> {
  if (!_client) {
    _client = buildClient()
  }

  const tokenPath = getTokenPath()

  if (existsSync(tokenPath)) {
    const saved = JSON.parse(readFileSync(tokenPath, 'utf-8'))
    _client.setCredentials(saved)

    // googleapis auto-refreshes using the refresh_token — nothing else needed
    return _client
  }

  // No token yet: run the OAuth consent flow
  return runConsentFlow(_client, tokenPath)
}

function runConsentFlow(client: OAuth2Client, tokenPath: string): Promise<OAuth2Client> {
  return new Promise((resolve, reject) => {
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // force refresh_token to be issued every time
    })

    console.log('[google-auth] Opening browser for Google sign-in...')
    shell.openExternal(authUrl)

    // Local HTTP server captures the redirect with ?code=...
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? '/', `http://localhost:${CALLBACK_PORT}`)
        const code = url.searchParams.get('code')

        if (!code) {
          res.writeHead(400)
          res.end('Missing authorization code. Please try again.')
          return
        }

        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(`
          <html><body style="font-family:sans-serif;padding:40px;background:#0f0f0f;color:#fff">
            <h2>✓ Google Calendar connected!</h2>
            <p>You can close this tab and return to Aria.</p>
          </body></html>
        `)

        server.close()

        const { tokens } = await client.getToken(code)
        client.setCredentials(tokens)
        writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), 'utf-8')
        console.log('[google-auth] Token saved to', tokenPath)
        resolve(client)
      } catch (err) {
        server.close()
        reject(err)
      }
    })

    server.listen(CALLBACK_PORT, () => {
      console.log(`[google-auth] Waiting for OAuth callback on http://localhost:${CALLBACK_PORT}`)
    })

    server.on('error', (err) => {
      reject(new Error(`OAuth callback server error: ${err.message}`))
    })

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close()
      reject(new Error('OAuth flow timed out after 5 minutes'))
    }, 5 * 60 * 1000)
  })
}

/** Clear stored token (used if re-auth is needed) */
export function clearStoredToken(): void {
  _client = null
  const tokenPath = getTokenPath()
  if (existsSync(tokenPath)) {
    const { unlinkSync } = require('fs')
    unlinkSync(tokenPath)
  }
}
