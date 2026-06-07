/**
 * Astro 框架核心配置文件
 * 定义 Vue 集成、Tailwind CSS、站点 URL、构建输出目录等
 */
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // 集成 Vue 3 组件支持
  integrations: [
    vue(),
    tailwind(),
  ],

  // 站点 URL
  site: 'https://leisurehuang.github.io',

  // GitHub Pages 子路径
  base: '/ai-project-cmpt4nay',

  // 输出模式：纯静态 HTML（无需服务端渲染）
  output: 'static',

  // 构建输出目录
  outDir: 'dist',

  // 全局 Vue 配置
  vite: {
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },
});
