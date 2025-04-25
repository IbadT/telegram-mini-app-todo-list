import axios from 'axios';

// Проверяем, что находимся в Telegram WebApp
const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram?.WebApp;

// Получаем initData (обязательно для авторизации)
const initData = isTelegramWebApp ? window.Telegram.WebApp.initData : null;

if (!initData && isTelegramWebApp) {
  console.error('Telegram initData is required!');
}

const instance = axios.create({
  baseURL: 'https://telegram-mini-app-todo-list.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Telegram-Init-Data': initData || ''
  },
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    if (isTelegramWebApp && window.Telegram.WebApp.initData) {
      config.headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && isTelegramWebApp) {
      // Показываем уведомление об ошибке через Telegram API
      window.Telegram.WebApp.showAlert(
        'Сессия истекла. Пожалуйста, перезайдите в приложение.'
      );
    }
    return Promise.reject(error);
  }
);

export default instance;






// import axios from 'axios';
// import { useAuthStore } from '../store/authStore';
// const initData = window.Telegram.WebApp.initData;


// const instance = axios.create({
//   baseURL: 'https://telegram-mini-app-todo-list.onrender.com/api',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'X-Telegram-Init-Data': initData
//   },
//   withCredentials: true,
// });

// // Set auth token from localStorage if it exists
// const token = localStorage.getItem('token');
// if (token) {
//   instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }

// // Request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     console.log('Request config:', config);
//     return config;
//   },
//   (error) => {
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// instance.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response);
//     return response;
//   },
//   async (error) => {
//     console.error('Response error:', error);
//     const originalRequest = error.config;

//     // If the error is 401 and we haven't tried to refresh the token yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Try to refresh the token
//         const response = await axios.post('/auth/refresh', {}, { withCredentials: true });
//         const { token } = response.data;
        
//         // Update the token in localStorage and axios headers
//         localStorage.setItem('token', token);
//         instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
//         // Retry the original request
//         return instance(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, logout the user
//         useAuthStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;



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