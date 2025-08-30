# 王嘉乐 你画我猜游戏

一个基于Next.js和Gemini API的你画我猜游戏。用户可以在画布上绘画，王嘉乐会尝试猜测画的是什么。

## 功能特性

- 实时绘画功能
- 王嘉乐图像识别猜测
- 响应式左右布局设计
- 清空画布功能

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Gemini API (视觉模型)

## 开始使用

首先，运行开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 环境变量

在 `.env.local` 文件中设置以下环境变量：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在[Vercel](https://vercel.com)上创建新项目
3. 连接你的GitHub仓库
4. 在Vercel项目设置中添加环境变量：
   - `GEMINI_API_KEY`: 你的Gemini API密钥
5. 部署项目

## 静态部署（解决JS/CSS显示为HTML的问题）

为了解决部署后JS和CSS文件显示为HTML内容的问题，项目已经配置为支持静态导出：

1. 运行构建命令：
   ```bash
   npm run build
   ```

2. 构建完成后，静态文件将生成在 `out` 目录中

3. 将 `out` 目录中的所有文件部署到您的静态托管服务

详细信息请查看 [DEPLOYMENT.md](DEPLOYMENT.md) 文件。

## 学习更多

要了解更多关于Next.js的信息，请查看以下资源：

- [Next.js Documentation](https://nextjs.org/docs) - 了解Next.js特性和API。
- [Learn Next.js](https://nextjs.org/learn) - 交互式Next.js教程。

你可以查看 [Next.js GitHub repository](https://github.com/vercel/next.js) - 欢迎反馈和贡献！
