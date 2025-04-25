// src/telegram.d.ts
interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitData {
  user?: TelegramWebAppUser;
}

interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: TelegramWebAppInitData;
  showAlert: (message: string, callback?: () => void) => void;
  ready: () => void;
  expand: () => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  version: string;
  platform: string;
  colorScheme: string;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
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
        platform: string;
        colorScheme: string;
        viewportHeight: number;
        viewportStableHeight: number;
        isExpanded: boolean;
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

export {}; // Важно для модульного окружения