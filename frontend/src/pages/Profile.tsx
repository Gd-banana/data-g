import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

interface ProfileProps {
  user: User | null;
  progress: Progress | null;
  setProgress: React.Dispatch<React.SetStateAction<Progress | null>>;
}

const stages = [
  { id: 'basic', name: '基础入门', color: 'from-blue-500 to-cyan-500' },
  { id: 'intermediate', name: '进阶技能', color: 'from-green-500 to-emerald-500' },
  { id: 'advanced', name: '高级分析', color: 'from-purple-500 to-pink-500' },
  { id: 'practice', name: '实战综合', color: 'from-gold-500 to-orange-500' }
];

const projects = [
  { id: 'project-1', title: '数据预处理高阶版', stage: 'basic' },
  { id: 'project-2', title: '探索性数据分析', stage: 'basic' },
  { id: 'project-3', title: '购物车关联规则挖掘', stage: 'intermediate' },
  { id: 'project-4', title: 'KMeans聚类分析实战', stage: 'intermediate' },
  { id: 'project-5', title: 'RFM模型用户分层', stage: 'intermediate' },
  { id: 'project-6', title: '线性回归销量预测', stage: 'advanced' },
  { id: 'project-7', title: '随机森林回归分析', stage: 'advanced' },
  { id: 'project-8', title: '时间序列完整分析', stage: 'advanced' },
  { id: 'project-9', title: '综合异常检测', stage: 'practice' },
  { id: 'project-10', title: '数据分析综合实战', stage: 'practice' }
];

function Profile({ user, progress, setProgress }: ProfileProps) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(response.data);
      } catch (error) {
        console.error('获取进度失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, setProgress, navigate]);

  if (!user || loading) {
    return (
      <div className="min-h-screen pt-16 bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const completedProjects = progress?.projectProgress.filter(p => p.completed).length || 0;
  const totalProjects = projects.length;
  const completionRate = Math.round((completedProjects / totalProjects) * 100);

  const getStageStats = (stageId: string) => {
    const stageProjects = projects.filter(p => p.stage === stageId);
    const completed = progress?.projectProgress.filter(p => 
      stageProjects.some(sp => sp.id === p.projectId) && p.completed
    ).length || 0;
    return { completed, total: stageProjects.length };
  };

  const getProjectStatus = (projectId: string) => {
    return progress?.projectProgress.find(p => p.projectId === projectId);
  };

  return (
    <div className="min-h-screen pt-16 bg-dark-900">
      <section className="py-12 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.username}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">学习进度</p>
                  <p className="text-3xl font-bold text-white mt-1">{completionRate}%</p>
                </div>
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>已完成</span>
                  <span>{completedProjects}/{totalProjects} 项目</span>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">总得分</p>
                  <p className="text-3xl font-bold text-gold-500 mt-1">{progress?.totalScore || 0}</p>
                </div>
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl border border-dark-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">学习阶段</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {stages.find((_, index) => {
                      const stats = getStageStats(stages[index].id);
                      return stats.completed === stats.total && (index === stages.length - 1 || getStageStats(stages[index + 1].id).completed === 0);
                    })?.name || '基础入门'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-white mb-6">阶段进度</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stages.map((stage) => {
              const stats = getStageStats(stage.id);
              const percentage = Math.round((stats.completed / stats.total) * 100);
              
              return (
                <div 
                  key={stage.id}
                  className={`p-4 rounded-xl border ${
                    stats.completed === stats.total 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-dark-700 border-dark-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                      {stage.name}
                    </span>
                    {stats.completed === stats.total && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{stats.completed}/{stats.total}</div>
                  <div className="w-full bg-dark-600 rounded-full h-1.5">
                    <div 
                      className={`bg-gradient-to-r ${stage.color} h-1.5 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-white mb-6">项目进度</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
            {projects.map((project) => {
              const status = getProjectStatus(project.id);
              const stage = stages.find(s => s.id === project.stage);
              
              return (
                <div 
                  key={project.id}
                  className={`p-4 rounded-xl border transition-all ${
                    status?.completed 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-dark-800 border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{project.title}</h3>
                      <span className={`text-xs mt-1 inline-block bg-gradient-to-r ${stage?.color} bg-clip-text text-transparent`}>
                        {stage?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {status?.completed && (
                        <>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {status.score > 0 && (
                            <span className="text-gold-500 font-semibold">{status.score}分</span>
                          )}
                        </>
                      )}
                      {!status?.completed && (
                        <span className="text-gray-500 text-sm">未完成</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;