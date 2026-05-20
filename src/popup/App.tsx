import React, { useState, useEffect } from 'react';
import { Trash2, History, Settings, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { getSettings, Settings as SettingsType } from '../storage';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [isWiping, setIsWiping] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings?.darkMode]);

  const loadSettings = async () => {
    try {
      const s = await getSettings();
      setSettings(s);
    } catch (err) {
      console.error("Failed to load settings in popup:", err);
    }
  };

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleManualWipe = async () => {
    if (settings && settings.urls.length === 0) {
      showStatus('error', 'Add URLs in dashboard first!');
      return;
    }

    setIsWiping(true);
    try {
      chrome.runtime.sendMessage({ type: 'MANUAL_WIPE' }, (response) => {
        setIsWiping(false);
        if (chrome.runtime.lastError) {
          console.error("Communication error during manual wipe:", chrome.runtime.lastError.message);
          showStatus('error', 'Service worker offline');
          return;
        }

        if (response?.success) {
          const count = response.count || 0;
          showStatus('success', `Wiped ${count} item${count !== 1 ? 's' : ''} successfully!`);
          loadSettings();
        } else {
          showStatus('error', response?.error || 'Failed to wipe history');
        }
      });
    } catch (err) {
      setIsWiping(false);
      showStatus('error', 'Failed to trigger wipe');
      console.error(err);
    }
  };

  const handleOpenDashboard = () => {
    try {
      chrome.runtime.openOptionsPage();
    } catch (err) {
      console.error("Failed to open options page:", err);
      // Fallback
      window.open(chrome.runtime.getURL('options.html'));
    }
  };

  if (!settings) {
    return <div className="w-[320px] p-6 text-center text-gray-500 font-medium dark:bg-gray-800 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="w-[320px] bg-white dark:bg-gray-800 p-5 font-sans antialiased text-gray-800 dark:text-gray-200 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800/90 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/80">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-100 dark:shadow-none">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">History Wiper</h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Privacy Guard</p>
          </div>
        </div>
        <button
          onClick={handleOpenDashboard}
          title="Open Dashboard"
          className="p-2 text-gray-400 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 text-center">
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none mb-1">{settings.totalDeleted}</div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total Deleted</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80 text-center flex flex-col justify-center">
          <div className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">
            {settings.urls.length} Site{settings.urls.length !== 1 ? 's' : ''}
          </div>
          <div className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">On Watchlist</div>
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`mb-3 p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200 border ${
          status.type === 'success' 
            ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30' 
            : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30'
        }`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">{status.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleManualWipe}
          disabled={isWiping}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
            isWiping
              ? 'bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-500 border border-transparent dark:border-gray-800/80 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 active:scale-[0.98] shadow-blue-100 dark:shadow-none'
          }`}
        >
          {isWiping ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isWiping ? 'Wiping History...' : 'Clean Instantly'}
        </button>

        <button
          onClick={handleOpenDashboard}
          className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-xs hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all bg-transparent"
        >
          Open Dashboard
        </button>
      </div>

      {/* Footer Info */}
      {settings.lastRun && (
        <div className="mt-3 text-center text-[9px] text-gray-400 dark:text-gray-500 font-medium">
          Last wiped: {new Date(settings.lastRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  );
};

export default App;
