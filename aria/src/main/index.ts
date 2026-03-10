import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { config as dotenvConfig } from 'dotenv'
import { registerRemindersHandlers } from './ipc/reminders'
import { registerCalendarHandlers } from './ipc/calendar'
import { registerPreferencesHandlers } from './ipc/preferences'
import { registerPatternsHandlers } from './ipc/patterns'
import { registerMindHandlers } from './ipc/mind'
import { setupCronJobs } from './cron'
import { readPreferences } from './lib/preferences'
import { getTasks } from './apple/reminders'
import { saveSnapshot } from './lib/task-snapshot'

// Load .env.local in development (before app.whenReady)
const isDev = !app.isPackaged
if (isDev) {
  dotenvConfig({ path: join(process.cwd(), '.env.local') })
}

let mainWindow: BrowserWindow | null = null

function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f0f0f',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', async () => {
    mainWindow!.show()
    // Take a launch-time task snapshot for change tracking
    try {
      const prefs = readPreferences()
      const tasks = await getTasks(prefs.remindersListName)
      saveSnapshot(tasks, 'launch', prefs.remindersListName)
    } catch (err) {
      console.warn('[snapshot] Launch snapshot failed:', err)
    }
  })

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  // Register all IPC handlers
  registerRemindersHandlers()
  registerCalendarHandlers()
  registerPreferencesHandlers()
  registerPatternsHandlers()
  registerMindHandlers(getMainWindow)

  // Start cron jobs
  setupCronJobs(getMainWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // Keep app running in background on macOS for cron jobs
  if (process.platform !== 'darwin') app.quit()
})
