/**
 * Tailwind CSS 配置文件
 * 定义国潮主题色系、自定义字体、扩展间距等设计令牌
 */

/** @type {import('tailwind').Config} */
export default {
  // 内容扫描路径
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  theme: {
    extend: {
      // 国潮主题色系
      colors: {
        // 中国红系列
        'china-red': {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#C41A1A', // 主红色
          600: '#A31515',
          700: '#7F1D1D',
          800: '#5C1010',
          900: '#3B0808',
        },
        // 墨黑系列
        'ink': {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#D4D4D4',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#2A2A2A',
          800: '#1A1A1A', // 主墨黑
          900: '#0D0D0D',
        },
        // 金色系列
        'gold': {
          50: '#FDF8E8',
          100: '#F9EFC5',
          200: '#F3E19B',
          300: '#EBCF6A',
          400: '#E4BC42',
          500: '#D4A843', // 主金色
          600: '#B8912F',
          700: '#937624',
          800: '#6E5A1B',
          900: '#4A3D12',
        },
        // 宣纸白系列
        'rice-paper': {
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F0E8', // 主宣纸白
          300: '#EDE5D6',
          400: '#E0D3BE',
          500: '#C9B899',
          600: '#A89570',
        },
      },

      // 自定义字体
      fontFamily: {
        'display': ['"ZCOOL XiaoWei"', '"STKaiti"', '"KaiTi"', 'serif'],
        'body': ['"Noto Serif SC"', '"STSong"', '"SimSun"', 'serif'],
        'sans': ['"Noto Sans SC"', '"Microsoft YaHei"', 'sans-serif'],
      },

      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
          '26': '6.5rem',
        '30': '7.5rem',
      },

      // 自定义断点
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // 动画关键帧
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      // 自定义背景图片
      backgroundImage: {
        'hero-pattern': "url('/assets/images/patterns/cloud-pattern.svg')",
      },
    },
  },

  plugins: [],
};
