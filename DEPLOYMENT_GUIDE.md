# GitHub 部署指南

## ⚠️ 重要提示

由于网络环境限制，无法直接从服务器推送代码到GitHub。请按照以下步骤在本地手动完成部署。

## 📋 部署前准备

### 1. 在本地克隆仓库

打开终端，执行：

```bash
# 克隆仓库到本地
git clone https://github.com/Gd-banana/data-f.git
cd data-f
```

### 2. 推送待提交的更改

我已经创建了以下文件，需要在本地推送：

```bash
# 查看待提交的文件
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "feat: 添加部署配置和文档"

# 推送到GitHub
git push origin main
```

### 3. 启用 GitHub Pages

1. 打开 GitHub 仓库：https://github.com/Gd-banana/data-f
2. 点击 Settings（设置）
3. 在左侧菜单找到 Pages
4. Source 部分选择 "Deploy from a branch"
5. Branch 选择 "main"，文件夹选择 "/ (root)"
6. 点击 Save

### 4. 配置 GitHub Actions 自动部署

仓库中已包含 `.github/workflows/deploy.yml` 文件。
首次推送后，GitHub Actions 会自动部署网站。

等待 2-3 分钟后，访问：
- **GitHub Pages 地址**: https://Gd-banana.github.io/data-f

## 🚀 本地开发

如果想在本地运行网站：

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 后端（需要MongoDB）

```bash
cd backend
npm install

# 创建 .env 文件
echo "PORT=3000
MONGODB_URI=mongodb://localhost:27017/data-analysis-learning
JWT_SECRET=your-secret-key" > .env

npm start
```

## 🌐 部署到其他平台

### Vercel（推荐）

```bash
npm i -g vercel
cd frontend
vercel
```

### Netlify

```bash
npm i -g netlify-cli
cd frontend
netlify deploy --prod
```

## 📝 待提交的文件

在本地执行以下命令完成部署：

```bash
# 在项目根目录执行
git add .
git commit -m "feat: 添加部署配置"
git push origin main
```

## ❓ 常见问题

### Q: GitHub Token 无效怎么办？

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选以下权限：
   - repo (Full control of private repositories)
4. 生成新token并使用

### Q: 部署后网站显示 404？

等待 3-5 分钟让 GitHub Pages 完全部署完成。

### Q: 如何更新网站内容？

只需推送代码到 main 分支，GitHub Actions 会自动重新部署。

## 📞 获取帮助

如果遇到问题，请参考：
- GitHub Pages 文档: https://docs.github.com/en/pages
- GitHub Actions 文档: https://docs.github.com/en/actions
