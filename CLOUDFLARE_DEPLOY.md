# Cloudflare Pages 部署配置

## 选项1：使用Wrangler CLI（命令行）

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```
这会打开浏览器，您需要授权Wrangler访问您的Cloudflare账户。

### 3. 构建前端

```bash
cd frontend
npm install
npm run build
```

### 4. 部署

```bash
wrangler pages deploy dist --project-name=data-analysis-learning
```

### 5. 访问您的网站

部署完成后，Cloudflare会提供一个URL，例如：
`https://data-analysis-learning.pages.dev`

## 选项2：使用GitHub集成（推荐 - 自动部署）

### 步骤1：创建Cloudflare Pages项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** → **Connect to Git**
5. 选择您的GitHub仓库 `Gd-banana/data-f`
6. 配置构建设置：

**构建命令**：
```bash
npm run build
```

**构建输出目录**：
```bash
dist
```

**根目录**（高级设置）：
```bash
/frontend
```

7. 点击 **Save and Deploy**

### 步骤2：配置环境变量（可选）

如果需要，可以添加：
- `NODE_VERSION`: `18`

### 步骤3：启用自动部署

每次推送到main分支，Cloudflare Pages会自动构建和部署。

## 选项3：直接上传构建文件

### 1. 构建项目

```bash
cd frontend
npm install
npm run build
```

### 2. 上传到Cloudflare Pages

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Workers & Pages → Create application → Pages → Direct upload
3. 上传 `frontend/dist` 文件夹内容
4. 设置项目名称
5. 点击 **Deploy**

## 🌐 自定义域名（可选）

### 添加自定义域名

1. 在Cloudflare Pages项目中，点击 **Custom domains**
2. 输入您的域名
3. 按照指示添加DNS记录
4. 等待SSL证书自动配置

### 推荐域名设置

| 类型 | 名称 | 内容 |
|------|------|------|
| CNAME | www | data-analysis-learning.pages.dev |
| CNAME | @ | data-analysis-learning.pages.dev |

## ⚙️ Cloudflare Pages 配置文件

项目已包含 `_routes.json` 文件用于配置Cloudflare Pages的路由规则。

## 📊 部署后配置

### 启用Cloudflare分析

1. 在Pages项目中，点击 **View Details**
2. 查看部署历史和 Analytics

### 配置缓存规则

为提高性能，可以配置：

```json
{
  "version": 1,
  "include": ["*"],
  "exclude": ["/api/*"],
  "patch": [
    {
      "path": "*.html",
      "headers": {
        "Cache-Control": "public, max-age=0, must-revalidate"
      }
    },
    {
      "path": "*.js",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "path": "*.css",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

## 🚀 快速开始命令

### 完整部署流程

```bash
# 克隆仓库
git clone https://github.com/Gd-banana/data-f.git
cd data-f

# 进入前端目录
cd frontend

# 安装依赖
npm install

# 构建项目
npm run build

# 使用Wrangler部署
wrangler pages deploy dist --project-name=data-analysis-learning
```

### 交互式部署

```bash
wrangler pages project create data-analysis-learning
wrangler pages deploy dist
```

## 🔧 Wrangler配置

创建 `wrangler.toml` 文件：

```toml
name = "data-analysis-learning"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./frontend/dist"

[vars]
NODE_VERSION = "18"
```

## 📝 重要提示

1. **构建目录**：确保构建输出在 `frontend/dist`
2. **Node版本**：建议使用 Node 18
3. **环境变量**：如果需要后端API，需要配置 `VITE_API_URL`
4. **CORS问题**：如果后端部署在其他地方，需要配置跨域资源共享

## 💡 建议的生产部署架构

### 前端：Cloudflare Pages
- 静态网站托管
- 全球CDN加速
- 免费SSL证书

### 后端：Cloudflare Workers 或 其他平台
- API服务
- 数据库：MongoDB Atlas（免费版）
- 或者使用Railway、Render等免费后端托管

## 🆘 常见问题

### Q: 构建失败怎么办？

检查：
- Node版本是否正确
- 依赖是否完整安装
- 构建命令是否正确

### Q: 部署后页面空白？

1. 检查是否正确配置了 `base` 路径
2. 检查浏览器控制台是否有错误
3. 确认 `_routes.json` 配置正确

### Q: 如何回滚到之前的版本？

在Cloudflare Dashboard中，点击 **Deployments**，选择之前的版本，点击 **Rollback**。

## 🎯 下一步

1. 在Cloudflare Dashboard创建Pages项目
2. 连接GitHub仓库（或直接上传）
3. 配置构建设置
4. 等待自动部署
5. 配置自定义域名（可选）
6. 访问您的网站！

您的网站将部署在 **https://data-analysis-learning.pages.dev** 或您自定义的域名上！
