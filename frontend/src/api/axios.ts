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

// Request interceptor
instance.interceptors.request.use((config) => {
  // Получаем сохраненные данные инициализации
  const initData = localStorage.getItem('tg-init-data');
  
  if (initData) {
    config.headers['tg-init-data'] = initData;
  }
  
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
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