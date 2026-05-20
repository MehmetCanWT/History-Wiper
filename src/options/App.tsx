import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Clock, History, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { getSettings, saveSettings, Settings } from '../storage';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await getSettings();
    setSettings(s);
  };

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !settings) return;

    if (settings.urls.includes(newUrl)) {
      showStatus('error', 'URL already exists in list');
      return;
    }

    const updated = { ...settings, urls: [...settings.urls, newUrl] };
    await saveSettings(updated);
    setSettings(updated);
    setNewUrl('');
    showStatus('success', 'URL added successfully');
  };

  const handleRemoveUrl = async (url: string) => {
    if (!settings) return;
    const updated = { ...settings, urls: settings.urls.filter(u => u !== url) };
    await saveSettings(updated);
    setSettings(updated);
    showStatus('success', 'URL removed');
  };

  const handleIntervalChange = async (interval: number) => {
    if (!settings) return;
    const updated = { ...settings, interval };
    await saveSettings(updated);
    setSettings(updated);
    chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS' });
    showStatus('success', 'Wipe interval updated');
  };

  const handleManualWipe = async () => {
    setIsWiping(true);
    chrome.runtime.sendMessage({ type: 'MANUAL_WIPE' }, (response) => {
      setIsWiping(false);
      if (response?.success) {
        showStatus('success', 'History wiped successfully');
        loadSettings();
      } else {
        showStatus('error', 'Failed to wipe history');
      }
    });
  };

  if (!settings) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
              <History className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">History Wiper</h1>
              <p className="text-sm text-gray-500 font-medium">Auto-clean your browser history</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{settings.totalDeleted}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Deleted</div>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Controls */}
          <div className="md:col-span-2 space-y-6">
            {/* Add URL Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" /> Add URL to Watch
              </h2>
              <form onSubmit={handleAddUrl} className="flex gap-2">
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="example.com or keyword"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
                >
                  Add
                </button>
              </form>
            </div>

            {/* URL List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                <span>Watched URLs</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{settings.urls.length} items</span>
              </h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {settings.urls.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 italic">No URLs added yet.</div>
                ) : (
                  settings.urls.map((url) => (
                    <div key={url} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <span className="text-gray-700 font-medium truncate max-w-[80%]">{url}</span>
                      <button
                        onClick={() => handleRemoveUrl(url)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" /> Interval
              </h2>
              <select
                value={settings.interval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium"
              >
                <option value={0.5}>30 Minutes</option>
                <option value={1}>1 Hour</option>
                <option value={6}>6 Hours</option>
                <option value={12}>12 Hours</option>
                <option value={24}>24 Hours</option>
              </select>
              <p className="mt-3 text-xs text-gray-400">
                History matching your URLs will be cleared automatically at this interval.
              </p>
            </div>

            <button
              onClick={handleManualWipe}
              disabled={isWiping || settings.urls.length === 0}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                isWiping || settings.urls.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 active:scale-[0.98] shadow-blue-100'
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
              <div className="text-center">
                <span className="text-xs text-gray-400">Last wipe: {new Date(settings.lastRun).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
