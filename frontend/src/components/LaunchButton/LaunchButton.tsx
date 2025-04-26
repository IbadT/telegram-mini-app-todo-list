const LaunchButton = () => {
  // Проверяем, открыто ли уже в Mini App
  const isInMiniApp = window.Telegram?.WebApp?.platform !== 'unknown';
  
  if (isInMiniApp) return null; // Не показываем кнопку внутри Mini App

  const handleLaunch = () => {
    const miniAppUrl = `https://t.me/MiniAppTodoListBot/todoapp?startapp=${Date.now()}`;
    window.open(miniAppUrl, '_blank');
  };

  return (
    <button onClick={handleLaunch} className="launch-button">
      <svg>...</svg> Open in App
    </button>
  );
};

export default LaunchButton;