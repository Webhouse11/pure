
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Defensive mounting function to ensure the React application initializes
 * only when the DOM is ready and the container element exists.
 */
const mount = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React Mounting Error:", error);
  }
};

// Handle mounting based on current document readyState
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  document.addEventListener('DOMContentLoaded', mount);
}
