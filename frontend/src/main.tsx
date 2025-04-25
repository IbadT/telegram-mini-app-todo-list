import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
    await init();
    
    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App initialized');
    }

    if (miniApp.setHeaderColor.isAvailable()) {
      miniApp.setHeaderColor('#fcb69f');
    }
  } catch (error) { 
    console.error('Error initializing Telegram Mini App:', error); 
  }
};

initializeTelegramSDK();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
