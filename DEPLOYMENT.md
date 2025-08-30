# 部署说明

为了解决部署后JS和CSS文件显示为HTML内容的问题，我们已经修复了配置。

## Vercel部署（推荐）

对于Vercel部署，我们移除了静态导出配置，让Vercel处理服务端渲染：

1. 在 `next.config.ts` 中配置：
   ```javascript
   const nextConfig: NextConfig = {
     images: {
       unoptimized: true,
     },
   };
   ```

2. Vercel会自动检测Next.js项目并正确处理构建和路由

3. 确保 `vercel.json` 只包含版本信息：
   ```json
   {
     "version": 2
   }
   ```

## 静态部署（备选方案）

如果您需要静态部署到其他平台，请重新启用静态导出配置：

1. 在 `next.config.ts` 中添加以下配置：
   ```javascript
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     trailingSlash: true,
   };
   ```

2. 部署步骤：
   - 运行构建命令：`npm run build`
   - 构建完成后，静态文件将生成在 `out` 目录中
   - 将 `out` 目录中的所有文件部署到您的静态托管服务

## 问题解决

通过移除错误的路由配置和解决静态导出与Vercel部署的冲突，现在重新部署应该可以正常工作，不会再出现JS和CSS文件显示为HTML内容的问题。