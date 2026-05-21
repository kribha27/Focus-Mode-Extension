// inside contentScript.js
window.addEventListener('message', ev => {
  if (!ev.data) return;
  if (ev.data.type === 'save-article') {
    chrome.storage.local.get({ library: [] }, data => {
      const lib = data.library || [];
      lib.unshift(ev.data.payload);
      chrome.storage.local.set({ library: lib });
      // acknowledge to iframe
      ev.source.postMessage({ type: 'save-ack', ok: true }, ev.origin);
    });
  } else if (ev.data.type === 'export-request') {
    // build export blob and trigger download via anchor element
  }
});
