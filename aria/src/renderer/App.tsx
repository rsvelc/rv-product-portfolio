import React, { useState } from 'react'
import ChatPage from './pages/Chat'
import TasksPage from './pages/Tasks'
import PreferencesPage from './pages/Preferences'

type Tab = 'chat' | 'tasks' | 'preferences'

export default function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('chat')

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 select-none">
      {/* Titlebar */}
      <div className="titlebar-drag h-11 flex items-center px-4 border-b border-zinc-800 shrink-0">
        {/* macOS traffic lights offset */}
        <div className="w-16 titlebar-nodrag" />
        <span className="text-sm font-medium text-zinc-400 tracking-wide flex-1 text-center">
          Aria
        </span>
        <div className="w-16" />
      </div>

      {/* Tab bar */}
      <div className="titlebar-nodrag flex border-b border-zinc-800 shrink-0 bg-zinc-950">
        {(['chat', 'tasks', 'preferences'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors
              ${activeTab === tab
                ? 'text-white border-b-2 border-indigo-500 -mb-px'
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            {tab === 'chat' ? '✦ Mind' : tab === 'tasks' ? 'Tasks' : 'Preferences'}
          </button>
        ))}
      </div>

      {/* Page content — all three stay mounted so chat state survives tab switches */}
      <div className="flex-1 overflow-hidden relative">
        <div className={`absolute inset-0 flex flex-col ${activeTab === 'chat' ? '' : 'hidden'}`}>
          <ChatPage />
        </div>
        <div className={`absolute inset-0 flex flex-col ${activeTab === 'tasks' ? '' : 'hidden'}`}>
          <TasksPage />
        </div>
        <div className={`absolute inset-0 flex flex-col overflow-y-auto ${activeTab === 'preferences' ? '' : 'hidden'}`}>
          <PreferencesPage />
        </div>
      </div>
    </div>
  )
}
