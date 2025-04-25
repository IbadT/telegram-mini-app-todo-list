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
    
    console.log('Telegram WebApp initialized:', {
      initData: tgWebApp.initData,
      initDataUnsafe: tgWebApp.initDataUnsafe,
      version: tgWebApp.version
    });
  } else {
    console.warn('Not running in Telegram WebApp environment');
  }
} 