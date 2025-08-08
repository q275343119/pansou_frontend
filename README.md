# 盘搜前端 (Pansou Frontend)

一个基于React和Semi Design的网盘资源搜索前端应用，提供美观的用户界面和强大的搜索功能。

## ✨ 功能特性

- 🔍 **智能搜索**: 支持关键词搜索，快速找到网盘资源
- 🎨 **现代化UI**: 基于字节跳动Semi Design，界面美观现代
- 🌓 **主题切换**: 支持深色/浅色主题切换
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🔗 **一键复制**: 支持链接和密码一键复制
- 📊 **结果分组**: 按网盘类型智能分组显示结果
- ⚡ **实时搜索**: 快速响应，实时显示搜索结果

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: [Semi Design](https://semi.design/) (字节跳动)
- **构建工具**: Vite
- **状态管理**: React Context
- **HTTP客户端**: Fetch API
- **主题管理**: 本地存储 + Context API

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
VITE_API_BASE_URL=https://pansou.oneplus1.top
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

### API配置

项目支持通过环境变量配置API地址：

- `VITE_API_BASE_URL`: API基础地址（默认: https://pansou.oneplus1.top）
- `VITE_APP_NAME`: 应用名称（默认: 盘搜）
- `VITE_APP_VERSION`: 应用版本（默认: 1.0.0）

### 搜索参数

支持以下搜索参数：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| kw | string | 是 | 搜索关键词 |
| channels | string[] | 否 | 搜索频道 |
| conc | number | 否 | 并发数 |
| refresh | boolean | 否 | 是否刷新缓存 |
| res | string | 否 | 结果类型：all/results/merge |
| src | string | 否 | 数据来源：all/tg/plugin |
| plugins | string[] | 否 | 指定插件 |
| cloud_types | string[] | 否 | 指定网盘类型 |
| ext | object | 否 | 扩展参数 |

## 🔌 API接口

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

检查API服务状态。

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
- 支持手动切换主题
- 主题设置持久化存储
- 基于Semi Design主题系统

## 📱 支持的网盘类型

- 百度网盘
- 阿里云盘
- 夸克网盘
- 天翼云盘
- UC网盘
- 移动云盘
- 115网盘
- PikPak
- 迅雷网盘
- 123云盘
- 磁力链接
- 电驴链接

## 🚀 部署指南

### 静态部署

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 目录部署到Web服务器

### Docker部署

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

- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 组件使用函数式组件 + Hooks
- 使用Semi Design组件库

### 添加新功能

1. 在 `src/components/` 下创建新组件
2. 在 `src/types/` 下定义相关类型
3. 在 `src/services/` 下添加API调用
4. 更新相关文档

### 调试技巧

- 使用浏览器开发者工具查看网络请求
- 查看控制台日志了解API响应
- 使用React DevTools调试组件状态

## 📄 许可证

MIT License

## 🙏 致谢

- [Semi Design](https://semi.design/) - 优秀的React UI组件库
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [React](https://reactjs.org/) - 用户界面库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交Issue
- 发送邮件
- 参与讨论

---

**盘搜前端** - 让网盘搜索更简单、更美观 