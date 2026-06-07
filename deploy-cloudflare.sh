#!/bin/bash

# Cloudflare Pages 部署脚本

echo "=========================================="
echo "  Cloudflare Pages 部署"
echo "=========================================="
echo ""

# 检查是否已安装wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI 未安装"
    echo "正在安装 Wrangler CLI..."
    npm install -g wrangler
fi

echo "✅ Wrangler CLI 已就绪"
echo ""

# 检查是否已登录
echo "检查Cloudflare登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "📝 请登录Cloudflare..."
    wrangler login
fi

echo ""

# 克隆仓库（如果需要）
if [ ! -d "data-f" ]; then
    echo "📦 正在克隆仓库..."
    git clone https://github.com/Gd-banana/data-f.git
    cd data-f
else
    echo "📂 进入项目目录..."
    cd data-f
    echo "🔄 拉取最新代码..."
    git pull origin main
fi

echo ""

# 安装依赖
echo "📦 正在安装依赖..."
cd frontend
npm install

echo ""

# 构建项目
echo "🔨 正在构建项目..."
npm run build

echo ""

# 询问部署方式
echo "请选择部署方式："
echo "1. 部署到Cloudflare Pages（推荐）"
echo "2. 仅构建，不部署"
echo "3. 创建新项目"
read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo "🚀 正在部署到Cloudflare Pages..."
        wrangler pages deploy dist --project-name=data-analysis-learning
        echo ""
        echo "✅ 部署完成！"
        echo "访问 https://data-analysis-learning.pages.dev"
        ;;
    2)
        echo "✅ 构建完成！文件位于 frontend/dist 目录"
        ;;
    3)
        echo "📝 创建新Cloudflare Pages项目..."
        wrangler pages project create data-analysis-learning
        echo ""
        echo "🚀 部署项目..."
        wrangler pages deploy dist --project-name=data-analysis-learning
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  部署完成！🎉"
echo "=========================================="
