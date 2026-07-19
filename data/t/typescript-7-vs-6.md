# TypeScript 7 相比 TypeScript 6 增加了什么？

## 高密度摘要

- **一句话结论**：TypeScript 7 的核心不是新增大量类型语法，而是把编译器和语言服务从 TypeScript/JavaScript 迁移到 Go，以原生代码、共享内存多线程和并行构建换来通常 8–12 倍的全量构建提速。
- **核心机制**：解析、类型检查、代码生成和项目引用构建可以并行执行；新 LSP 语言服务器也能并发处理编辑器请求；选择 Go 是为了在获得原生性能的同时尽量一对一保留旧编译器的结构与语义。
- **判断入口**：纯 `.ts` 大型项目和 monorepo 最容易立即受益；依赖 TypeScript 编程 API、语言服务插件或 Vue/Svelte/Astro/MDX/Angular 模板类型检查的项目需要先验证生态兼容性。
- **常见误区**：7.0 不是一次以新类型语法为主的版本；TypeScript 6 已经引入的现代默认值不应重复算成 7.0 新功能，7.0 只是把 6.0 的弃用项变成硬错误。
- **相关文档**：[技术索引](../technology.md)、[前端技术史](../f/frontend-history.md)。

> 状态基准：TypeScript 6.0 于 2026 年 3 月 23 日发布；TypeScript 7.0 于 2026 年 7 月 8 日正式发布。以下比较以 7.0 正式版为准。

## 核心变化

| 方面 | TypeScript 6 | TypeScript 7 新增或改变 | 实际影响 |
|---|---|---|---|
| 实现语言 | 编译器和语言服务以 TypeScript 编写、运行于 JavaScript 引擎 | 迁移到 Go 原生实现 | 官方实测大型项目全量构建通常快 **8–12 倍** |
| 并行能力 | 主要受 JavaScript 单线程模型限制 | 并行解析、类型检查和 emit | 更充分利用多核 CPU，大项目受益最大 |
| 类型检查并行控制 | 无对应控制项 | 实验性 `--checkers`，默认 4 个检查器 | 可按 CPU 与内存条件调节；增加检查器通常更快但更耗内存 |
| 项目引用构建 | 项目引用构建缺少同等级的原生并行调度 | 实验性 `--builders` | monorepo 可同时构建多个项目；与 `--checkers` 的并发量会相乘 |
| 单线程控制 | 无 TS7 对应开关 | `--singleThreaded` | 适合调试、低资源 CI 或与外部并行编排器配合 |
| Watch 模式 | 旧文件监听实现 | 基于 Parcel watcher 思路重建的跨平台 Go 文件监听器 | 文件监听更稳定，资源消耗更低，增量反馈更快 |
| 编辑器协议 | 旧语言服务架构及 TypeScript 专用集成 | 基于标准 LSP 的新语言服务器，并可并发服务请求 | 更容易接入 VS Code、Visual Studio、WebStorm 等现代编辑器；大型项目补全、诊断和引用查找明显加速 |
| 类型级 Unicode | 模板字面量类型按 UTF-16 码元拆分增补平面字符 | 推断时保留完整 Unicode code point | emoji 等字符不再被拆成两个无配对代理项；这是一个小型破坏性变化 |
| 类型与声明输出顺序 | 可用 `--stableTypeOrdering` 模拟 7.0 行为，但最多可能带来约 25% 检查开销 | 稳定类型排序永久开启，并由新实现保证确定性 | `.d.ts` 和错误展示顺序更稳定；不能关闭 |
| JavaScript/JSDoc | 支持较多 Closure 风格和历史特殊写法 | JS 分析更接近 `.ts`，删去一批旧 JSDoc/Closure 特例 | 现代 JS 更一致；老式 `@enum`、`@class`、Closure 函数类型等需要迁移 |
| 编程 API | `typescript` 包暴露成熟 API | **7.0 暂不提供稳定编程 API**，新 API 计划在 7.1 或以后提供 | `typescript-eslint`、ts-morph、Volar 及嵌入式语言工具链可能仍需并用 TS6 |

## 最值得关注的新增能力

### 1. 8–12 倍全量构建提速

这是 7.0 的主功能。官方在同一环境中的结果包括：VS Code 从 125.7 秒降到 10.6 秒（11.9 倍），Sentry 从 139.8 秒降到 15.7 秒（8.9 倍），Playwright 从 12.8 秒降到 1.47 秒（8.7 倍）。这些是特定代码库的实测，不代表每个项目都必然达到相同倍数。

总构建期间的累计内存使用也有所下降，官方样本约减少 6%–26%。编辑器首次诊断同样受益，例如 VS Code 代码库从约 17.5 秒降到 1.3 秒以内。

### 2. 可调节的多核并行

TypeScript 7 默认使用 4 个类型检查 worker，并提供三个新开关：

```bash
# 使用 8 个类型检查器
tsc --checkers 8

# 同时构建 4 个 project references 项目
tsc -b --builders 4

# 完全禁用编译器内部并行
tsc --singleThreaded
```

`--checkers 4 --builders 4` 最多可能形成 16 个类型检查器，因此不应机械地把数值调到最大；CI 核心数少或内存紧张时，降低并发可能更快、更稳。

### 3. 重建的 `--watch` 与 LSP 语言服务器

7.0 重新实现了文件监听，使用从 Parcel watcher 思路移植到 Go 的跨平台方案。编辑器侧则改用 LSP，并补齐自动导入、inlay hints、CodeLens、JSX 标签联动编辑、语义高亮、排序导入和删除未使用导入等常用功能。

官方还报告，新语言服务器相比 6.0 的失败命令减少超过 80%，崩溃减少超过 60%；这些是官方遥测结果，实际体验仍取决于编辑器及其集成方式。

### 4. 模板字面量类型正确处理 emoji 等 Unicode 字符

```ts
type HeadTail<S> = S extends `${infer Head}${infer Tail}`
  ? [Head, Tail]
  : never;

type Result = HeadTail<"😀abc">;
// TS 7: ["😀", "abc"]
// TS 6: ["\ud83d", "\ude00abc"]
```

这更接近 `for...of` 或 `[...str]` 的直觉，但依赖 UTF-16 码元实现字符串长度等类型运算的库可能出现行为变化。

## 哪些不是 7.0 新功能？

以下默认值主要由 TypeScript 6.0 引入，7.0 继承并强制执行，不能简单算作“7 比 6 新增”：

- `strict: true`
- `module: "esnext"`
- `target` 默认指向最新稳定 ECMAScript 版本
- `noUncheckedSideEffectImports: true`
- `libReplacement: false`
- `rootDir` 默认项目根目录
- `types` 默认 `[]`，需要显式列出如 `node`、`jest`

同理，`target: es5`、`downlevelIteration`、`baseUrl`、`moduleResolution: node/node10/classic`、AMD/UMD/SystemJS 等是在 6.0 中弃用、到 7.0 变成硬错误的兼容性收缩，不是面向开发者的正向新功能。

## 为什么选择 Go，而不是 Rust？

并不是因为 Rust 性能不够。TypeScript 团队明确表示，多种语言都适合从零重写编译器；但 TS7 的目标是忠实移植一个已经积累约百人年投入的编译器，而不是重新设计它。

官方给出的选择标准主要是：

- **结构相似性优先**：旧编译器以函数和可变数据结构为主，几乎没有 class；惯用 Go 与其现有代码模式相似，方便把修复在 TS6 和 TS7 两套代码库之间移植。
- **避免重做内存模型**：Go 可以控制对象和字段布局，同时通过垃圾回收避免整个代码库持续处理内存所有权。编译器批处理结束后进程直接退出，GC 成本较弱；语言服务中大量 AST 又会长期存活，团队还能选择合适时机触发 GC。
- **适合树和图遍历**：TypeScript 类型检查包含大量带多态节点的上下行树遍历和图处理，Go 在保持代码接近 JavaScript 版本的前提下比较自然。
- **兼容性比理论极限更重要**：团队需要保留旧实现的语义、关键优化和代码结构，减少移植带来的行为偏差。

官方说明没有逐条写成“Rust 因为 X 被淘汰”。但根据上述标准可以合理推断：Rust 的所有权、借用和生命周期能提供更强的静态内存安全与更细的性能控制，却也更可能要求重新设计共享、可变、互相引用的 AST 和类型图结构。这对从零重写可能是优势，对追求一对一映射的移植则会增加复杂度和兼容风险。

因此，这不是“Go 比 Rust 更快”的结论，而是“Go 更符合这次忠实移植的约束”。TypeScript 团队也承认 Go 的进程内 JavaScript 互操作并非最强项，这正是 TS7.0 没有直接沿用旧编程 API、需要重新设计 API 的背景之一。

## 升级判断

### 建议直接尝试 7.0

- 主要使用 `.ts`/`.tsx`，不依赖 TypeScript 编程 API。
- 大型代码库、monorepo 或 CI 类型检查耗时明显。
- 编辑器卡在项目加载、诊断、补全或 find references。

### 建议暂时并用 6.0 与 7.0

- 工具直接 `import "typescript"` 并调用 compiler API。
- 使用 typescript-eslint、ts-morph 或自定义 tsserver 插件，且尚未确认 TS7 兼容方案。
- 使用 Vue、Svelte、Astro、MDX，或依赖 Angular 模板类型检查。7.0 发布时这些工作流仍可能依赖 TS6 的 API。

可以让 TS7 负责快速 CLI 类型检查，同时通过 `@typescript/typescript6` 保留 TS6 API；具体依赖别名应按所用工具的官方兼容说明配置。

## 结论

如果只问“写 TypeScript 代码时多了哪些语法”，答案几乎只有 Unicode 模板字面量类型行为这一项值得单独指出。若问“工程能力增加了什么”，答案则很大：原生 Go 编译器、多线程类型检查、并行项目构建、重建的 watch、LSP 编辑器架构，以及 8–12 倍量级的官方实测性能提升。TypeScript 7 更像一次运行时与工具链换代，而不是一次语言语法大扩展。

## 官方来源

- [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Announcing TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
- [microsoft/typescript-go](https://github.com/microsoft/typescript-go)
- [TypeScript 6 与 7 的意图性差异（CHANGES.md）](https://github.com/microsoft/typescript-go/blob/main/CHANGES.md)
- [TypeScript 团队：Why Go?](https://github.com/microsoft/typescript-go/discussions/411)
