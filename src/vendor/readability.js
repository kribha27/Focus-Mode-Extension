// src/vendor/readability.js
// Lightweight loader for Mozilla Readability.
// For quick testing this script will try to load a local copy
// at "src/vendor/readability-full.js" (if you later add the full library).
// If not present, it will fetch a CDN copy and evaluate it at runtime.
//
// Note: For production/distributed extension, it's best to include the
// full Readability code bundled locally and reference it directly.

(function () {
  const LOCAL_NAME = chrome.runtime ? chrome.runtime.getURL('src/vendor/readability-full.js') : 'src/vendor/readability-full.js';
  const CDN_URL = 'https://unpkg.com/@mozilla/readability@0.4.4/Readability.js';

  // Try to fetch local first (fast if present)
  function fetchAndEval(url) {
    return fetch(url, { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error('fetch failed ' + res.status);
        return res.text();
      })
      .then(code => {
        // Evaluate in this scope so Readability is available globally inside the iframe/context
        try {
          // eslint-disable-next-line no-eval
          eval(code);
          console.info('Readability loaded from', url);
        } catch (e) {
          console.error('Failed to eval Readability', e);
          throw e;
        }
      });
  }

  // Try local, fallback to CDN
  fetchAndEval(LOCAL_NAME).catch(() => {
    // If local failed, try CDN
    fetchAndEval(CDN_URL).catch(err => {
      console.error('Could not load Readability library. Add a local copy at src/vendor/readability-full.js or allow CDN fetch.', err);
    });
  });
})();
