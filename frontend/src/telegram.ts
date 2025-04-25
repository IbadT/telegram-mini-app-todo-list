export function initializeTelegramSDK() {
  console.log('Initializing Telegram SDK...');
  console.log('Window.Telegram:', window.Telegram);
  
  // Проверяем, что мы находимся в Telegram WebApp
  if (window.Telegram?.WebApp) {
    const tgWebApp = window.Telegram.WebApp;
    console.log('Telegram WebApp found:', {
      initData: tgWebApp.initData,
      initDataUnsafe: tgWebApp.initDataUnsafe,
      version: tgWebApp.version,
      platform: tgWebApp.platform,
      colorScheme: tgWebApp.colorScheme,
      viewportHeight: tgWebApp.viewportHeight,
      viewportStableHeight: tgWebApp.viewportStableHeight,
      isExpanded: tgWebApp.isExpanded,
      themeParams: tgWebApp.themeParams
    });
    
    // Инициализируем приложение
    tgWebApp.ready();
    console.log('Telegram WebApp ready() called');
    
    // Расширяем приложение на весь экран
    tgWebApp.expand();
    console.log('Telegram WebApp expand() called');
    
    // Устанавливаем цвет фона
    tgWebApp.setBackgroundColor('#ffffff');
    console.log('Telegram WebApp setBackgroundColor() called');
    
    // Включаем кнопку "назад"
    tgWebApp.enableClosingConfirmation();
    console.log('Telegram WebApp enableClosingConfirmation() called');
  } else {
    console.warn('Telegram WebApp not found in window object');
  }
} 