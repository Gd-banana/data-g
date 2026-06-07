# 数据分析学习网站

一个全栈式数据分析学习平台，采用黑金科技风格设计。

## 功能特性

- **10个Python数据分析实操项目** - 从数据清洗到机器学习的完整学习路径
- **浏览器端Python运行环境** - 使用Pyodide技术，无需安装任何软件
- **在线代码编辑器** - 基于Monaco Editor，支持语法高亮
- **智能代码检测** - 自动检测语法错误、拼写错误等
- **用户系统** - 注册、登录、学习进度跟踪
- **深色/浅色模式** - 舒适的学习体验
- **响应式设计** - 适配各种设备

## 技术栈

### 前端
- React 18 + TypeScript
- TailwindCSS 3
- Vite
- Monaco Editor
- Pyodide（浏览器端Python）

### 后端
- Node.js + Express
- MongoDB
- JWT认证

## 快速开始

### 前端部署（GitHub Pages）

1. 克隆仓库
```bash
git clone https://github.com/Gd-banana/data-f.git
cd data-f/frontend
```

2. 安装依赖
```bash
npm install
```

3. 开发环境运行
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

5. 部署到GitHub Pages
- 使用Vercel、Netlify或GitHub Actions自动部署
- 或将 `dist` 目录内容部署到静态托管服务

### 后端部署

1. 克隆仓库
```bash
git clone https://github.com/Gd-banana/data-f.git
cd data-f/backend
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件：
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/data-analysis-learning
JWT_SECRET=your-secret-key
```

4. 启动服务器
```bash
npm start
```

## 项目结构

```
data-f/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── utils/        # 工具函数
│   │   └── types/        # TypeScript类型定义
│   ├── public/           # 静态资源
│   └── package.json
│
├── backend/              # 后端项目
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── server.js        # 服务器入口
│   └── package.json
│
└── README.md
```

## 学习路径

1. 数据预处理高阶版
2. 探索性数据分析(EDA)
3. 购物车关联规则挖掘
4. KMeans聚类分析实战
5. RFM模型用户分层
6. 线性回归销量预测
7. 随机森林回归分析
8. 时间序列完整分析
9. 综合异常检测
10. 数据分析综合实战

## 在线体验

访问 https://Gd-banana.github.io/data-f （需要配置GitHub Pages）

## 开发说明

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
npm install
npm run dev  # 开发模式
npm start   # 生产模式
```

## 许可证

MIT License

## 作者

- GitHub: [Gd-banana](https://github.com/Gd-banana)

## 贡献

欢迎提交Issue和Pull Request！
