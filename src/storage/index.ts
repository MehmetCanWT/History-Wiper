export interface Settings {
  urls: string[];
  whitelist: string[];
  interval: number; // in hours
  lastRun?: number;
  totalDeleted: number;
  shareGlobalStats: boolean;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  urls: [],
  whitelist: [],
  interval: 1,
  totalDeleted: 0,
  shareGlobalStats: false,
  darkMode: false
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

export const addWhitelistUrl = async (url: string): Promise<void> => {
  const settings = await getSettings();
  if (!settings.whitelist.includes(url)) {
    settings.whitelist.push(url);
    await saveSettings(settings);
  }
};

export const removeWhitelistUrl = async (url: string): Promise<void> => {
  const settings = await getSettings();
  settings.whitelist = settings.whitelist.filter(u => u !== url);
  await saveSettings(settings);
};

export const incrementDeletedCount = async (count: number): Promise<void> => {
  const settings = await getSettings();
  settings.totalDeleted += count;
  settings.lastRun = Date.now();
  await saveSettings(settings);
};
