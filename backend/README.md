# 秦腔文化科普网站 - 后端服务

## 概述

本目录包含秦腔文化科普网站的后端服务代码。项目采用 **Jamstack 架构**，后端提供两个核心功能：

1. **静态文件服务**：托管前端 Astro 构建生成的 HTML/CSS/JS/图片等静态资源
2. **数据 API 接口**：读取本地 JSON 数据文件，通过 RESTful API 返回结构化数据（供开发调试使用）

> **注意**：生产环境通过 GitHub Actions 自动部署到 GitHub Pages，无需运行此后端服务。后端服务主要用于本地开发预览和 Docker 独立部署场景。

---

## 快速开始

### 环境要求

- Node.js >= 18.0
- npm >= 9.0

### 安装依赖

```bash
cd backend
npm install
```

### 开发模式（热重载）

```bash
npm run dev
```

服务启动后访问 http://localhost:3000

### 生产构建

```bash
npm run build
npm start
```

---

## API 接口文档

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查，返回服务运行状态 |
| GET | `/api/data/history` | 获取秦腔历史事件列表 |
| GET | `/api/data/roles` | 获取行当分类（生旦净丑）列表 |
| GET | `/api/data/costumes-makeup` | 获取脸谱服饰图鉴列表 |
| GET | `/api/data/artists-plays` | 获取名家与经典剧目列表 |
| GET | `/api/data/media` | 获取视听资源列表 |
| GET | `/api/data/all` | 获取全部数据汇总 |

### 响应格式

```json
{
  "success": true,
  "data": [...],
  "count": 6,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Docker 部署

### 构建并运行

```bash
# 先构建前端
cd frontend && npm install && npm run build && cd ..

# 使用 Docker Compose 启动
cd backend
docker-compose up -d --build
```

### 手动 Docker 构建运行

```bash
# 构建镜像
docker build -t qinqiang-backend .

# 运行容器
docker run -d \
  --name qinqiang-server \
  -p 3000:3000 \
  -v $(pwd)/../frontend/dist:/app/frontend/dist:ro \
  -v $(pwd)/../frontend/public/assets/data:/app/frontend/public/assets/data:ro \
  qinqiang-backend
```

---

## GitHub Pages 部署

项目已配置 GitHub Actions 自动部署工作流：

1. 当代码推送到 `main` 分支时自动触发
2. 自动执行前端 Astro 项目构建
3. 将构建产物部署到 GitHub Pages

### 配置步骤

1. 在 GitHub 仓库设置中启用 GitHub Pages
2. Source 选择 **GitHub Actions**
3. 推送代码到 `main` 分支即可自动部署

---

## 目录结构

```
backend/
├── .github/workflows/deploy.yml   # CI/CD 自动部署配置
├── src/
│   ├── config/index.ts            # 服务配置
│   ├── controllers/               # 控制器
│   │   ├── dataController.ts      # 数据API控制器
│   │   └── healthController.ts    # 健康检查控制器
│   ├── middleware/                 # 中间件
│   │   ├── cors.ts                # CORS跨域
│   │   ├── errorHandler.ts        # 错误处理
│   │   └── logger.ts              # 请求日志
│   ├── routes/api.ts              # API路由定义
│   ├── services/dataService.ts    # 数据服务层
│   └── index.ts                   # 入口文件
├── Dockerfile                      # Docker镜像构建
├── docker-compose.yml              # Docker编排配置
├── tsconfig.json                   # TypeScript配置
├── package.json                    # 依赖声明
└── README.md                       # 本文档
```
