import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import LearningPath from './pages/LearningPath';
import Project from './pages/Project';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

type Theme = 'dark' | 'light';

interface User {
  id: string;
  username: string;
  email: string;
}

interface Progress {
  stageProgress: {
    basic: number;
    intermediate: number;
    advanced: number;
    practice: number;
  };
  projectProgress: {
    projectId: string;
    completed: boolean;
    score: number;
    completedAt?: Date;
  }[];
  totalScore: number;
}

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setProgress(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-900' : 'bg-white'} transition-colors duration-300`}>
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={user} 
          onLogout={handleLogout} 
        />
        <main>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/learning-path" element={<LearningPath progress={progress} />} />
            <Route path="/project/:id" element={<Project user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route 
              path="/profile" 
              element={<Profile 
                user={user} 
                progress={progress} 
                setProgress={setProgress} 
              />} 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;