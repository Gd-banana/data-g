import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginProps {
  onLogin: (user: { id: string; username: string; email: string }, token: string) => void;
}

interface User {
  id: string;
  username: string;
  email: string;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      onLogin(user as User, token);
      navigate('/');
    } catch (err) {
      setError('邮箱或密码错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-dark-900">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">欢迎回来</h1>
          <p className="text-gray-400 mt-2">请登录您的账号</p>
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                placeholder="请输入邮箱"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              还没有账号？{' '}
              <Link to="/register" className="text-gold-500 hover:text-gold-400 transition-colors">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;