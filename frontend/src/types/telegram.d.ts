declare global {
  interface Window {
    Telegram: {
      WebApp: {
        openTelegramLink: (url: string) => void;
        ready: () => void;
        expand: () => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        showAlert: (message: string) => void;
        initData: string;
        initDataUnsafe: any;
        version: string;
        platform: string;
      };
    };
  }
}

export {}; 