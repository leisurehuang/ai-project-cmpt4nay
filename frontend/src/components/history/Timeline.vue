<template>
  <div class="timeline-container relative" ref="containerRef">
    <!-- 中轴线（仅桌面端显示） -->
    <div
      class="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-300 transform -translate-x-1/2"
    ></div>

    <!-- 移动端左侧线 -->
    <div
      class="md:hidden absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-300"
    ></div>

    <!-- 时间轴事件列表 -->
    <div class="space-y-8 md:space-y-12">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="timeline-item relative"
        :class="[
          index % 2 === 0 ? 'md:pr-[52%]' : 'md:pl-[52%]',
          isVisible(index) ? 'opacity-100' : 'opacity-0'
        ]"
        :style="{
          transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay: `${index * 0.1}s`,
          transform: isVisible(index)
            ? 'translateY(0)'
            : index % 2 === 0
              ? 'translateX(-30px)'
              : 'translateX(30px)',
        }"
        ref="itemRefs"
      >
        <!-- 移动端：左侧圆点 -->
        <div
          class="md:hidden absolute left-5 top-4 w-3 h-3 rounded-full bg-gold-500 border-2 border-rice-paper-200 transform -translate-x-1/2 z-10"
        ></div>

        <!-- 桌面端：中轴线圆点 -->
        <div
          class="hidden md:flex absolute left-1/2 top-6 w-4 h-4 rounded-full bg-china-red-500 border-4 border-gold-300 transform -translate-x-1/2 z-10 items-center justify-center"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>

        <!-- 卡片内容 -->
        <div class="ml-12 md:ml-0">
          <div class="card p-5 md:p-6 group">
            <!-- 年份标签 -->
            <div class="flex items-center gap-3 mb-3">
              <span class="inline-block px-3 py-1 bg-china-red-500/10 text-china-red-500 text-sm font-bold rounded-full">
                {{ item.year }}
              </span>
            </div>

            <!-- 标题 -->
            <h3 class="font-display text-xl md:text-2xl text-ink-800 mb-3 group-hover:text-china-red-500 transition-colors">
              {{ item.title }}
            </h3>

            <!-- 描述 -->
            <p class="text-ink-500 text-sm md:text-base leading-relaxed">
              {{ item.description }}
            </p>

            <!-- 配图 -->
            <div v-if="item.imageUrl" class="mt-4 rounded-lg overflow-hidden">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

/** 历史事件项类型 */
interface HistoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}

/** 组件属性 */
const props = defineProps<{
  items: HistoryItem[];
}>();

/** 可见项集合 */
const visibleSet = ref(new Set<number>());

/** 元素引用数组 */
const itemRefs = ref<HTMLElement[]>([]);

/** 容器引用 */
const containerRef = ref<HTMLElement | null>(null);

/** 观察者实例 */
let observer: IntersectionObserver | null = null;

/** 判断某项是否可见 */
function isVisible(index: number): boolean {
  return visibleSet.value.has(index);
}

onMounted(() => {
  // 创建 IntersectionObserver 监听每个时间轴项
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = itemRefs.value.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            visibleSet.value.add(index);
            // 触发响应式更新
            visibleSet.value = new Set(visibleSet.value);
          }
          // 一次性观察，触发后取消
          observer?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px',
    }
  );

  // 观察每个时间轴项
  itemRefs.value.forEach((el) => {
    if (el) observer?.observe(el);
  });
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
