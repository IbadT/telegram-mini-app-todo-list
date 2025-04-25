import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeTelegramSDK } from './telegram';

// Инициализируем Telegram WebApp перед рендерингом приложения
initializeTelegramSDK();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
