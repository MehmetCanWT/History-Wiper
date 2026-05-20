import { getSettings, incrementDeletedCount } from '../storage';

const ALARM_NAME = 'history-wiper-alarm';

const setupAlarm = async () => {
  const settings = await getSettings();
  await chrome.alarms.clear(ALARM_NAME);
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: settings.interval * 60,
  });
};

const wipeHistory = async () => {
  const settings = await getSettings();
  if (settings.urls.length === 0) return;

  let totalDeletedThisRun = 0;

  for (const urlPattern of settings.urls) {
    // Search for the URL pattern in history
    const historyItems = await chrome.history.search({
      text: urlPattern,
      startTime: 0, // Search all history
      maxResults: 1000,
    });

    for (const item of historyItems) {
      if (item.url && item.url.includes(urlPattern)) {
        await chrome.history.deleteUrl({ url: item.url });
        totalDeletedThisRun++;
      }
    }
  }

  if (totalDeletedThisRun > 0) {
    await incrementDeletedCount(totalDeletedThisRun);
  }
};

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    wipeHistory();
  }
});

// Listen for runtime messages (for manual trigger or settings update)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'UPDATE_SETTINGS') {
    setupAlarm();
    sendResponse({ success: true });
  } else if (message.type === 'MANUAL_WIPE') {
    wipeHistory().then(() => sendResponse({ success: true }));
    return true; // Keep channel open for async response
  }
});

// Initial setup
chrome.runtime.onInstalled.addListener(() => {
  setupAlarm();
});
