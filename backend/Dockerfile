# ============================================
# 秦腔文化科普网站 - 后端服务 Dockerfile
# 多阶段构建：构建 TypeScript + 运行服务
# ============================================

# 阶段1: 构建阶段 - 编译 TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装所有依赖（包含 devDependencies）
RUN npm install

# 复制源代码
COPY tsconfig.json ./
COPY src/ ./src/

# 编译 TypeScript
RUN npm run build

# 阶段2: 运行阶段 - 精简的生产镜像
FROM node:20-alpine AS runner

# 安装 dumb-init 用于正确处理信号
RUN apk add --no-cache dumb-init

# 创建非 root 用户
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# 复制依赖文件并仅安装生产依赖
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && \
    npm cache clean --force

# 从构建阶段复制编译产物
COPY --from=builder /app/dist ./dist

# 创建前端静态文件挂载点目录
RUN mkdir -p /app/frontend/dist /app/frontend/public

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 3000

# 环境变量默认值
ENV NODE_ENV=production \
    PORT=3000 \
    STATIC_DIR=/app/frontend/dist \
    DATA_DIR=/app/frontend/public/assets/data

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# 使用 dumb-init 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
