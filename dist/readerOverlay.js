// src/readerOverlay.js
(function () {
  let articleData = null;
  const root = document.getElementById('reader-root');

  window.addEventListener('message', ev => {
    if (ev.data && ev.data.type === 'reader-data') {
      articleData = ev.data.article;
      renderArticle(articleData);
    }
  });

  function renderArticle(a) {
    document.title = a.title || 'Reader';
    root.innerHTML = `
      <div id="topbar">
        <button id="closeBtn">Close</button>
        <div id="controls">
          <button id="saveBtn">Save</button>
          <button id="exportBtn">Export</button>
          <button id="toggleTheme">Theme</button>
          <button id="timerBtn">Start Timer</button>
        </div>
      </div>
      <main id="article">
        <h1>${escapeHtml(a.title || '')}</h1>
        <div id="content">${a.content}</div>
      </main>
    `;
    setupHandlers();
  }

  function setupHandlers() {
    document.getElementById('closeBtn').addEventListener('click', () => {
      parent.postMessage({ type: 'close-reader' }, '*');
    });

    document.getElementById('saveBtn').addEventListener('click', async () => {
      const payload = {
        url: articleData.url,
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        savedAt: Date.now(),
        highlights: []
      };
      // Save to chrome.storage via bridge
      parent.postMessage({ type: 'save-article', payload }, '*');
      // Optionally show ephemeral UI feedback
    });

    // Other handlers (export, theme, timer) omitted for brevity; implement similarly
  }

  function escapeHtml(s) {
    return s ? s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) : '';
  }

  // Highlight handling: add event listeners on #content to capture selections and store to local DB via parent
})();
