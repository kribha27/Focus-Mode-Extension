// src/background.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Simple message handler: set/clear alarms and show notifications.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;

  if (msg.type === 'set-alarm') {
    // msg.name, msg.whenMs (timestamp in ms)
    chrome.alarms.create(msg.name, { when: msg.whenMs });
    sendResponse({ ok: true });
  } else if (msg.type === 'clear-alarm') {
    chrome.alarms.clear(msg.name, cleared => sendResponse({ ok: cleared }));
    return true;
  } else if (msg.type === 'notify') {
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: msg.title || 'Focus Timer',
      message: msg.message || ''
    }, id => sendResponse({ ok: !!id }));
    return true;
  } else {
    sendResponse({ ok: false, error: 'unknown-type' });
  }

  return true; // keep channel open for async responses
});

// Forward alarm events so content scripts / UI can react
chrome.alarms.onAlarm.addListener(alarm => {
  // Broadcast a runtime message; pages/content scripts can listen for this
  chrome.runtime.sendMessage({ type: 'alarm-fired', name: alarm.name });
  // Also show a default notification
  chrome.notifications.create('', {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Timer finished',
    message: 'Your focus session ended.'
  });
});
