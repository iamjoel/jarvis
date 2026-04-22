# Better-T-Stack 各分类技术对比

> 来源：[better-t-stack.dev/new](https://www.better-t-stack.dev/new)（Better-T-Stack 可视化脚手架构建器）
>
> Better-T-Stack 是一个现代 TypeScript 全栈脚手架工具，支持端到端类型安全，允许你自由组合各层技术栈。本文对其每个分类下的技术选项进行优缺点和使用场景的对比。

```
pnpm create better-t-stack@latest {project-name} --frontend tanstack-router --backend hono --runtime workers --api trpc --auth none --payments none --database sqlite --orm drizzle --db-setup d1 --package-manager pnpm --no-git --web-deploy cloudflare --server-deploy cloudflare --no-install --addons turborepo --examples none
```

---

## 1. 前端框架（Frontend）

### React + TanStack Router

| 维度 | 说明 |
|------|------|
| **优点** | 类型安全路由、文件式路由、极佳的 TypeScript 支持；与 TanStack Query 天然配合；社区活跃 |
| **缺点** | 相比 React Router 更新，生态尚不及后者成熟；学习曲线略陡 |
| **适用场景** | 追求类型安全的中大型 SPA；需要复杂嵌套路由和数据预加载的项目 |

### React + React Router

| 维度 | 说明 |
|------|------|
| **优点** | 最成熟的 React 路由方案，文档完善，社区庞大；开发者熟悉度高 |
| **缺点** | 类型安全需额外配置；v6 API 变化较大，老项目迁移有成本 |
| **适用场景** | 熟悉 React 生态的团队；快速启动项目；与旧有 React 项目保持一致 |

### TanStack Start

| 维度 | 说明 |
|------|------|
| **优点** | 全栈框架，支持服务端渲染（SSR）；基于 TanStack Router，类型安全彻底；轻量且灵活 |
| **缺点** | 较新，生态和文档还在完善中；社区规模小于 Next.js |
| **适用场景** | 希望用 React + SSR 同时保持灵活性、不想被 Next.js 绑定的项目 |

### Next.js

| 维度 | 说明 |
|------|------|
| **优点** | 最成熟的 React 全栈框架；App Router 支持 React Server Components；SEO 友好；Vercel 部署一键完成；生态最丰富 |
| **缺点** | App Router 与传统模式差异大，学习曲线陡；框架较重；对 Vercel 有一定依赖；打包后体积较大 |
| **适用场景** | 内容网站、电商、营销页面等 SEO 敏感项目；需要快速上线的全栈应用；团队对 React 熟悉 |

### Nuxt

| 维度 | 说明 |
|------|------|
| **优点** | Vue 生态的全栈框架；约定优于配置；SSR/SSG/CSR 灵活切换；中文文档友好 |
| **缺点** | Vue 生态相对 React 略小；跨生态迁移成本高 |
| **适用场景** | Vue 技术栈团队；需要 SSR/SSG 的内容驱动型网站；中小型全栈应用 |

### SvelteKit

| 维度 | 说明 |
|------|------|
| **优点** | 编译时框架，无虚拟 DOM，运行时体积极小；响应式语法简洁优雅；性能出众 |
| **缺点** | 生态相对小（组件库、插件较少）；大型团队和 TypeScript 集成不如 React 成熟 |
| **适用场景** | 性能敏感的小型应用；个人项目或初创产品；追求简洁语法的开发者 |

### Solid

| 维度 | 说明 |
|------|------|
| **优点** | 细粒度响应式系统，性能极高（接近原生 DOM）；无虚拟 DOM；API 类 React，迁移成本低 |
| **缺点** | 生态远小于 React；第三方组件库有限；社区规模较小 |
| **适用场景** | 对性能极致追求的应用；React 开发者想尝试新框架；实时数据更新密集的 UI |

### Astro

| 维度 | 说明 |
|------|------|
| **优点** | Islands 架构，默认零 JS；支持 React/Vue/Svelte 等任意框架混用；静态生成速度快；SEO 极佳 |
| **缺点** | 不适合交互复杂的 SPA；动态功能需结合其他框架；应用型场景支持有限 |
| **适用场景** | 博客、文档、营销页、内容站等以内容为主的场景；追求极致页面加载速度 |

### React Native（Bare / NativeWind / Unistyles）

| 维度 | 说明 |
|------|------|
| **优点** | 一套 React 代码跨 iOS/Android；Bare 模式灵活访问原生模块；NativeWind 用 Tailwind 样式写 Native；Unistyles 提供统一跨平台样式系统 |
| **缺点** | 性能弱于纯原生；开发体验比 Web 差；Bare 需要配置更多原生环境；生态碎片化 |
| **适用场景** | Web+移动端共用 React 技能的团队；MVP 快速验证移动端需求；跨平台应用 |

---

## 2. 后端框架（Backend）

### Hono

| 维度 | 说明 |
|------|------|
| **优点** | 超轻量（~14kb）；支持多运行时（Node/Bun/Cloudflare Workers/Deno）；类型安全的路由 API；性能极高 |
| **缺点** | 功能较少，需手动集成数据库、验证等中间件；生态不如 Express 丰富 |
| **适用场景** | 边缘计算/Cloudflare Workers 部署；微服务；追求性能和轻量的 API 服务 |

### Express

| 维度 | 说明 |
|------|------|
| **优点** | 最成熟的 Node.js 框架；文档和中间件生态最丰富；几乎所有问题都有现成解决方案 |
| **缺点** | 年代久远，设计理念老旧（无内置 TypeScript 支持）；性能不是最优；无原生类型安全 |
| **适用场景** | 已有 Express 经验的团队；老项目维护；需要大量第三方中间件的场景 |

### Fastify

| 维度 | 说明 |
|------|------|
| **优点** | 性能是 Express 的 2~3 倍；内置 JSON Schema 验证；TypeScript 支持好；插件体系完善 |
| **缺点** | 生态不如 Express；初学者学习曲线略高于 Express |
| **适用场景** | 性能要求较高的 REST API；需要 OpenAPI 文档自动生成；大流量 Node.js 后端 |

### Elysia

| 维度 | 说明 |
|------|------|
| **优点** | 专为 Bun 优化，速度极快；端到端类型推断；声明式 API 设计；内置验证和序列化 |
| **缺点** | 强依赖 Bun 运行时；生态较新，插件少；长期维护稳定性待观察 |
| **适用场景** | 使用 Bun 运行时的项目；需要极致性能的 API；喜欢声明式风格的开发者 |

### Convex

| 维度 | 说明 |
|------|------|
| **优点** | 实时数据库+后端一体化；全栈类型安全；内置订阅机制；零运维 |
| **缺点** | 厂商锁定严重；价格在规模较大时较高；自定义空间有限；非开源核心 |
| **适用场景** | 实时协作应用（如多人文档、聊天）；希望快速上线且不想维护后端基础设施 |

---

## 3. API 层（API Layer）

### tRPC

| 维度 | 说明 |
|------|------|
| **优点** | 无需生成代码，前后端共享 TypeScript 类型；开发体验极佳；与 React Query 深度集成 |
| **缺点** | 仅适用于 TypeScript 全栈；不能对外部客户端暴露标准 REST/GraphQL 接口；调试工具不如 REST/GraphQL 成熟 |
| **适用场景** | TypeScript 全栈项目；前后端由同一团队维护；无需对外开放 API 的内部系统 |

### oRPC

| 维度 | 说明 |
|------|------|
| **优点** | 兼容 OpenAPI 标准，可生成文档；同样具备端到端类型安全；支持多种传输协议 |
| **缺点** | 比 tRPC 更新，生态更小；文档和社区资源不如 tRPC 丰富 |
| **适用场景** | 需要暴露标准 REST API 同时保持类型安全；有文档生成需求；多端（含非 TS 客户端）场景 |

---

## 4. 运行时（Runtime）

### Bun

| 维度 | 说明 |
|------|------|
| **优点** | 速度极快（JS 执行、启动、安装依赖均快于 Node）；内置测试、打包、TypeScript 支持；API 兼容 Node |
| **缺点** | 相对较新，某些 Node.js 生态兼容性问题尚存；社区和文档成熟度不如 Node；Windows 支持仍在完善 |
| **适用场景** | 新项目追求性能和开发体验；CI 流水线提速；Elysia 框架默认选择 |

### Node.js

| 维度 | 说明 |
|------|------|
| **优点** | 最成熟稳定；npm 生态最丰富；几乎所有框架和库的第一支持目标；大量生产验证 |
| **缺点** | 启动速度和执行速度不如 Bun/Deno；原生不支持 TypeScript（需 ts-node/tsx 等工具） |
| **适用场景** | 企业级生产项目；需要依赖大量 npm 包；团队熟悉 Node 生态 |

### Cloudflare Workers

| 维度 | 说明 |
|------|------|
| **优点** | 边缘计算，全球低延迟；V8 隔离启动极快（无冷启动问题）；与 Cloudflare D1/KV/R2 深度集成；免费层慷慨 |
| **缺点** | 运行环境受限（不是标准 Node，缺少部分 API）；调试较复杂；有执行时间和内存限制 |
| **适用场景** | 全球分布式 API；边缘 SSR；对延迟极度敏感的场景；与 Cloudflare 基础设施深度集成的项目 |

---

## 5. 数据库（Database）

### SQLite

| 维度 | 说明 |
|------|------|
| **优点** | 零配置，嵌入式；部署极简（单文件数据库）；性能对读密集型应用很好；配合 Turso 可云化 |
| **缺点** | 不支持高并发写入；不适合需要多个进程/节点共享数据的场景；功能少于 PostgreSQL |
| **适用场景** | 本地开发、原型验证；单机应用、桌面应用（Tauri）；配合 Turso 做边缘数据库 |

### PostgreSQL

| 维度 | 说明 |
|------|------|
| **优点** | 功能最全面的开源关系型数据库；支持 JSON、全文搜索、扩展插件；社区极大；生产可靠性高 |
| **缺点** | 需要独立部署和维护；相比 SQLite 更重；本地开发需要安装服务 |
| **适用场景** | 大多数生产级 Web 应用；复杂查询和事务场景；需要扩展功能（如向量搜索 pgvector） |

### MySQL

| 维度 | 说明 |
|------|------|
| **优点** | 广泛使用，运维工具丰富；性能好；托管服务多（AWS RDS、PlanetScale 等） |
| **缺点** | 功能不及 PostgreSQL 丰富；部分 SQL 标准实现有差异；JSON 支持弱于 PostgreSQL |
| **适用场景** | 传统 Web 应用；对 MySQL 有历史积累的团队；PlanetScale 无服务器部署场景 |

### MongoDB

| 维度 | 说明 |
|------|------|
| **优点** | 灵活的文档模型，无需预定义 Schema；水平扩展容易；适合非结构化/半结构化数据 |
| **缺点** | 不支持事务（部分版本支持但性能差）；Join 操作复杂；数据一致性弱于关系型数据库 |
| **适用场景** | 内容管理、日志、实时分析、产品目录等文档型数据；快速迭代阶段 Schema 频繁变化的项目 |

---

## 6. ORM / 数据库访问层

### Drizzle ORM

| 维度 | 说明 |
|------|------|
| **优点** | 类 SQL 的 TypeScript API，学习成本低；类型安全彻底；体积轻量；性能接近原生 SQL；Drizzle Studio 可视化 |
| **缺点** | 相对较新，迁移功能不如 Prisma 成熟；关系型查询 API 略繁琐 |
| **适用场景** | 追求类型安全且熟悉 SQL 的开发者；轻量级项目；与 Turso/D1/Neon 等边缘数据库配合 |

### Prisma

| 维度 | 说明 |
|------|------|
| **优点** | 最成熟的 Node.js ORM；Schema 文件直观；自动迁移；Prisma Studio 可视化；文档优秀 |
| **缺点** | 查询引擎较重（二进制引擎）；复杂查询性能不如 Drizzle；打包体积大；边缘部署支持有限 |
| **适用场景** | 快速开发 CRUD 应用；团队对 ORM 偏好高于 SQL；需要丰富文档和社区支持 |

### Mongoose

| 维度 | 说明 |
|------|------|
| **优点** | MongoDB 的事实标准 ODM；Schema 定义清晰；中间件系统灵活；文档丰富 |
| **缺点** | 仅支持 MongoDB；TypeScript 类型推断不够完善；相比关系型 ORM 功能有限 |
| **适用场景** | 使用 MongoDB 的项目；需要 Schema 验证和生命周期钩子；MEAN/MERN 技术栈 |

---

## 7. 认证（Authentication）

### Better Auth

| 维度 | 说明 |
|------|------|
| **优点** | 开源自托管；TypeScript 原生设计，类型安全；支持多种 OAuth、邮箱、二因素验证；无厂商锁定；可扩展 |
| **缺点** | 需要自行维护；相比托管方案初始配置略多；生态尚在成长 |
| **适用场景** | 希望数据完全自控的项目；需要高度定制化认证流程；不想依赖付费第三方服务 |

### Clerk

| 维度 | 说明 |
|------|------|
| **优点** | 托管服务，5 分钟集成；UI 组件开箱即用；支持多种登录方式；文档极佳；免费层慷慨 |
| **缺点** | 厂商锁定；用户数据存储在第三方；规模大时费用较高；迁移成本高 |
| **适用场景** | 快速上线的 MVP 或 SaaS 产品；不想维护认证基础设施；对数据主权要求不高 |

---

## 8. 附加工具（Addons）

### Turborepo

| 维度 | 说明 |
|------|------|
| **优点** | 增量构建和缓存，Monorepo 构建速度快；配置简单；Vercel 官方支持 |
| **缺点** | 功能相对 Nx 较轻量，代码生成和分析能力弱；复杂 Monorepo 场景支持不如 Nx |
| **适用场景** | 中小型 Monorepo；前后端共用代码的全栈项目；与 Vercel 部署集成 |

### Nx

| 维度 | 说明 |
|------|------|
| **优点** | 功能强大（代码生成、依赖图分析、任务编排）；支持多语言；企业级 Monorepo 首选 |
| **缺点** | 配置复杂，学习曲线陡；较重，小项目引入成本高 |
| **适用场景** | 大型企业 Monorepo；多团队协作；需要精细化任务依赖管理和代码生成的项目 |

### Tauri

| 维度 | 说明 |
|------|------|
| **优点** | Rust + WebView，应用体积极小（比 Electron 小 90%+）；性能好；内存占用低；安全性强 |
| **缺点** | 需要 Rust 知识处理原生功能；WebView 渲染一致性因系统而异；生态不如 Electron 成熟 |
| **适用场景** | 追求轻量跨平台桌面应用；对应用包体积和内存敏感；有 Rust 经验的团队 |

### Electrobun

| 维度 | 说明 |
|------|------|
| **优点** | 基于 Bun 的桌面应用框架；利用 Bun 的速度优势；TypeScript 原生支持 |
| **缺点** | 极新，生态几乎为零；长期维护不确定；不适合生产环境 |
| **适用场景** | 尝鲜 Bun 生态；构建轻量桌面工具；个人或实验性项目 |

### Biome

| 维度 | 说明 |
|------|------|
| **优点** | Rust 编写，速度比 ESLint+Prettier 快 25 倍以上；一体化 lint+format；零配置即可用 |
| **缺点** | 不兼容所有 ESLint 插件；部分规则与 ESLint 有差异；生态迁移需要适应期 |
| **适用场景** | 新项目追求极速 lint/format；不需要大量自定义 ESLint 规则；Bun 生态首选 |

### Lefthook / Husky

| 维度 | 说明 |
|------|------|
| **优点** | Git Hooks 管理工具，确保代码提交前自动 lint/test；Lefthook 用 Go 编写更快；Husky 更成熟普及 |
| **缺点** | 需要团队成员统一安装；钩子被跳过（`--no-verify`）时无法强制执行 |
| **适用场景** | 团队协作项目；希望在提交前自动检查代码质量；CI 前置本地检查 |

### Starlight / Fumadocs

| 维度 | 说明 |
|------|------|
| **优点** | Starlight 基于 Astro，性能极佳，开箱即用文档站；Fumadocs 基于 Next.js，与 React 生态无缝 |
| **缺点** | Starlight 不适合需要大量交互的文档站；Fumadocs 相对 Starlight 配置更多 |
| **适用场景** | Starlight：技术文档站、开源项目文档；Fumadocs：Next.js 项目的文档站，需要高度定制 |

---

## 9. 数据库托管服务（DB Hosting）

| 服务 | 数据库 | 优点 | 缺点 | 适用场景 |
|------|--------|------|------|----------|
| **Turso** | SQLite | 边缘 SQLite，低延迟；免费层慷慨；与 Drizzle 配合极好 | 写入性能有限；功能不如 PostgreSQL 丰富 | 边缘计算场景；全球低延迟读取；个人/小型项目 |
| **Neon** | PostgreSQL | Serverless PostgreSQL；冷启动快；分支功能方便开发测试；免费层 | 连接管理需要注意（需连接池） | Serverless 部署；需要按需伸缩的 PostgreSQL |
| **Supabase** | PostgreSQL | 开源；内置 Auth/Storage/Realtime；DX 好；自托管可选 | 规模大后费用增长快；部分功能不如专项服务深 | 快速构建全栈应用；需要一体化后端平台；Firebase 替代 |
| **MongoDB Atlas** | MongoDB | 全托管；多云支持；内置全文搜索/向量搜索；全球分布 | 价格较高；厂商锁定 | MongoDB 用户的云托管首选；需要向量搜索 |
| **Cloudflare D1** | SQLite | 与 Workers 零延迟集成；免费层；全球分布 | SQLite 限制；写入性能低；功能受限 | Cloudflare Workers 项目；边缘数据库 |
| **Docker** | 任意 | 本地开发一致性；无网络依赖；完全自控 | 需要 Docker 环境；生产部署需额外运维 | 本地开发和测试；自托管部署 |

---

## 选择建议

### 最小化 MVP 快速上线
推荐：**Next.js + Hono + Bun + SQLite (Turso) + Drizzle + Clerk**

### TypeScript 全栈类型安全极致方案
推荐：**TanStack Start + Hono + tRPC + Bun + PostgreSQL (Neon) + Drizzle + Better Auth**

### 边缘计算/全球低延迟
推荐：**Astro/Hono + Cloudflare Workers + Cloudflare D1 + Drizzle**

### 实时协作应用
推荐：**Next.js + Convex（自带实时+DB+后端） + Clerk**

### 高性能 Node.js 后端 API
推荐：**Fastify + Node.js + PostgreSQL + Drizzle/Prisma**

### 桌面应用
推荐：**Tauri + React/Svelte + SQLite**

### 移动端跨平台
推荐：**React Native (NativeWind) + Hono + Bun + PostgreSQL**
