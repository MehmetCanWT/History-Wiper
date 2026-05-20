export interface Settings {
  urls: string[];
  interval: number; // in hours
  lastRun?: number;
  totalDeleted: number;
}

const DEFAULT_SETTINGS: Settings = {
  urls: [],
  interval: 1,
  totalDeleted: 0
};

export const getSettings = async (): Promise<Settings> => {
  const result = await chrome.storage.local.get(['settings']);
  return { ...DEFAULT_SETTINGS, ...result.settings };
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  await chrome.storage.local.set({ settings });
};

export const addUrl = async (url: string): Promise<void> => {
  const settings = await getSettings();
  if (!settings.urls.includes(url)) {
    settings.urls.push(url);
    await saveSettings(settings);
  }
};

export const removeUrl = async (url: string): Promise<void> => {
  const settings = await getSettings();
  settings.urls = settings.urls.filter(u => u !== url);
  await saveSettings(settings);
};

export const incrementDeletedCount = async (count: number): Promise<void> => {
  const settings = await getSettings();
  settings.totalDeleted += count;
  settings.lastRun = Date.now();
  await saveSettings(settings);
};
