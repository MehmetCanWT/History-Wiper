import { getSettings, incrementDeletedCount } from '../storage';

const ALARM_NAME = 'history-wiper-alarm';

const setupAlarm = async () => {
  const settings = await getSettings();
  await chrome.alarms.clear(ALARM_NAME);
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: settings.interval * 60,
  });
};

const getInstallationId = async (): Promise<string> => {
  const result = await chrome.storage.local.get(['installationId']);
  if (result.installationId) {
    return result.installationId;
  }
  const newId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
  await chrome.storage.local.set({ installationId: newId });
  return newId;
};

const computeSignature = async (count: number, timestamp: number, installationId: string): Promise<string> => {
  const secretSalt = "HistoryWiperSecureSalt2026!";
  const data = `${count}:${timestamp}:${installationId}:${secretSalt}`;
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const reportDeletedCount = async (count: number) => {
  try {
    const installationId = await getInstallationId();
    const timestamp = Date.now();
    const signature = await computeSignature(count, timestamp, installationId);

    const response = await fetch('https://api.historywiper.com/api/increment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        count,
        timestamp,
        installationId,
        signature
      }),
    });
    if (!response.ok) {
      console.warn("Global stats server returned an error status:", response.status);
    } else {
      console.log(`Successfully reported ${count} deleted items to global counter with cryptographic signature.`);
    }
  } catch (err) {
    console.warn("Could not report stats to global server (offline or custom API endpoint not configured yet):", err);
  }
};

const wipeHistory = async (): Promise<number> => {
  let totalDeletedThisRun = 0;
  try {
    const settings = await getSettings();
    if (settings.urls.length === 0) return 0;

    for (const urlPattern of settings.urls) {
      const trimmedPattern = urlPattern.trim().toLowerCase();
      if (trimmedPattern.length < 2) {
        console.warn(`Safety Guard: Skipping pattern "${urlPattern}" because it is too short (< 2 characters) to prevent accidental mass deletion.`);
        continue;
      }

      try {
        // Search for the URL pattern in history (queries both title and URL)
        const historyItems = await chrome.history.search({
          text: trimmedPattern,
          startTime: 0, // Search all history
          maxResults: 1000,
        });

        for (const item of historyItems) {
          if (!item.url) continue;

          // Double check that either url or title actually contains the pattern case-insensitively
          const urlMatches = item.url.toLowerCase().includes(trimmedPattern);
          const titleMatches = item.title && item.title.toLowerCase().includes(trimmedPattern);

          if (urlMatches || titleMatches) {
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
      
      // Anonymously report count to global counter if enabled
      if (settings.shareGlobalStats) {
        reportDeletedCount(totalDeletedThisRun);
      }
    }
  } catch (err) {
    console.error("Critical error during wipeHistory:", err);
  }
  return totalDeletedThisRun;
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
      .then((count) => sendResponse({ success: true, count }))
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
