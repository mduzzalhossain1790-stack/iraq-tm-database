// Make window.fetch writable to prevent polyfill errors in sandboxed iframes
(function() {
  try {
    let currentFetch = window.fetch;
    const patch = {
      get() {
        return currentFetch;
      },
      set(val) {
        currentFetch = val;
      },
      configurable: true,
      enumerable: true
    };
    
    // Try patching Window.prototype
    if (typeof Window !== 'undefined' && Window.prototype && 'fetch' in Window.prototype) {
      Object.defineProperty(Window.prototype, 'fetch', patch);
    }
    
    // Try patching window itself
    if ('fetch' in window) {
      try {
        Object.defineProperty(window, 'fetch', patch);
      } catch (e) {
        // Ignore if non-configurable
      }
    }

    // Try patching globalThis
    if (typeof globalThis !== 'undefined' && 'fetch' in globalThis) {
      try {
        Object.defineProperty(globalThis, 'fetch', patch);
      } catch (e) {}
    }
  } catch (err) {
    console.warn("Failed to patch fetch getter/setter in main.tsx:", err);
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
