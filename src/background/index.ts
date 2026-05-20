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
  try {
    const settings = await getSettings();
    if (settings.urls.length === 0) return;

    let totalDeletedThisRun = 0;

    for (const urlPattern of settings.urls) {
      if (!urlPattern.trim()) continue;

      try {
        // Search for the URL pattern in history
        const historyItems = await chrome.history.search({
          text: urlPattern,
          startTime: 0, // Search all history
          maxResults: 1000,
        });

        for (const item of historyItems) {
          if (item.url && item.url.includes(urlPattern)) {
            try {
              await chrome.history.deleteUrl({ url: item.url });
              totalDeletedThisRun++;
            } catch (err) {
              console.error(`Failed to delete URL: ${item.url}`, err);
            }
          }
        }
      } catch (err) {
        console.error(`Failed searching history for pattern "${urlPattern}":`, err);
      }
    }

    if (totalDeletedThisRun > 0) {
      await incrementDeletedCount(totalDeletedThisRun);
    }
  } catch (err) {
    console.error("Critical error during wipeHistory:", err);
  }
};

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    wipeHistory().catch((err) => console.error("Alarm-triggered wipeHistory failed:", err));
  }
});

// Listen for runtime messages (for manual trigger or settings update)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'UPDATE_SETTINGS') {
    setupAlarm()
      .then(() => sendResponse({ success: true }))
      .catch((err) => {
        console.error("Failed to setup alarm:", err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async response
  } else if (message.type === 'MANUAL_WIPE') {
    wipeHistory()
      .then(() => sendResponse({ success: true }))
      .catch((err) => {
        console.error("Manual wipe failed:", err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async response
  }
});

// Initial setup
chrome.runtime.onInstalled.addListener(() => {
  setupAlarm();
});
