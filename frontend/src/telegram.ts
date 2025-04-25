// Добавляем типы для Telegram WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        showAlert: (message: string) => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        version: string;
        platform: string;
      };
    };
  }
}

export function initializeTelegramSDK() {
  // Проверяем, что мы находимся в Telegram WebApp
  if (window.Telegram?.WebApp) {
    const tgWebApp = window.Telegram.WebApp;
    
    // Инициализируем приложение
    tgWebApp.ready();
    
    // Расширяем приложение на весь экран
    tgWebApp.expand();
    
    // Устанавливаем цвет фона
    tgWebApp.setBackgroundColor('#ffffff');
    
    // Включаем кнопку "назад"
    tgWebApp.enableClosingConfirmation();
    
    // Логируем данные инициализации для отладки
    console.log('Telegram WebApp initialized:', {
      initData: tgWebApp.initData,
      initDataUnsafe: tgWebApp.initDataUnsafe,
      platform: tgWebApp.platform,
      version: tgWebApp.version
    });
  } else {
    console.warn('Telegram WebApp not found. Running in browser mode.');
  }
} 