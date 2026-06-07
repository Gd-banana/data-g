#!/bin/bash

# 数据分析学习网站部署脚本

echo "=========================================="
echo "  数据分析学习网站 - 部署脚本"
echo "=========================================="
echo ""

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 错误: git未安装"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm未安装"
    exit 1
fi

echo "✅ Git和npm已安装"
echo ""

# 克隆仓库
echo "📦 正在克隆仓库..."
if [ -d "data-f" ]; then
    echo "仓库已存在，正在更新..."
    cd data-f
    git pull origin main
else
    git clone https://github.com/Gd-banana/data-f.git
    cd data-f
fi

echo ""

# 安装前端依赖
echo "📦 正在安装前端依赖..."
cd frontend
npm install

echo ""

# 构建前端
echo "🔨 正在构建前端..."
npm run build

echo ""

# 部署到GitHub Pages（可选）
echo "是否部署到GitHub Pages？"
echo "1. 使用Vercel（推荐）"
echo "2. 使用Netlify"
echo "3. 使用GitHub Pages"
echo "4. 仅本地运行"
read -p "请选择 (1-4): " choice

case $choice in
    1)
        echo "📤 正在部署到Vercel..."
        npx vercel --prod
        ;;
    2)
        echo "📤 正在部署到Netlify..."
        npx netlify deploy --prod
        ;;
    3)
        echo "📤 正在部署到GitHub Pages..."
        # 需要先在GitHub仓库设置中启用GitHub Pages
        npm run deploy:github
        ;;
    4)
        echo "🚀 正在启动本地开发服务器..."
        npm run dev
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
echo ""
echo "📚 访问以下链接查看网站："
echo "   - GitHub仓库: https://github.com/Gd-banana/data-f"
echo "   - 本地预览: http://localhost:5173"
echo ""
echo "💡 提示：首次部署后，请等待1-2分钟使网站上线"
echo ""
