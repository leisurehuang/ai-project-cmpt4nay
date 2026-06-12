/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * Astro 环境类型声明文件
 * 确保 TypeScript 正确识别 .astro 文件和 Astro 全局对象
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
  const Component: AstroComponentFactory;
  export default Component;
}
