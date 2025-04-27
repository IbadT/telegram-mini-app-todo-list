import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button, Input, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '../api/axios';

const { Title } = Typography;

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  // const { webApp } = useTelegram();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`/auth/${isLogin ? 'login' : 'register'}`, {
        email,
        password,
      });

      if (response.data.access_token) {
        setToken(response.data.access_token);
        setUser(response.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  // const handleTelegramAuth = async () => {
  //   try {
  //     const response = await axios.post('/auth/telegram', {
  //       initData: webApp?.initData,
  //     });

  //     if (response.data.access_token) {
  //       setToken(response.data.access_token);
  //       setUser(response.data.user);
  //       navigate('/');
  //     }
  //   } catch (err) {
  //     setError('Telegram authentication failed. Please try again.');
  //   }
  // };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Card style={{ width: 400, maxWidth: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center' }}>
            {isLogin ? 'Login' : 'Register'}
          </Title>

          {error && (
            <div style={{ color: 'red', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="primary" htmlType="submit" block>
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </Space>
          </form>

          <Button type="link" onClick={() => setIsLogin(!isLogin)} block>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </Button>

          {/* {webApp?.initData && (
            <Button type="default" onClick={handleTelegramAuth} block>
              Login with Telegram
            </Button>
          )} */}
        </Space>
      </Card>
    </div>
  );
};

export default AuthPage; 