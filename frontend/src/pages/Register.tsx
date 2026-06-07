import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RegisterProps {
  onLogin: (user: { id: string; username: string; email: string }, token: string) => void;
}

interface User {
  id: string;
  username: string;
  email: string;
}

function Register({ onLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });

      const { token, user } = response.data;
      onLogin(user as User, token);
      navigate('/');
    } catch (err) {
      setError('用户名或邮箱已存在');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">创建账号</h1>
          <p className="text-gray-400 mt-2">开始您的数据分析学习之旅</p>
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                placeholder="请输入用户名"
                required
              />
            </div>

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
                placeholder="请输入密码（至少6位）"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                placeholder="请再次输入密码"
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
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              已有账号？{' '}
              <Link to="/login" className="text-gold-500 hover:text-gold-400 transition-colors">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;