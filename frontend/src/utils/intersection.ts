/**
 * IntersectionObserver 封装工具
 * 提供创建观察者的工厂函数，用于图片懒加载和滚动动画触发
 * 支持自定义阈值、回调、一次性观察等
 */

/** 观察者配置选项 */
export interface ObserverOptions {
  /** 观察阈值（0-1），触发回调的可见比例 */
  threshold?: number | number[];
  /** 根元素边距，用于提前/延迟触发 */
  rootMargin?: string;
  /** 是否只触发一次 */
  once?: boolean;
  /** 根元素，默认为浏览器视口 */
  root?: Element | null;
}

/** 观察回调函数类型 */
export type ObserverCallback = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;

/** 已创建的观察者实例缓存 */
const observerCache = new Map<string, IntersectionObserver>();

/**
 * 创建或获取缓存的 IntersectionObserver
 * @param name - 观察者名称（用于缓存复用）
 * @param callback - 元素进入视口时的回调
 * @param options - 观察配置
 * @returns IntersectionObserver 实例
 */
export function createObserver(
  name: string,
  callback: ObserverCallback,
  options: ObserverOptions = {}
): IntersectionObserver {
  // 检查缓存
  if (observerCache.has(name)) {
    return observerCache.get(name)!;
  }

  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true, root = null } = options;

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry, obs);
          // 如果设置为一次性观察，触发后取消观察
          if (once) {
            obs.unobserve(entry.target);
          }
        }
      });
    },
    {
      threshold,
      rootMargin,
      root,
    }
  );

  // 缓存观察者
  observerCache.set(name, observer);
  return observer;
}

/**
 * 观察指定元素
 * @param element - 要观察的 DOM 元素
 * @param callback - 进入视口时的回调
 * @param options - 观察配置
 * @param name - 观察者名称
 */
export function observeElement(
  element: Element,
  callback: ObserverCallback,
  options: ObserverOptions = {},
  name = 'default'
): void {
  const observer = createObserver(name, callback, options);
  observer.observe(element);
}

/**
 * 为元素添加滚动渐入动画
 * @param selector - CSS 选择器或元素
 * @param animationClass - 触发后添加的 CSS 类名
 * @param options - 观察配置
 */
export function addScrollAnimation(
  selector: string | Element | NodeListOf<Element>,
  animationClass = 'animate-visible',
  options: ObserverOptions = {}
): void {
  const elements =
    typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector instanceof NodeList
        ? selector
        : [selector];

  elements.forEach((el) => {
    // 初始隐藏
    el.classList.add('animate-hidden');
    observeElement(
      el,
      (entry) => {
        entry.target.classList.add(animationClass);
        entry.target.classList.remove('animate-hidden');
      },
      options,
      `scroll-anim-${animationClass}`
    );
  });
}

/**
 * 断开并清理所有观察者
 */
export function disconnectAll(): void {
  observerCache.forEach((observer) => observer.disconnect());
  observerCache.clear();
}

export default {
  createObserver,
  observeElement,
  addScrollAnimation,
  disconnectAll,
};
