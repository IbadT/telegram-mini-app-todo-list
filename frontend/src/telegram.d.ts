// src/telegram.d.ts
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
          version: string;
          // Добавьте другие методы, которые используете
        };
      };
    }
  }
  
  export {}; // Важно для модульного окружения