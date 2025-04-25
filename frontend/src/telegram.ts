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
      version: tgWebApp.version
    });
  } else {
    console.warn('Telegram WebApp not found. Running in browser mode.');
  }
} 