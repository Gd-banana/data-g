import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
}

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: User | null;
  onLogout: () => void;
}

function Header({ theme, toggleTheme, user, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-dark-900/95 backdrop-blur-md border-b border-dark-700' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-gold-500' : 'bg-gold-500'
            }`}>
              <svg className="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <Link to="/" className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              数据分析学习平台
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-gold-500' 
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              首页
            </Link>
            <Link 
              to="/learning-path" 
              className={`text-sm font-medium transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-gold-500' 
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              学习路径
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-gold-500' 
                      : 'text-gray-600 hover:text-gold-600'
                  }`}
                >
                  个人中心
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-sm font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-gold-500' 
                      : 'text-gray-600 hover:text-gold-600'
                  }`}
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-sm font-medium transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-gold-500' 
                      : 'text-gray-600 hover:text-gold-600'
                  }`}
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gold-500 text-dark-900 text-sm font-semibold rounded-lg hover:bg-gold-600 transition-colors"
                >
                  注册
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-dark-700 text-gray-300 hover:bg-dark-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${
            theme === 'dark' ? 'border-dark-700' : 'border-gray-200'
          }`}>
            <div className="space-y-4">
              <Link 
                to="/" 
                className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                to="/learning-path" 
                className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                学习路径
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`block text-sm font-medium w-full text-left ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    登录
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-2 bg-gold-500 text-dark-900 text-sm font-semibold rounded-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;