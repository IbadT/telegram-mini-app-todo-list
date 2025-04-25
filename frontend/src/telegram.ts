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
  }
} 