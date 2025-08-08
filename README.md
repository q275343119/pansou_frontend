# 盘搜前端 (Pansou Frontend)

一个基于 React 和 Ant Design 的网盘资源搜索前端应用，提供美观的用户界面和强大的搜索功能。

搜索服务由 https://github.com/fish2018/pansou 提供

## ✨ 功能特性

- 🔍 **智能搜索**: 支持关键词搜索，快速找到网盘资源
- 🎨 **现代化 UI**: 基于 Ant Design，界面简洁美观
- 🌓 **主题切换**: 支持深色/浅色主题切换，右上角快速切换
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🔗 **一键复制**: 支持链接和密码一键复制
- 📊 **结果分组**: 按网盘类型智能分组显示结果
- ⚡ **实时搜索**: 快速响应，实时显示搜索结果
- 🎯 **高级搜索**: 支持网盘类型筛选、数据来源选择等

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: [Ant Design](https://ant.design/) (蚂蚁集团)
- **构建工具**: Vite
- **状态管理**: React Context API
- **HTTP 客户端**: Fetch API
- **主题管理**: 本地存储 + Context API + Ant Design 主题系统

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

创建 `.env` 文件（可选）：

```env
# API配置
VITE_API_BASE_URL=http://127.0.0.1:8888
VITE_APP_NAME=盘搜
VITE_APP_VERSION=1.0.0
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📁 项目结构

```
pansou_frontend/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React组件
│   │   ├── SearchForm/    # 搜索表单组件
│   │   ├── SearchResults/ # 搜索结果组件
│   │   └── ThemeToggle/   # 主题切换组件
│   ├── contexts/          # React Context
│   │   └── ThemeContext.tsx
│   ├── services/          # API服务
│   │   └── api.ts
│   ├── types/             # TypeScript类型定义
│   │   └── index.ts
│   ├── config/            # 配置文件
│   │   └── index.ts
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## ⚙️ 配置说明

### API 配置

项目支持通过环境变量配置 API 地址：

- `VITE_API_BASE_URL`: API 基础地址（默认: https://pansou.oneplus1.top）
- `VITE_APP_NAME`: 应用名称（默认: 盘搜）
- `VITE_APP_VERSION`: 应用版本（默认: 1.0.0）

### 搜索参数

支持以下搜索参数：

| 参数        | 类型     | 必填 | 说明                        |
| ----------- | -------- | ---- | --------------------------- |
| kw          | string   | 是   | 搜索关键词                  |
| refresh     | boolean  | 否   | 是否刷新缓存                |
| res         | string   | 否   | 结果类型：all/results/merge |
| src         | string   | 否   | 数据来源：all/tg/plugin     |
| cloud_types | string[] | 否   | 指定网盘类型                |

## 🔌 API 接口

### 搜索接口

**GET** `/api/search`

搜索网盘资源，支持多种参数组合。

**响应格式**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 350,
    "merged_by_type": {
      "baidu": [...],
      "aliyun": [...],
      "quark": [...]
    }
  }
}
```

### 健康检查接口

**GET** `/api/health`

检查 API 服务状态。

**响应格式**:

```json
{
  "channels": ["tgsearchers2", "SharePanBaidu"],
  "plugin_count": 20,
  "plugins": ["hdr4k", "labi"],
  "plugins_enabled": true,
  "status": "ok"
}
```

## 🎨 主题系统

应用支持深色和浅色主题切换：

- 自动检测系统主题偏好
- 支持手动切换主题（右上角按钮）
- 主题设置持久化存储
- 基于 Ant Design 主题系统
- 自定义蓝色主题色 (`#1890ff`)

## 📱 支持的网盘类型

- 百度网盘
- 阿里云盘
- 夸克网盘
- 天翼云盘
- UC 网盘
- 移动云盘
- 115 网盘
- PikPak
- 迅雷网盘
- 123 云盘
- 磁力链接
- 电驴链接

## 🚀 部署指南

### 静态部署

1. 构建项目：

```bash
npm run build
```

2. 将 `dist` 目录部署到 Web 服务器

### Docker 部署

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 环境变量配置

生产环境建议配置以下环境变量：

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=盘搜
VITE_APP_VERSION=1.0.0
```

## 🤝 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 使用 Ant Design 组件库

### 添加新功能

1. 在 `src/components/` 下创建新组件
2. 在 `src/types/` 下定义相关类型
3. 在 `src/services/` 下添加 API 调用
4. 更新相关文档

### 调试技巧

- 使用浏览器开发者工具查看网络请求
- 查看控制台日志了解 API 响应
- 使用 React DevTools 调试组件状态

## 📋 更新日志

### v2.0.0 (2024-01-XX) - 重大更新

#### 🎨 UI 框架迁移

- **从 Semi Design 迁移到 Ant Design**
- 更稳定的组件库，更好的社区支持
- 统一的蓝色主题色 (`#1890ff`)

#### 🎯 界面优化

- **移除顶部 Header**：界面更加简洁
- **主题切换按钮**：移至右上角固定位置
- **搜索框优化**：移除悬停时的颜色变化
- **按钮颜色**：从红色改为蓝色，更加协调

#### 🔧 技术改进

- **主题系统重构**：基于 Ant Design 的 ConfigProvider
- **组件重构**：所有组件迁移到 Ant Design
- **样式优化**：移除不必要的动画和过渡效果
- **错误修复**：解决 React key 警告和组件渲染问题

#### 🐛 问题修复

- 修复主题切换不生效的问题
- 解决组件重叠和样式冲突
- 移除所有红色边框和轮廓
- 优化搜索框交互体验

### v1.0.0 (初始版本)

- 基于 Semi Design 的初始版本
- 基础搜索功能
- 主题切换功能

## 📄 许可证

MIT License

## 🙏 致谢

- [Ant Design](https://ant.design/) - 优秀的 React UI 组件库
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [React](https://reactjs.org/) - 用户界面库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 参与讨论

---

**盘搜前端** - 让网盘搜索更简单、更美观
