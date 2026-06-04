import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  Clock, 
  History, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Globe, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { getSettings, saveSettings, Settings } from '../storage';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newWhitelistUrl, setNewWhitelistUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isWiping, setIsWiping] = useState(false);

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
      console.error("Failed to load settings in dashboard:", err);
    }
  };

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = newUrl.trim();
    if (!trimmedUrl || !settings) return;

    if (trimmedUrl.length < 2) {
      showStatus('error', 'Keyword/URL must be at least 2 characters');
      return;
    }

    if (settings.urls.includes(trimmedUrl)) {
      showStatus('error', 'URL/Keyword already exists in watch list');
      return;
    }

    const updated = { ...settings, urls: [...settings.urls, trimmedUrl] };
    await saveSettings(updated);
    setSettings(updated);
    setNewUrl('');
    showStatus('success', 'URL/Keyword added to watchlist');
  };

  const handleRemoveUrl = async (url: string) => {
    if (!settings) return;
    const updated = { ...settings, urls: settings.urls.filter(u => u !== url) };
    await saveSettings(updated);
    setSettings(updated);
    showStatus('success', 'URL/Keyword removed');
  };

  const handleAddWhitelistUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = newWhitelistUrl.trim();
    if (!trimmedUrl || !settings) return;

    if (trimmedUrl.length < 2) {
      showStatus('error', 'Exclusion must be at least 2 characters');
      return;
    }

    const currentWhitelist = settings.whitelist || [];
    if (currentWhitelist.includes(trimmedUrl)) {
      showStatus('error', 'Exclusion already exists');
      return;
    }

    const updated = { ...settings, whitelist: [...currentWhitelist, trimmedUrl] };
    await saveSettings(updated);
    setSettings(updated);
    setNewWhitelistUrl('');
    showStatus('success', 'Exclusion keyword added to whitelist');
  };

  const handleRemoveWhitelistUrl = async (url: string) => {
    if (!settings) return;
    const currentWhitelist = settings.whitelist || [];
    const updated = { ...settings, whitelist: currentWhitelist.filter(u => u !== url) };
    await saveSettings(updated);
    setSettings(updated);
    showStatus('success', 'Exclusion removed');
  };

  const handleIntervalChange = async (interval: number) => {
    if (!settings) return;
    const updated = { ...settings, interval };
    await saveSettings(updated);
    setSettings(updated);
    
    try {
      chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS' }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Could not notify background worker:", chrome.runtime.lastError.message);
        }
        showStatus('success', 'Wipe interval updated');
      });
    } catch (err) {
      console.warn("Failed to communicate settings update to background worker:", err);
      showStatus('success', 'Wipe interval updated');
    }
  };

  const handleManualWipe = async () => {
    setIsWiping(true);
    try {
      chrome.runtime.sendMessage({ type: 'MANUAL_WIPE' }, (response) => {
        setIsWiping(false);
        if (chrome.runtime.lastError) {
          console.error("Communication error during wipe:", chrome.runtime.lastError.message);
          showStatus('error', 'Failed to connect to background service');
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
      showStatus('error', 'Failed to trigger background wipe');
      console.error("Failed to call manual wipe:", err);
    }
  };

  const handleGlobalStatsChange = async (shareGlobalStats: boolean) => {
    if (!settings) return;
    const updated = { ...settings, shareGlobalStats };
    await saveSettings(updated);
    setSettings(updated);
    showStatus('success', 'Global counter preference updated');
  };

  const handleGlobalDarkModeChange = async (darkMode: boolean) => {
    if (!settings) return;
    const updated = { ...settings, darkMode };
    await saveSettings(updated);
    setSettings(updated);
    showStatus('success', `${darkMode ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleExportConfig = () => {
    if (!settings) return;
    const configData = JSON.stringify({
      urls: settings.urls,
      whitelist: settings.whitelist || [],
      interval: settings.interval
    }, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history-wiper-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('success', 'Configuration exported successfully!');
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const importedUrls = Array.isArray(json.urls) ? json.urls.map(String) : [];
        const importedWhitelist = Array.isArray(json.whitelist) ? json.whitelist.map(String) : [];
        const importedInterval = typeof json.interval === 'number' ? json.interval : settings.interval;

        const mergedUrls = Array.from(new Set([...settings.urls, ...importedUrls]));
        const mergedWhitelist = Array.from(new Set([...(settings.whitelist || []), ...importedWhitelist]));

        const updated = {
          ...settings,
          urls: mergedUrls,
          whitelist: mergedWhitelist,
          interval: importedInterval
        };
        await saveSettings(updated);
        setSettings(updated);
        showStatus('success', 'Configuration imported successfully!');
      } catch (err) {
        console.error("Failed to parse config file:", err);
        showStatus('error', 'Invalid configuration file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!settings) return <div className="p-8 text-center text-gray-500 font-medium">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
              <History className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History Wiper</h1>
                <button
                  onClick={() => handleGlobalDarkModeChange(!settings.darkMode)}
                  className="p-1.5 text-gray-400 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                  title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {settings.darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Auto-clean your browser history</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{settings.totalDeleted}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Total Deleted</div>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border ${
            status.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30'
              : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30'
          }`}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="font-medium">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Controls */}
          <div className="md:col-span-2 space-y-6">
            {/* Watchlist Section */}
            <div className="space-y-6">
              {/* Add URL Form */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" /> Add URL to Watch
                </h2>
                <form onSubmit={handleAddUrl} className="flex gap-2">
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="example.com or keyword (min 2 chars)"
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100 dark:shadow-none shrink-0"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* URL List */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                  <span>Watched URLs & Keywords</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400">{settings.urls.length} items</span>
                </h2>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {settings.urls.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 italic">No URLs added yet.</div>
                  ) : (
                    settings.urls.map((url) => (
                      <div key={url} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800/80 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition-all duration-200 group">
                        <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[80%]">{url}</span>
                        <button
                          onClick={() => handleRemoveUrl(url)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Whitelist (Exclusion List) Section */}
            <div className="space-y-6">
              {/* Add Whitelist Form */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Add URL to Exclude
                </h2>
                <form onSubmit={handleAddWhitelistUrl} className="flex gap-2">
                  <input
                    type="text"
                    value={newWhitelistUrl}
                    onChange={(e) => setNewWhitelistUrl(e.target.value)}
                    placeholder="google.com or critical-keyword (min 2 chars)"
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100 dark:shadow-none shrink-0"
                  >
                    Exclude
                  </button>
                </form>
              </div>

              {/* Whitelist List */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                  <span>Excluded URLs & Keywords</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400">
                    {(settings.whitelist || []).length} items
                  </span>
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 leading-relaxed">
                  URLs or page titles containing these keywords will never be deleted, even if they match items on your Watched watchlist.
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {!settings.whitelist || settings.whitelist.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 italic">No exclusions added yet.</div>
                  ) : (
                    settings.whitelist.map((url) => (
                      <div key={url} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800/80 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-850 transition-all duration-200 group">
                        <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-[80%]">{url}</span>
                        <button
                          onClick={() => handleRemoveWhitelistUrl(url)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
 
          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Interval Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" /> Interval
              </h2>
              <select
                value={settings.interval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors duration-200"
              >
                <option value={0.5}>30 Minutes</option>
                <option value={1}>1 Hour</option>
                <option value={6}>6 Hours</option>
                <option value={12}>12 Hours</option>
                <option value={24}>24 Hours</option>
              </select>
              <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                History matching your URLs will be cleared automatically at this interval.
              </p>
            </div>
 
            {/* Global Stats Counter Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" /> Global Counter
              </h2>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={settings.shareGlobalStats}
                  onChange={(e) => handleGlobalStatsChange(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700 cursor-pointer"
                />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium select-none group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Contribute anonymously to the global wipe counter
                </span>
              </label>
              <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500">
                Only transmits the total number of cleared items (e.g. +5). No URLs or keywords are ever sent.
              </p>
            </div>
 
            {/* Backup & Restore Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-500" /> Backup & Restore
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleExportConfig}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-750 text-gray-750 dark:text-gray-200 font-semibold text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" /> Export Configuration
                </button>
                
                <label className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer shadow-sm active:scale-[0.98]">
                  <Upload className="w-4 h-4" /> Import Configuration
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportConfig}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleManualWipe}
              disabled={isWiping || settings.urls.length === 0}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                isWiping || settings.urls.length === 0
                  ? 'bg-gray-100 dark:bg-gray-900/60 text-gray-400 dark:text-gray-500 border border-transparent dark:border-gray-800/80 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 active:scale-[0.98] shadow-blue-100 dark:shadow-none'
              }`}
            >
              {isWiping ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Play className="w-5 h-5" />
              )}
              {isWiping ? 'Wiping...' : 'Wipe Now'}
            </button>

            {settings.lastRun && (
              <div className="text-center text-gray-400 dark:text-gray-500">
                <span className="text-xs">Last wipe: {new Date(settings.lastRun).toLocaleString()}</span>
              </div>
            )}

            {/* Privacy & Compliance Card */}
            <div className="bg-gray-50/50 dark:bg-gray-950/20 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/60 transition-colors duration-200">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Privacy & Google API Compliance
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal mb-2">
                The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                All scanning and deletion occurs 100% locally in your browser. Your URLs and keywords are never collected or shared.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
