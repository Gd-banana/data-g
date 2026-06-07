import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  stage: string;
  skills: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
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

interface LearningPathProps {
  progress: Progress | null;
}

const stages = [
  { 
    id: 'basic', 
    name: '基础入门', 
    description: '掌握Python数据分析的基础知识和工具',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  { 
    id: 'intermediate', 
    name: '进阶技能', 
    description: '深入学习数据可视化和统计分析',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  { 
    id: 'advanced', 
    name: '高级分析', 
    description: '掌握机器学习算法和模型评估',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  { 
    id: 'practice', 
    name: '实战综合', 
    description: '综合应用所学知识解决实际问题',
    color: 'from-gold-500 to-orange-500',
    bgColor: 'bg-gold-500/10',
    borderColor: 'border-gold-500/30'
  }
];

const projects: Project[] = [
  {
    id: 'project-1',
    title: '数据预处理高阶版',
    description: '学习数据清洗、缺失值处理、异常值检测和数据转换的高级技巧',
    stage: 'basic',
    skills: ['Pandas', 'NumPy', '数据清洗'],
    difficulty: 'easy',
    duration: '2小时'
  },
  {
    id: 'project-2',
    title: '探索性数据分析(EDA)',
    description: '掌握EDA方法论，通过可视化和统计分析发现数据规律',
    stage: 'basic',
    skills: ['Matplotlib', 'Seaborn', '统计分析'],
    difficulty: 'easy',
    duration: '3小时'
  },
  {
    id: 'project-3',
    title: '购物车关联规则挖掘',
    description: '使用Apriori算法挖掘商品之间的关联关系',
    stage: 'intermediate',
    skills: ['mlxtend', 'Apriori', '关联分析'],
    difficulty: 'medium',
    duration: '3小时'
  },
  {
    id: 'project-4',
    title: 'KMeans聚类分析实战',
    description: '使用KMeans算法进行客户分群和市场细分',
    stage: 'intermediate',
    skills: ['scikit-learn', 'KMeans', '聚类分析'],
    difficulty: 'medium',
    duration: '3小时'
  },
  {
    id: 'project-5',
    title: 'RFM模型用户分层',
    description: '基于RFM模型对用户进行价值分层和精细化运营',
    stage: 'intermediate',
    skills: ['Pandas', '用户分析', 'RFM'],
    difficulty: 'medium',
    duration: '2.5小时'
  },
  {
    id: 'project-6',
    title: '线性回归销量预测',
    description: '构建线性回归模型预测产品销量',
    stage: 'advanced',
    skills: ['scikit-learn', '线性回归', '特征工程'],
    difficulty: 'hard',
    duration: '3小时'
  },
  {
    id: 'project-7',
    title: '随机森林回归分析',
    description: '使用随机森林进行非线性回归预测',
    stage: 'advanced',
    skills: ['scikit-learn', '随机森林', '模型调优'],
    difficulty: 'hard',
    duration: '3.5小时'
  },
  {
    id: 'project-8',
    title: '时间序列完整分析',
    description: '学习时间序列分析方法，预测未来趋势',
    stage: 'advanced',
    skills: ['Pandas', 'ARIMA', '趋势分析'],
    difficulty: 'hard',
    duration: '4小时'
  },
  {
    id: 'project-9',
    title: '综合异常检测',
    description: '使用多种方法检测数据中的异常值和欺诈行为',
    stage: 'practice',
    skills: ['Isolation Forest', 'DBSCAN', '异常检测'],
    difficulty: 'hard',
    duration: '3.5小时'
  },
  {
    id: 'project-10',
    title: '数据分析综合实战',
    description: '综合运用所学知识完成一个完整的数据分析项目',
    stage: 'practice',
    skills: ['全栈分析', '报告撰写', '业务洞察'],
    difficulty: 'hard',
    duration: '5小时'
  }
];

function LearningPath({ progress }: LearningPathProps) {
  const [activeStage, setActiveStage] = useState<string>('basic');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return difficulty;
    }
  };

  const isProjectCompleted = (projectId: string) => {
    return progress?.projectProgress.some(p => p.projectId === projectId && p.completed) || false;
  };

  const getProjectScore = (projectId: string) => {
    return progress?.projectProgress.find(p => p.projectId === projectId)?.score || 0;
  };

  const filteredProjects = projects.filter(p => p.stage === activeStage);

  const stageProjectCount = stages.map(stage => ({
    ...stage,
    count: projects.filter(p => p.stage === stage.id).length,
    completed: progress?.projectProgress.filter(p => 
      projects.find(proj => proj.id === p.projectId)?.stage === stage.id && p.completed
    ).length || 0
  }));

  return (
    <div className="min-h-screen pt-16 bg-dark-900">
      <section className="py-12 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">学习路径</h1>
          <p className="text-gray-400">按照四个阶段循序渐进地学习数据分析技能</p>
        </div>
      </section>

      <section className="py-8 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stageProjectCount.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                  activeStage === stage.id
                    ? `${stage.bgColor} ${stage.borderColor} border-2`
                    : 'bg-dark-700 border-dark-600 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-semibold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                    {stage.name}
                  </span>
                  {isProjectCompleted(`project-${stage.id}`) && (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{stage.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {stage.completed}/{stage.count} 项目
                  </span>
                  <div className="w-full bg-dark-600 rounded-full h-2 mt-2">
                    <div 
                      className={`bg-gradient-to-r ${stage.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(stage.completed / stage.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {stages.find(s => s.id === activeStage)?.name} - 项目列表
            </h2>
            <span className="text-gray-400 text-sm">
              共 {filteredProjects.length} 个项目
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const completed = isProjectCompleted(project.id);
              const score = getProjectScore(project.id);
              
              return (
                <Link 
                  key={project.id} 
                  to={`/project/${project.id}`}
                  className={`bg-dark-800 rounded-xl p-6 border transition-all duration-300 hover:border-gold-500/50 group ${
                    completed ? 'border-green-500/30' : 'border-dark-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mt-2">{project.description}</p>
                    </div>
                    {completed && (
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1 bg-dark-700 text-gray-300 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                        {getDifficultyLabel(project.difficulty)}
                      </span>
                      <span className="text-gray-400 text-sm">{project.duration}</span>
                    </div>
                    {completed && score > 0 && (
                      <span className="text-gold-500 font-semibold">得分: {score}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400">该阶段暂无项目</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default LearningPath;