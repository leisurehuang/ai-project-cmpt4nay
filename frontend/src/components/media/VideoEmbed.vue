<template>
  <div class="video-embed-wrapper relative" ref="wrapperRef">
    <!-- Aspect ratio container -->
    <div class="aspect-video rounded-lg overflow-hidden bg-ink-900">
      <iframe
        ref="iframeRef"
        :data-src="url"
        :title="`${title} - 秦腔视频播放器`"
        class="w-full h-full border-0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-popups"
      ></iframe>
    </div>

    <!-- Cover overlay shown until IntersectionObserver triggers loading -->
    <div
      v-if="!isLoaded"
      class="absolute inset-0 rounded-lg overflow-hidden cursor-pointer group"
      @click="loadVideo"
    >
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        decoding="async"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center"
      >
        <svg
          class="w-16 h-16 text-rice-paper-400/30"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
          />
        </svg>
      </div>

      <!-- Play button -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-china-red-500/90 flex items-center justify-center shadow-lg shadow-china-red-500/30 group-hover:scale-110 group-hover:bg-china-red-500 transition-all duration-300"
        >
          <svg
            class="w-7 h-7 md:w-8 md:h-8 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <!-- Title overlay -->
      <div
        class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4"
      >
        <p class="text-white text-sm font-body line-clamp-1">{{ title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { observeElement } from '@/utils/intersection';

/** 组件属性定义 */
interface Props {
  /** 视频 URL（Bilibili 嵌入地址） */
  url: string;
  /** 视频标题 */
  title: string;
  /** 视频描述 */
  description?: string;
  /** 封面图 URL */
  coverUrl?: string;
  /** 视频 ID */
  id: string;
}

const props = defineProps<Props>();

/** iframe DOM 引用 */
const iframeRef = ref<HTMLIFrameElement | null>(null);
/** 容器 DOM 引用 */
const wrapperRef = ref<HTMLElement | null>(null);
/** 是否已加载 iframe src */
const isLoaded = ref(false);

/**
 * 将 data-src 赋值给 src，触发 iframe 实际加载
 * 仅在元素可见时调用，实现懒加载
 */
function loadVideo(): void {
  if (isLoaded.value) return;

  const iframe = iframeRef.value;
  if (iframe && iframe.dataset.src) {
    iframe.src = iframe.dataset.src;
    isLoaded.value = true;
  }
}

onMounted(() => {
  if (wrapperRef.value) {
    observeElement(
      wrapperRef.value,
      () => {
        // 元素进入视口，懒加载 iframe
        loadVideo();
      },
      {
        threshold: 0.1,
        rootMargin: '100px 0px',
        once: true,
      },
      `video-embed-${props.id}`
    );
  }
});
</script>
