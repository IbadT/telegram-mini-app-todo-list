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