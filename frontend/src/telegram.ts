export function initializeTelegramSDK() {
  return new Promise<void>((resolve) => {
    const checkTelegram = () => {
      if (window.Telegram?.WebApp) {
        const tgWebApp = window.Telegram.WebApp;
        console.log('Telegram WebApp found:', {
          initData: tgWebApp.initData,
          initDataUnsafe: tgWebApp.initDataUnsafe,
          version: tgWebApp.version
        });
        
        tgWebApp.ready();
        console.log('Telegram WebApp ready() called');
        
        tgWebApp.expand();
        console.log('Telegram WebApp expand() called');
        
        tgWebApp.setBackgroundColor('#ffffff');
        console.log('Telegram WebApp setBackgroundColor() called');
        
        tgWebApp.enableClosingConfirmation();
        console.log('Telegram WebApp enableClosingConfirmation() called');
        
        resolve();
      } else {
        console.log('Waiting for Telegram WebApp...');
        setTimeout(checkTelegram, 100);
      }
    };

    checkTelegram();
  });
} 