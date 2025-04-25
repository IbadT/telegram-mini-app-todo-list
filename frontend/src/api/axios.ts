import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Безопасное использование Telegram.WebApp
instance.interceptors.request.use((config) => {
  const tgWebApp = window.Telegram?.WebApp;
  
  if (tgWebApp?.initData) {
    config.headers['tg-init-data'] = tgWebApp.initData;
    
    // Для TypeScript можно добавить явную проверку
    if (tgWebApp.initDataUnsafe?.user) {
      config.headers['tg-user-id'] = tgWebApp.initDataUnsafe.user.id.toString();
    }
  }
  
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  
  return config;
});

// Обработчик ошибок с проверкой Telegram WebApp
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp?.showAlert) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Произошла ошибка';
      tgWebApp.showAlert(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default instance;



// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// const instance = axios.create({
//   baseURL: `${API_URL}/api`,
// });

// // Add a request interceptor to add the auth token to requests
// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // Add a response interceptor to handle errors
// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error);
//     return Promise.reject(error);
//   }
// );

// export default instance; 