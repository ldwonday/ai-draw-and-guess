# 静态部署说明

为了解决部署后JS和CSS文件显示为HTML内容的问题，我们已经配置了Next.js以支持静态导出。

## 配置更改

1. 在 `next.config.ts` 中添加了以下配置：
   ```javascript
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     trailingSlash: true,
   };
   ```

2. 在 `package.json` 中添加了导出脚本：
   ```json
   "scripts": {
     "export": "next build"
   }
   ```

## 部署步骤

1. 运行构建命令：
   ```bash
   npm run build
   ```

2. 构建完成后，静态文件将生成在 `out` 目录中

3. 将 `out` 目录中的所有文件部署到您的静态托管服务（如Vercel、Netlify、GitHub Pages等）

## 重要说明

- 使用 `output: 'export'` 配置后，Next.js会生成完全静态的HTML、CSS和JavaScript文件
- `images.unoptimized: true` 确保图片不会被Next.js优化处理，因为静态导出不支持图片优化
- `trailingSlash: true` 确保路由正确处理

现在重新部署应该可以正常工作，不会再出现JS和CSS文件显示为HTML内容的问题。