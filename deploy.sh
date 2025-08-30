#!/bin/bash

# 部署到Vercel的脚本
echo "正在部署王嘉乐你画我猜游戏到Vercel..."

# 检查是否已安装Vercel CLI
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI未安装，正在安装..."
    npm install -g vercel
fi

# 登录Vercel (首次需要)
echo "请在浏览器中完成Vercel登录授权"
vercel login

# 部署项目
echo "正在部署项目..."
vercel deploy --prod

echo "部署完成！请查看上方输出获取访问URL。"