// src/telegram.d.ts
interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  showAlert: (message: string, callback?: () => void) => void;
  ready: () => void;
  expand: () => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  version: string;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export {}; // Важно для модульного окружения