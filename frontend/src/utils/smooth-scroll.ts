/**
 * 平滑滚动工具
 * 封装原生 scrollTo 和 scrollIntoView 行为
 * 处理导航栏高度偏移，支持缓动动画
 */

/** 导航栏高度（与 CSS 变量 --nav-height 保持同步） */
const NAV_HEIGHT = 64;

/** 额外的滚动偏移量（给板块标题留出呼吸空间） */
const SCROLL_OFFSET = 16;

/**
 * 平滑滚动到页面指定锚点
 * @param anchorId - 目标元素的 ID（不含 # 前缀）
 * @param behavior - 滚动行为
 */
export function scrollToAnchor(
  anchorId: string,
  behavior: ScrollBehavior = 'smooth'
): void {
  const target = document.getElementById(anchorId);
  if (!target) {
    console.warn(`滚动目标未找到: #${anchorId}`);
    return;
  }

  // 计算目标位置（减去导航栏高度和偏移）
  const targetPosition =
    target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - SCROLL_OFFSET;

  window.scrollTo({
    top: targetPosition,
    behavior,
  });
}

/**
 * 滚动到页面顶部
 * @param behavior - 滚动行为
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({
    top: 0,
    behavior,
  });
}

/**
 * 判断元素是否在视口内
 * @param element - 目标 DOM 元素
 * @param offset - 额外偏移量
 */
export function isInViewport(element: Element, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 获取当前滚动位置对应的活跃导航项 ID
 * @param sectionIds - 所有板块的 ID 列表
 * @returns 当前活跃的板块 ID
 */
export function getActiveSection(sectionIds: string[]): string {
  const scrollPosition = window.scrollY + NAV_HEIGHT + SCROLL_OFFSET + 100;

  // 从后往前遍历，找到第一个顶部位置小于滚动位置的板块
  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const section = document.getElementById(sectionIds[i]);
    if (section && section.offsetTop <= scrollPosition) {
      return sectionIds[i];
    }
  }

  // 默认返回第一个板块
  return sectionIds[0] || '';
}

export default {
  scrollToAnchor,
  scrollToTop,
  isInViewport,
  getActiveSection,
};
