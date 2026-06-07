import { Link } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
}

interface HomeProps {
  user: User | null;
}

function Home({ user }: HomeProps) {
  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-600/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gold-500/10 border border-gold-500/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-gold-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-gold-400 text-sm font-medium">掌握数据分析，开启数据驱动之旅</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              从零到一
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                数据分析师成长之路
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              通过10个真实业务场景的实战项目，系统学习Python数据分析全栈技能，
              涵盖数据预处理、可视化、机器学习等核心领域
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/learning-path" 
                className="px-8 py-3 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/25"
              >
                开始学习
              </Link>
              <Link 
                to="/learning-path" 
                className="px-8 py-3 border border-dark-600 text-white font-semibold rounded-lg hover:bg-dark-700 transition-all duration-300"
              >
                浏览课程
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-500 mb-2">10+</div>
                <div className="text-gray-400 text-sm">实战项目</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-500 mb-2">4</div>
                <div className="text-gray-400 text-sm">学习阶段</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-500 mb-2">50+</div>
                <div className="text-gray-400 text-sm">知识点</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-500 mb-2">在线</div>
                <div className="text-gray-400 text-sm">代码运行</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">学习路径</h2>
            <p className="text-gray-400">四个阶段，循序渐进，助你成为数据分析师</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-600 hover:border-gold-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">基础入门</h3>
              <p className="text-gray-400 text-sm mb-4">Python基础、NumPy、Pandas数据处理</p>
              <div className="flex items-center text-gold-500 text-sm">
                <span>2个项目</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-600 hover:border-gold-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">进阶技能</h3>
              <p className="text-gray-400 text-sm mb-4">数据可视化、统计分析、特征工程</p>
              <div className="flex items-center text-gold-500 text-sm">
                <span>3个项目</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-600 hover:border-gold-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">高级分析</h3>
              <p className="text-gray-400 text-sm mb-4">机器学习、模型评估、超参数调优</p>
              <div className="flex items-center text-gold-500 text-sm">
                <span>3个项目</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="bg-dark-700 rounded-xl p-6 border border-dark-600 hover:border-gold-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">实战综合</h3>
              <p className="text-gray-400 text-sm mb-4">综合项目、案例实战、行业解决方案</p>
              <div className="flex items-center text-gold-500 text-sm">
                <span>2个项目</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">核心功能</h2>
            <p className="text-gray-400">专为数据分析学习打造的在线平台</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">在线代码编辑器</h3>
                <p className="text-gray-400">基于Monaco Editor，支持Python语法高亮和代码补全</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">浏览器端运行</h3>
                <p className="text-gray-400">集成Pyodide，无需安装环境，直接在浏览器中运行Python代码</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">数据集生成器</h3>
                <p className="text-gray-400">自定义参数生成模拟数据，支持多种业务场景</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">实时图表展示</h3>
                <p className="text-gray-400">支持Matplotlib、Seaborn可视化，即时渲染图表结果</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">学习进度追踪</h3>
                <p className="text-gray-400">记录学习进度和成绩，激励持续学习</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">新手友好指南</h3>
                <p className="text-gray-400">详细的踩坑指南和参考代码，帮助初学者快速上手</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">技术栈</h2>
            <p className="text-gray-400">业界主流工具，助你掌握最实用的技能</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'scikit-learn'].map((tool) => (
              <div key={tool} className="bg-dark-700 rounded-lg p-4 text-center hover:border-gold-500/50 border border-dark-600 transition-all">
                <div className="text-gold-500 font-semibold">{tool}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">准备好开始你的数据分析之旅了吗？</h2>
          <p className="text-gray-400 mb-8">立即注册，免费体验所有学习内容</p>
          {user ? (
            <Link 
              to="/learning-path" 
              className="px-8 py-3 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300"
            >
              继续学习
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="px-8 py-3 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-600 transition-all duration-300"
              >
                免费注册
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-3 border border-dark-600 text-white font-semibold rounded-lg hover:bg-dark-700 transition-all duration-300"
              >
                登录账号
              </Link>
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              2026 数据分析学习平台. 保留所有权利.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 text-sm hover:text-gold-500 transition-colors">关于我们</a>
              <a href="#" className="text-gray-400 text-sm hover:text-gold-500 transition-colors">联系我们</a>
              <a href="#" className="text-gray-400 text-sm hover:text-gold-500 transition-colors">隐私政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;