<template>
  <div class="gallery-app">
    <!-- 分类筛选按钮 -->
    <div class="flex justify-center gap-3 md:gap-4 mb-8 md:mb-12 flex-wrap">
      <button
        v-for="cat in categories"
        :key="cat.value"
        @click="activeCategory = cat.value"
        :class="[
          'px-5 py-2.5 rounded-full text-sm md:text-base font-body font-medium transition-all duration-300',
          activeCategory === cat.value
            ? 'bg-china-red-500 text-white shadow-md shadow-china-red-500/30 scale-105'
            : 'bg-white text-ink-600 border border-rice-paper-400 hover:border-china-red-300 hover:text-china-red-500'
        ]"
        :aria-pressed="activeCategory === cat.value"
      >
        {{ cat.label }}
        <span class="ml-1 text-xs opacity-70">({{ cat.count }})</span>
      </button>
    </div>

    <!-- 画廊网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      <transition-group name="gallery-fade">
        <div
          v-for="(item, index) in filteredItems"
          :key="item.id"
          class="gallery-item group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
          :style="{ transitionDelay: `${index * 0.05}s` }"
          @click="openLightbox(item)"
          role="button"
          :aria-label="`查看: ${item.title}`"
          tabindex="0"
          @keydown.enter="openLightbox(item)"
          @keydown.space.prevent="openLightbox(item)"
        >
          <!-- 图片 -->
          <div class="aspect-[3/4] overflow-hidden bg-rice-paper-300">
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
          </div>

          <!-- 分类标签 -->
          <span
            :class="[
              'absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium',
              item.category === '脸谱'
                ? 'bg-china-red-500/90 text-white'
                : 'bg-gold-500/90 text-white'
            ]"
          >
            {{ item.category }}
          </span>

          <!-- 底部信息遮罩 -->
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                      p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h4 class="font-display text-lg text-white mb-1">{{ item.title }}</h4>
            <p v-if="item.colorMeaning" class="text-rice-paper-300 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {{ item.colorMeaning }}
            </p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- 灯箱组件 -->
    <Teleport to="body">
      <transition name="lightbox">
        <div
          v-if="lightboxItem"
          class="fixed inset-0 z-[100] flex items-center justify-center"
          @click.self="closeLightbox"
          @keydown.escape="closeLightbox"
        >
          <!-- 背景遮罩 -->
          <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" @click="closeLightbox"></div>

          <!-- 灯箱内容 -->
          <div class="relative z-10 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col md:flex-row bg-rice-paper-50 rounded-lg overflow-hidden shadow-2xl">
            <!-- 图片区域 -->
            <div class="md:w-3/5 bg-black flex items-center justify-center min-h-[250px] md:min-h-[400px]">
              <img
                :src="lightboxItem.imageUrl"
                :alt="lightboxItem.title"
                class="w-full h-full object-contain max-h-[60vh]"
              />
            </div>

            <!-- 信息面板 -->
            <div class="md:w-2/5 p-6 md:p-8 flex flex-col">
              <!-- 分类标签 -->
              <span
                :class="[
                  'self-start px-3 py-1 rounded-full text-xs font-medium mb-4',
                  lightboxItem.category === '脸谱'
                    ? 'bg-china-red-500/10 text-china-red-500'
                    : 'bg-gold-500/10 text-gold-700'
                ]"
              >
                {{ lightboxItem.category }}
              </span>

              <h3 class="font-display text-2xl md:text-3xl text-ink-800 mb-4">{{ lightboxItem.title }}</h3>

              <!-- 色彩含义 -->
              <div v-if="lightboxItem.colorMeaning" class="mb-6">
                <h4 class="font-body font-bold text-ink-600 text-sm mb-2">色彩寓意</h4>
                <p class="text-ink-500 text-sm leading-relaxed">{{ lightboxItem.colorMeaning }}</p>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-3 mt-auto">
                <button
                  v-if="hasPrev"
                  @click="prevItem"
                  class="flex-1 py-2.5 border border-rice-paper-400 rounded-lg text-sm text-ink-600
                         hover:border-china-red-300 hover:text-china-red-500 transition-colors"
                >
                  ← 上一个
                </button>
                <button
                  v-if="hasNext"
                  @click="nextItem"
                  class="flex-1 py-2.5 border border-rice-paper-400 rounded-lg text-sm text-ink-600
                         hover:border-china-red-300 hover:text-china-red-500 transition-colors"
                >
                  下一个 →
                </button>
              </div>
            </div>

            <!-- 关闭按钮 -->
            <button
              @click="closeLightbox"
              class="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center
                     hover:bg-black/70 transition-colors z-20"
              aria-label="关闭"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

/** 脸谱服饰项类型 */
interface GalleryItem {
  id: string;
  title: string;
  category: string;
  colorMeaning?: string;
  imageUrl: string;
}

/** 组件属性 */
const props = defineProps<{
  items: GalleryItem[];
}>();

/** 当前筛选分类 */
const activeCategory = ref('all');

/** 灯箱当前项 */
const lightboxItem = ref<GalleryItem | null>(null);

/** 分类选项 */
const categories = computed(() => [
  { value: 'all', label: '全部', count: props.items.length },
  { value: '脸谱', label: '脸谱', count: props.items.filter((i) => i.category === '脸谱').length },
  { value: '服饰', label: '服饰', count: props.items.filter((i) => i.category === '服饰').length },
]);

/** 筛选后的列表 */
const filteredItems = computed(() =>
  activeCategory.value === 'all'
    ? props.items
    : props.items.filter((i) => i.category === activeCategory.value)
);

/** 灯箱：是否有上一个 */
const hasPrev = computed(() => {
  if (!lightboxItem.value) return false;
  const idx = props.items.findIndex((i) => i.id === lightboxItem.value!.id);
  return idx > 0;
});

/** 灯箱：是否有下一个 */
const hasNext = computed(() => {
  if (!lightboxItem.value) return false;
  const idx = props.items.findIndex((i) => i.id === lightboxItem.value!.id);
  return idx < props.items.length - 1;
});

/** 打开灯箱 */
function openLightbox(item: GalleryItem): void {
  lightboxItem.value = item;
  document.body.classList.add('overflow-hidden');
}

/** 关闭灯箱 */
function closeLightbox(): void {
  lightboxItem.value = null;
  document.body.classList.remove('overflow-hidden');
}

/** 上一个 */
function prevItem(): void {
  if (!lightboxItem.value) return;
  const idx = props.items.findIndex((i) => i.id === lightboxItem.value!.id);
  if (idx > 0) {
    lightboxItem.value = props.items[idx - 1];
  }
}

/** 下一个 */
function nextItem(): void {
  if (!lightboxItem.value) return;
  const idx = props.items.findIndex((i) => i.id === lightboxItem.value!.id);
  if (idx < props.items.length - 1) {
    lightboxItem.value = props.items[idx + 1];
  }
}

/** 键盘事件处理 */
function handleKeydown(e: KeyboardEvent): void {
  if (!lightboxItem.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevItem();
  if (e.key === 'ArrowRight') nextItem();
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* 画廊渐入渐出过渡 */
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: all 0.4s ease;
}
.gallery-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.gallery-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 灯箱过渡 */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: all 0.3s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
