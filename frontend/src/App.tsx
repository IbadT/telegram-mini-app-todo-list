import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import MainContent from './components/MainContent';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { token } = useAuthStore();
  const [isInitialized] = useState(true);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={!token ? <AuthPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={token ? '/' : '/auth'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;