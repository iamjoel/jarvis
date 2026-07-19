# 如何写出容易维护的 React 代码：18 个典型场景、正反例与判断边界

## 高密度摘要

- **一句话结论**：可维护的 React 代码，不是 Hook 越多、组件越碎或抽象越深，而是让“事实来源、状态所有者、变化原因、副作用边界”都能从代码中直接看出来。
- **核心机制**：保持渲染纯净；只保存最小且不矛盾的 state；让 state 靠近真正使用它的组件；把用户动作放进事件处理，把外部同步放进 Effect；按业务变化方向组织模块；用测试保护用户可观察行为。
- **判断入口**：遇到难改的组件，依次问五件事——这个值能否直接计算？state 是否放得太高？这段逻辑是事件还是外部同步？元素身份是否稳定？最后才问要不要抽 Hook、Context、Reducer 或 memo。
- **常见误区**：`useEffect` 不是数据加工管道，Context 不是默认状态容器，Reducer 不适合所有 state，`useMemo`/`useCallback` 不是正确性保证，消除每一处重复也不等于可维护。
- **相关文档**：[技术索引](../technology.md)、[前端资源](../f/frontend.md)、[前端技术史](../f/frontend-history.md)、[Next.js、Astro、Hono、VoidZero/Vite+ 框架对比](../f/frontend-frameworks-nextjs-astro-hono-voidzero.md)。

> 调研时间：2026-07-18。本文以当前 React 官方文档为主线；涉及 `useEffectEvent` 时以 React 19.2 为前提，涉及自动 memoization 时单独说明 React Compiler 1.0。其余原则大多同样适用于 React 18 的现代函数组件。

## 先定义“容易维护”

一段代码今天能运行，只说明它满足当前输入；“容易维护”还要求未来的人能低风险地回答下面的问题：

1. **改哪里**：一个需求变化主要落在一个清晰区域，而不是同时修改五个互不相邻的文件。
2. **为什么**：看到一次 state 更新、请求或订阅时，能看出是什么用户动作或外部条件触发了它。
3. **什么不能发生**：非法状态和非法 props 组合尽可能被数据结构或类型系统排除。
4. **删什么**：删除一个功能时，相关组件、请求、类型和测试能一起被发现并删除。
5. **怎么验证**：重构内部实现时，测试不因变量名、Hook 数量或子组件层级变化而大面积破裂。

组件行数不是首要指标。一个 250 行但数据流单向、状态明确的组件，可能比 12 个互相跳转、共享隐式 Context 的 30 行组件更容易维护。

## 来源如何阅读

本文把依据分成三层，避免把作者经验写成 React 规范：

| 标记 | 含义 | 如何使用 |
|---|---|---|
| **React 官方** | `react.dev` 对组件、state、Effect、Context、Compiler 等的当前说明 | 作为 React 语义与默认写法的主依据 |
| **作者经验** | Dan Abramov、Kent C. Dodds、Josh W. Comeau、TkDodo 等人的一方文章 | 用于补足架构取舍、抽象时机和大型项目经验 |
| **本文综合** | 把多条来源落到同一工程场景后的判断 | 不是原文逐句结论；应结合项目约束采用 |

这些作者的文章跨越多个 React 版本。本文只保留仍与当前官方文档一致的心智模型；旧文章里的 class lifecycle、旧数据获取方式或“所有项目都该选某框架”等时代性建议，不作为通用规则。

## 一套先后顺序

遇到组件难读、难改或频繁出 bug 时，按这个顺序处理：

1. 删除冗余 state 和不必要的 Effect。
2. 明确每块 state 的唯一所有者，并移动到最近需要它的位置。
3. 用稳定身份、不可变更新和合法状态模型守住正确性。
4. 把复杂更新集中到领域动作，把外部同步封装成有清理的 Effect 或领域 Hook。
5. 再调整组件 API、Context 和目录边界。
6. 最后用 Profiler 决定是否 memo；不要用缓存掩盖错误的数据流。

---

## 场景 1：组件在渲染时修改了 props 或外部对象

### 症状

- Strict Mode 下列表项重复、计数跳变。
- 同一份数据交给两个组件后，一个组件的渲染会影响另一个组件。
- 调整组件顺序或启用并发能力后出现难以复现的结果。

### 不应该这样写

```tsx
type Story = { id: string; title: string };

function StoryList({ stories }: { stories: Story[] }) {
  // ❌ 直接修改了调用者传入的数组。
  stories.push({ id: 'create', title: '创建故事' });

  return (
    <ul>
      {stories.map((story) => (
        <li key={story.id}>{story.title}</li>
      ))}
    </ul>
  );
}
```

`stories` 是这次渲染的输入。组件一边读取、一边修改输入，意味着相同输入不再保证相同输出。

### 应该这样写

```tsx
type Story = { id: string; title: string };

const createStory: Story = {
  id: 'create',
  title: '创建故事',
};

function StoryList({ stories }: { stories: readonly Story[] }) {
  const visibleStories = [...stories, createStory];

  return (
    <ul>
      {visibleStories.map((story) => (
        <li key={story.id}>{story.title}</li>
      ))}
    </ul>
  );
}
```

推荐约束：

- 把 props、state、Context 当作本次 render 的只读快照。
- 渲染只负责根据输入计算 JSX；网络请求、订阅、DOM 命令不放在组件顶层。
- 可以修改本次渲染内部刚创建、不会逃逸出去的局部数组或对象；“不可变”不是禁止一切赋值，而是不修改既存共享值。
- 保留 Strict Mode。它在开发期额外执行纯函数、Effect 清理和 ref 回调，目的是尽早暴露真实缺陷。

### 何时例外

在 `const rows = []` 之后用 `rows.push(...)` 构造本次 render 的局部结果是安全的，因为它没有修改渲染前已经存在的对象。若使用 Immer，允许修改的是 Immer 提供的 `draft`，不是原 state。

**来源**：React 官方的 [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)、[Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure) 与 [`<StrictMode>`](https://react.dev/reference/react/StrictMode)。

---

## 场景 2：用 state + Effect 保存本来可以直接计算的值

### 症状

- 页面先显示旧值，再补一次 render 才显示新值。
- 修改一个字段时要同步修改多个 setter 和依赖数组。
- 经常遇到 `fullName`、`filteredItems`、`isValid` 与源数据不同步。

### 不应该这样写

```tsx
function ProfileForm() {
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  // ...
}
```

这里保存了三份事实，但第三份完全由前两份决定。Effect 会让 React 先提交一次旧 `fullName`，再更新 state 并重新渲染。

### 应该这样写

```tsx
function ProfileForm() {
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');

  const fullName = `${firstName} ${lastName}`;

  // ...
}
```

同样的判断适用于：

- `filteredItems = items.filter(...)`
- `isEmpty = items.length === 0`
- `selectedItem = items.find(item => item.id === selectedId)`
- `total = lines.reduce(...)`

只保存 `selectedId`，通常比同时保存完整 `selectedItem` 更稳定；列表对象更新后，渲染时会自动找到新对象。

### 计算很贵怎么办

先直接计算并在 production build、接近用户的设备上测量。只有计算已经成为瓶颈时，才考虑 `useMemo`：

```tsx
const visibleRows = useMemo(
  () => buildVisibleRows(rows, filters),
  [rows, filters],
);
```

`useMemo` 只是缓存；React 可以丢弃缓存。业务正确性不能依赖“这个对象永远保持同一引用”。启用 React Compiler 1.0 的新代码，官方建议先依赖 Compiler 自动 memoization，只在需要精确控制时手写。

### props 只作为初始值时要说清楚

下面的 `value` 看起来像受控值，实际只在第一次 render 被读取，调用者很容易误判：

```tsx
// ❌ 名字暗示 value 会持续控制输入，但后续变化会被忽略。
function NameInput({ value }: { value: string }) {
  const [name, setName] = useState(value);
  // ...
}
```

要么真正受控：

```tsx
function NameInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
```

要么明确它只是初始值：

```tsx
function NameInput({ initialValue = '' }: { initialValue?: string }) {
  const [name, setName] = useState(initialValue);
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

如果切换实体时要重置整个编辑器，可以在父级使用稳定实体 ID 作为 `key`，见场景 7。

**来源**：React 官方的 [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)、[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)、[`useMemo`](https://react.dev/reference/react/useMemo) 与 [React Compiler introduction](https://react.dev/learn/react-compiler/introduction)；Kent C. Dodds 的 [Props vs State](https://kentcdodds.com/blog/props-vs-state)。

---

## 场景 3：多个布尔 state 组成了“不可能状态”

### 症状

- `isLoading` 和 `isError` 能同时为 `true`。
- `data` 已存在，但 `status` 仍是 `idle`。
- 每加一种状态，都要检查很多互不关联的布尔分支。

### 不应该这样写

```tsx
const [isSaving, setIsSaving] = useState(false);
const [isSaved, setIsSaved] = useState(false);
const [hasError, setHasError] = useState(false);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
```

四个 state 能组合出 16 种情况，但产品可能只允许 4 种。维护者必须靠记忆避免另外 12 种。

### 应该这样写

```tsx
type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; documentId: string }
  | { status: 'failed'; message: string };

function SaveStatus({ state }: { state: SaveState }) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'saving':
      return <p>保存中…</p>;
    case 'saved':
      return <p>已保存：{state.documentId}</p>;
    case 'failed':
      return <p role="alert">{state.message}</p>;
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}
```

这样做有三个收益：

1. 数据结构直接列出合法状态。
2. `documentId` 只在 `saved` 可用，`message` 只在 `failed` 可用。
3. 将来新增 `conflicted` 时，TypeScript 会指出遗漏的分支。

### 何时不需要联合类型

单个开关如 `isOpen` 本身没有矛盾，布尔值最清楚。不要把每个 `boolean` 都改成状态机。若 TanStack Query、路由框架或表单库已经提供权威状态，不要再复制一份本地 `isLoading/isError/data`；直接从库的结果渲染。

**来源**：React 官方的 [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)；TypeScript 官方的 [Discriminated unions 与 exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)。把两者组合成 React 的类型化状态机属于本文综合。

---

## 场景 4：把局部 state 过早提升到页面、Context 或全局 store

### 症状

- 一个弹窗输入框每敲一个字，整个页面的大量组件都重新 render。
- 删除局部功能时还要清理全局 action、selector、Context 类型和持久化字段。
- 组件读取的数据来自很远的 Provider，无法从 props 看出依赖。

### 不应该这样写

```tsx
function AppProvider({ children }: { children: ReactNode }) {
  const [draftTitle, setDraftTitle] = useState('');
  const [isRenameOpen, setRenameOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{ draftTitle, setDraftTitle, isRenameOpen, setRenameOpen }}
    >
      {children}
    </AppContext.Provider>
  );
}
```

如果只有 `RenameDialog` 使用这些值，全局化没有创造共享，只扩大了影响范围。

### 应该这样写

```tsx
function RenameDialog({
  currentName,
  onRename,
}: {
  currentName: string;
  onRename: (name: string) => Promise<void>;
}) {
  const [draftName, setDraftName] = useState(currentName);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onRename(draftName);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        名称
        <input
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
        />
      </label>
      <button type="submit">保存</button>
    </form>
  );
}
```

state 放置算法：

1. 先放在唯一使用它的组件。
2. 一个子组件使用时，放到该子组件或它的紧邻容器。
3. 兄弟组件要协调时，提升到最近公共父组件。
4. 相距很远的多个分支确实需要时，再考虑局部 Context 或外部 store。
5. 服务端权威数据、URL、表单草稿和瞬时 UI 状态是不同类型，不要因为都叫“state”就塞进同一容器。

“单一事实来源”不是“所有 state 在一个地方”，而是每一块独立事实都有一个明确 owner。

### 何时应该提升或全局化

- 两个输入必须保持同步。
- 页面 URL 需要可分享、可前进后退。
- 当前账号、主题、路由等跨远距离分支共享。
- 多页面共享并需要缓存或持久化的服务端数据。

**来源**：React 官方的 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)；Kent C. Dodds 的 [State Colocation](https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster) 与 [Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react)；Dan Abramov 的 [Before You memo()](https://overreacted.io/before-you-memo/)。

---

## 场景 5：直接修改 state，或基于旧 state 做非函数式更新

### 症状

- 调用了 setter，但界面没有更新。
- 快速连续操作会丢失其中一次更新。
- 历史日志里的旧对象“自己变了”，撤销/重做很难实现。

### 不应该这样写

```tsx
function TodoList() {
  const [todos, setTodos] = useState(initialTodos);

  function toggleTodo(id: string) {
    const todo = todos.find((item) => item.id === id);
    if (!todo) return;

    todo.done = !todo.done; // ❌ 修改了旧 render 的对象。
    setTodos(todos);        // ❌ 仍是同一个数组引用。
  }

  // ...
}
```

### 应该这样写

```tsx
function TodoList() {
  const [todos, setTodos] = useState(initialTodos);

  function toggleTodo(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  // ...
}
```

这里同时做对了两件事：

- 从变更点一路创建新对象，保留未变对象的引用。
- 当新值依赖旧值时使用函数式 setter，React 会把最新排队状态交给 updater，避免闭包读到过期快照。

数组复制是浅的，下面仍然会修改旧 state：

```tsx
const nextTodos = [...todos];
nextTodos[0].done = true; // ❌ nextTodos[0] 和 todos[0] 是同一个对象。
```

### 何时考虑 Reducer、扁平化或 Immer

- 嵌套较深且更新路径频繁：先检查数据是否应按 ID 扁平化。
- 多种交互以相似方式更新同一模型：考虑 Reducer，见下一个场景。
- 业务结构必须深层嵌套且拷贝代码遮蔽意图：可评估 Immer，但它是可选依赖；只允许修改 `draft`。

如果初始计算很贵，使用 lazy initializer，而不是让它在每次 render 都执行：

```tsx
const [index] = useState(() => buildSearchIndex(initialItems));
```

**来源**：React 官方的 [Updating Objects in State](https://react.dev/learn/updating-objects-in-state)、[Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)；函数式 updater 的补充参考见 [`useState`](https://react.dev/reference/react/useState)。

---

## 场景 6：复杂更新散落在多个 handler，无法重建“发生了什么”

### 症状

- “重置表单”要连续调用五个 setter。
- 同一种业务变化在不同按钮里有不同实现。
- 出错后只知道某个字段错了，不知道是哪次交互导致。

### 不应该这样写

```tsx
function Checkout() {
  const [step, setStep] = useState<'editing' | 'submitting' | 'done'>('editing');
  const [error, setError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  function reset() {
    setStep('editing');
    setError(null);
    setReceiptId(null);
  }

  // 其他 handler 继续以不同顺序组合这些 setter……
}
```

### 应该这样写

```tsx
type CheckoutState =
  | { status: 'editing' }
  | { status: 'submitting'; requestId: string }
  | { status: 'failed'; message: string }
  | { status: 'done'; receiptId: string };

type CheckoutAction =
  | { type: 'order_submitted'; requestId: string }
  | { type: 'order_succeeded'; requestId: string; receiptId: string }
  | { type: 'order_failed'; requestId: string; message: string }
  | { type: 'checkout_restarted' };

function checkoutReducer(
  state: CheckoutState,
  action: CheckoutAction,
): CheckoutState {
  switch (action.type) {
    case 'order_submitted':
      return { status: 'submitting', requestId: action.requestId };
    case 'order_succeeded': {
      if (
        state.status !== 'submitting' ||
        state.requestId !== action.requestId
      ) {
        return state; // 忽略已经过期的响应。
      }
      return { status: 'done', receiptId: action.receiptId };
    }
    case 'order_failed': {
      if (
        state.status !== 'submitting' ||
        state.requestId !== action.requestId
      ) {
        return state;
      }
      return { status: 'failed', message: action.message };
    }
    case 'checkout_restarted':
      return { status: 'editing' };
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
```

事件处理描述“发生了什么”，Reducer 决定“状态如何变化”：

```tsx
async function handleSubmit() {
  const requestId = createRequestId();
  dispatch({ type: 'order_submitted', requestId });

  try {
    const receipt = await submitOrder();
    dispatch({
      type: 'order_succeeded',
      requestId,
      receiptId: receipt.id,
    });
  } catch (error) {
    dispatch({
      type: 'order_failed',
      requestId,
      message: getErrorMessage(error),
    });
  }
}
```

`requestId` 让 Reducer 忽略已经被新提交或 `checkout_restarted` 淘汰的旧响应；如果请求 API 支持取消，还可以同时使用 `AbortController` 节省资源。Reducer 必须纯：不在里面请求、写日志服务、计时或操作 DOM。一次用户交互即使改变多个字段，也优先派发一个领域动作，如 `checkout_restarted`，而不是五个 `field_cleared`。

### 何时不要用 Reducer

一个开关、一个输入框或互不相关的简单 state，用 `useState` 更短、更直观。React 官方明确说明 Reducer 有额外代码成本；当更新分散、经常出错或需要清晰动作日志时，它才开始回本。

**来源**：React 官方的 [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) 与 [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)。

---

## 场景 7：列表输入串行错位，或切换实体后残留上一份草稿

这两类 bug 看似不同，根因都是没有正确表达“组件身份”。React 按组件类型、在 render tree 中的位置以及 `key` 关联 state。

### 不应该这样写

```tsx
function ContactList({ contacts }: { contacts: Contact[] }) {
  return contacts.map((contact, index) => (
    <ContactRow
      key={index} // ❌ 删除或排序后，同一个位置会对应另一个联系人。
      contact={contact}
    />
  ));
}
```

如果 `ContactRow` 有输入框或局部 state，删除第一项后，第二项会继承第一项所在位置的 state。

下面也不对：

```tsx
function ContactPage({ contact }: { contact: Contact }) {
  // ❌ 每次父组件 render 都产生一种新的组件类型。
  function ContactEditor() {
    const [draft, setDraft] = useState(contact.name);
    return <input value={draft} onChange={(e) => setDraft(e.target.value)} />;
  }

  return <ContactEditor />;
}
```

在组件内部定义组件会让 React 看到不断变化的类型，导致意外重置，并增加渲染成本。

### 应该这样写

```tsx
function ContactList({ contacts }: { contacts: readonly Contact[] }) {
  return contacts.map((contact) => (
    <ContactRow key={contact.id} contact={contact} />
  ));
}

function ContactEditor({ contact }: { contact: Contact }) {
  const [draft, setDraft] = useState(contact.name);

  return (
    <input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
    />
  );
}

function ContactPage({ contact }: { contact: Contact }) {
  // contact.id 变化时，明确把它视为另一份编辑会话，重置整个子树。
  return <ContactEditor key={contact.id} contact={contact} />;
}
```

### key 的规则

- 用数据创建时就持久化的稳定 ID。
- key 只需在同一组 siblings 中唯一。
- `key` 不会作为 prop 传给组件；组件需要 ID 时另传 `contactId={contact.id}`。
- 不用 `Math.random()`、`Date.now()` 或 render 时生成的 UUID。
- 索引只适用于永不插入、删除、筛选、排序，而且行内没有需要保持身份的 state/DOM 的静态列表。

### 何时不该用 key 重置

如果产品要求切回来仍保留每个联系人的未提交草稿，就不该销毁 state。应把草稿提升为 `draftsByContactId`，或存入专门的表单/持久化层。`key` 表达的是“换了实体就丢弃旧子树”，不是通用清空技巧。

**来源**：React 官方的 [Rendering Lists](https://react.dev/learn/rendering-lists)、[Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) 与 [Your First Component：不要嵌套组件定义](https://react.dev/learn/your-first-component#nesting-and-organizing-components)。

---

## 场景 8：用 Effect 观察一个 flag，再执行购买、提交或通知

### 判断入口

不要先问“能不能用 Effect”，先问“为什么这段代码要运行”：

- 因为用户这一次点击、提交、拖拽：放事件处理器。
- 因为组件当前显示，需要与浏览器、网络连接、第三方控件持续同步：放 Effect。
- 因为 props/state 变了，所以要算出 JSX：直接在 render 计算。

### 不应该这样写

```tsx
function BuyButton({ productId }: { productId: string }) {
  const [shouldBuy, setShouldBuy] = useState(false);

  useEffect(() => {
    if (!shouldBuy) return;

    void postPurchase(productId);
    showToast('购买成功');
  }, [shouldBuy, productId]);

  return <button onClick={() => setShouldBuy(true)}>购买</button>;
}
```

这里把一个瞬时事件变成持久 state，再让 Effect 猜测发生了什么。组件重新挂载、状态恢复或依赖变化时，都可能重复执行动作。

### 应该这样写

```tsx
function BuyButton({ productId }: { productId: string }) {
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleBuy() {
    if (isSubmitting) return;

    setSubmitting(true);
    try {
      await postPurchase(productId);
      showToast('购买成功');
    } catch (error) {
      reportError(error);
      showToast('购买失败，请重试');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button disabled={isSubmitting} onClick={handleBuy}>
      {isSubmitting ? '处理中…' : '购买'}
    </button>
  );
}
```

`isSubmitting` 描述界面状态；真正的购买仍由点击事件直接触发。前端按钮状态只能改善交互，不能充当服务端的重复提交防护。

### 合法的 Effect 例子

- 页面进入后记录曝光。
- `roomId` 改变时重连聊天服务器。
- React state 改变时同步非 React 地图库的缩放级别。
- 随 URL/query 持续同步搜索结果——但复杂项目优先框架或缓存库，见场景 10。

**来源**：React 官方的 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) 与 [Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)。

---

## 场景 9：Effect 依赖难写、连接频繁重建，最后选择禁用 lint

### 不应该这样写

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => connection.disconnect();
    // ❌ 读取了 roomId，却谎称没有依赖。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h1>{roomId}</h1>;
}
```

依赖数组不是“我希望它什么时候运行”，而是“这段 Effect 读取了哪些响应式值”的描述。空数组会让连接永远保留首次 render 的 `roomId`。

### 应该这样写

```tsx
function ChatRoom({
  roomId,
  muted,
}: {
  roomId: string;
  muted: boolean;
}) {
  const onConnected = useEffectEvent(() => {
    // 读取最新 muted，但 muted 改变不应导致重连。
    if (!muted) showNotification('连接成功');
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('connected', onConnected);
    connection.connect();

    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId}</h1>;
}
```

这段代码把两类逻辑分开：

- `roomId` 变化意味着同步目标变了，必须断开并重连。
- `muted` 只是连接成功那一刻要读取的最新偏好，不应重建连接。

### Effect 维护清单

1. 一个 Effect 只表达一个独立同步过程；删除它不应破坏另一个无关过程。
2. setup 与 cleanup 对称：connect/disconnect、subscribe/unsubscribe、show/close。
3. 遵守 `exhaustive-deps`。不满意依赖时先改代码结构，不是删数组项。
4. 在 Effect 内创建只供它使用的对象和函数，或把完全不读 props/state 的函数移到组件外。
5. Strict Mode 下 setup → cleanup → setup 对用户应与一次 setup 无区别。

### `useEffectEvent` 的严格边界

它从 React 19.2 起可用，但不是“最新版 useCallback”：

- 只从定义它的同一组件或 custom Hook 内的 Effect / Effect Event 调用。
- 不传给子组件或其他 Hook，不当普通点击 handler。
- 不放进依赖数组；它的身份有意不稳定。
- 不拿来隐藏本应触发同步的真实依赖。

采用该 API 时，应使用能识别 Effect Events 的当前 `eslint-plugin-react-hooks` 规则。

旧 React 版本需要读取最新值但不重建订阅时，可以在一个目的明确的 custom Hook 内封装 ref 模式；不要让可变 ref 散落在业务组件中。

**来源**：React 官方的 [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)、[Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)、[`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) 与 [`<StrictMode>`](https://react.dev/reference/react/StrictMode)；Dan Abramov 的 [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) 用于解释“每次 render 有自己的闭包”，具体 API 以当前官方文档为准。

---

## 场景 10：每个页面组件都手写 `useEffect + fetch`

### 症状

- 快速切换 ID 时，旧请求后返回并覆盖新页面。
- 父组件先请求，成功后才挂载子组件，子组件再请求，形成网络瀑布。
- 返回上一页时重新请求；SSR 首屏只有 loading；错误、重试、缓存逻辑到处复制。

### 不应该这样写

```tsx
function InvoicePage({ invoiceId }: { invoiceId: string }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetch(`/api/invoices/${invoiceId}`)
      .then((response) => response.json())
      .then(setInvoice);
  }, [invoiceId]);

  // 没有竞态处理、缓存、错误状态或请求去重。
  return invoice ? <InvoiceView invoice={invoice} /> : <Spinner />;
}
```

### 首选：使用项目框架的数据层

如果项目有 route loader、Server Components 或框架数据 API，把获取需求提升到路由/服务端层。显示组件只接收已解析的数据：

```tsx
function InvoiceView({ invoice }: { invoice: Invoice }) {
  return (
    <article>
      <h1>{invoice.number}</h1>
      <Money value={invoice.total} />
    </article>
  );
}
```

这样 `InvoiceView` 容易独立测试，也不需要知道缓存、请求头和路由预取。

### 纯客户端应用：把服务端状态交给缓存层

如果项目已经使用 TanStack Query v5，可把查询定义按 feature 共置成普通 `queryOptions` 函数：

```tsx
import { queryOptions, useQuery } from '@tanstack/react-query';

export function invoiceOptions(invoiceId: string) {
  return queryOptions({
    queryKey: ['invoice', invoiceId],
    queryFn: ({ signal }) => fetchInvoice(invoiceId, { signal }),
  });
}

function InvoicePage({ invoiceId }: { invoiceId: string }) {
  const invoiceQuery = useQuery(invoiceOptions(invoiceId));

  if (invoiceQuery.isPending) return <InvoiceSkeleton />;
  if (invoiceQuery.isError) {
    return <InlineError error={invoiceQuery.error} />;
  }

  return <InvoiceView invoice={invoiceQuery.data} />;
}
```

`queryKey` 是数据依赖声明，不只是缓存名字；`queryFn` 用到的筛选、页码、租户等可变输入都应进入 key。不要把 `query.data` 无条件复制到另一份 `useState`/全局 store。

### 必须手写 Effect 时

至少取消请求，或忽略已经过期的响应：

```tsx
useEffect(() => {
  const controller = new AbortController();

  void fetchInvoice(invoiceId, { signal: controller.signal })
    .then(setInvoice)
    .catch((error) => {
      if (error.name !== 'AbortError') setError(error);
    });

  return () => controller.abort();
}, [invoiceId]);
```

这仍未自动解决缓存、SSR、预取和父子瀑布，所以它是受限场景的底线，不是复杂应用的首选架构。

### 独立请求要并行，真实依赖要保留

```tsx
// ❌ permissions 不依赖 user，却多等一次往返。
const user = await fetchUser(userId);
const permissions = await fetchPermissions(userId);

// ✅ 两个请求独立。
const [user, permissions] = await Promise.all([
  fetchUser(userId),
  fetchPermissions(userId),
]);
```

如果 B 必须使用 A 返回的 ID，串行就是正确的。`Promise.all` 会 fail-fast；需要部分成功时再评估 `Promise.allSettled`。Suspense 能改善“先显示什么”，但不会凭空消除真实数据依赖。

### 表单是复制服务端数据的有条件例外

远程对象可以作为表单的 `initialValues`，但要明确它从此是草稿快照，后台刷新不会自动进入已经编辑的字段。协作或长时编辑场景应只保存 dirty fields，并考虑版本号、冲突提示或合并策略，而不是提交一份陈旧的完整对象覆盖服务器。

**来源**：React 官方的 [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects#fetching-data) 与 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)；TanStack Query 官方的 [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)、[Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options) 与 [Request Waterfalls](https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls)；TkDodo 的 [Practical React Query](https://tkdodo.eu/blog/practical-react-query)、[React Query and Forms](https://tkdodo.eu/blog/react-query-and-forms) 与 [Creating Query Abstractions](https://tkdodo.eu/blog/creating-query-abstractions)。

---

## 场景 11：为了“复用”而创建 `useMount`、`useEffectOnce` 或万能请求 Hook

### 不应该这样写

```tsx
function useMount(callback: () => void) {
  useEffect(callback, []);
}

function ProductPage({ productId }: { productId: string }) {
  useMount(() => {
    // ❌ productId 参与数据流，但抽象强迫它只读第一次。
    void loadProduct(productId);
  });
}
```

这种 Hook 只换了 API 名字，没有表达业务目的，还鼓励调用者绕过依赖模型。

另一个常见反例是把底层查询库的所有参数重新包装一次：

```tsx
// ❌ 每出现一个底层能力就再加一个 flag，最后得到第二套更差的 API。
useAppQuery({
  key,
  queryFn,
  staleTime,
  retry,
  select,
  throwOnError,
  enabled,
  // ...
});
```

### 应该抽“目的”，不是抽生命周期

```tsx
function useChatRoom({
  roomId,
  onMessage,
}: {
  roomId: string;
  onMessage: (message: Message) => void;
}) {
  const handleMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('message', handleMessage);
    connection.connect();

    return () => connection.disconnect();
  }, [roomId]);
}
```

调用方看到的是领域行为：

```tsx
useChatRoom({ roomId, onMessage: addMessage });
```

好 custom Hook 的特征：

- 名字说明能力，如 `useOnlineStatus`、`useMediaQuery`、`useChatRoom`。
- API 比内部 Effect 更高层，能隐藏 setup/cleanup、竞态或平台差异。
- 输入保留真正的响应式关系，不承诺虚假的“只执行一次”。
- 返回公共契约，不泄漏内部 setter、ref 和底层库的全部细节。

custom Hook 共享的是有状态逻辑，不是同一份 state；两个组件调用 `useOnlineStatus()` 仍各自拥有 Hook state。要共享同一事实，仍需提升 state、Context 或外部缓存。

### 有时根本不需要 Hook

- 纯转换：普通函数 `formatInvoice()`。
- 只用一次、只有三行且名字不能增加信息：留在组件。
- 共享 TanStack Query 配置：优先普通 `queryOptions()`，它还能用于 loader、prefetch、SSR 和 `useQueries`。

**来源**：React 官方的 [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)；TkDodo 的 [Creating Query Abstractions](https://tkdodo.eu/blog/creating-query-abstractions)。

---

## 场景 12：一出现 prop drilling 就建立万能 Context

### 为什么 prop drilling 不总是坏事

显式 props 会告诉维护者：数据从哪里来、哪些组件消费它。为了省掉两三层参数就改成 Context，可能减少字符，却增加隐式依赖。

在使用 Context 前先尝试：

1. 直接传 props。
2. 抽取真正的业务组件。
3. 把 JSX 作为 `children`/slot 传入，让不使用数据的中间层不再转发。

### 不应该这样写

```tsx
type AppContextValue = {
  currentUser: User | null;
  theme: Theme;
  draftInvoice: InvoiceDraft | null;
  toastQueue: Toast[];
  sidebarOpen: boolean;
  // 继续增长……
};
```

它把生命周期、变化频率和所有者完全不同的事实绑在一起，也让任何组件都能依赖所有内容。

### 应该按领域提供窄接口

```tsx
type AuthValue = {
  user: User;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({
  value,
  children,
}: {
  value: AuthValue;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);

  if (value === null) {
    throw new Error('useAuth 必须在 <AuthProvider> 内调用');
  }

  return value;
}
```

这个模块不导出裸 `AuthContext`，只导出 Provider 和公共 Hook，因此以后可以调整内部结构并提供清晰错误。Provider 也可以只包账号设置页面，不必位于应用根部。

### Context 的合理用途

- 主题、语言、当前账号、路由等远距离共享环境。
- 一个复杂页面内部的 reducer + dispatch。
- 组件库中父子成员之间的隐式协调。

若某个 Context 更新频繁且消费者很多，先拆成逻辑上独立的 Context；只有测量证明确有成本时，再考虑 state/dispatch 分离、selector 或 Provider value memoization。启用 React Compiler 的项目不要机械添加 `useMemo`。

**来源**：React 官方的 [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) 与 [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)；Kent C. Dodds 的 [Prop Drilling](https://kentcdodds.com/blog/prop-drilling) 与 [How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)。

---

## 场景 13：组件靠不断增加布尔 props 支持新需求

### 症状

- `primary`、`danger`、`compact`、`fullScreen`、`hideClose` 可以组成互相冲突的组合。
- 调用方不知道哪些 props 必须一起传，哪些组合没有意义。
- 组件内部充满 `if (a && !b || c)`，每加一个模式都要回归全部模式。

### 不应该这样写

```tsx
<Dialog
  confirm
  danger
  compact
  hideCloseButton
  submitOnEnter
  onConfirm={deleteAccount}
>
  删除账号？
</Dialog>
```

这段 JSX 没有说明非法组合。例如 `confirm={false}` 时 `onConfirm` 是否还必需？`hideCloseButton` 与没有 `onConfirm` 能否同时存在？

### 固定模式：用显式 variant 或可辨识联合

```tsx
type DialogProps =
  | {
      kind: 'info';
      title: string;
      onDismiss: () => void;
    }
  | {
      kind: 'confirm';
      title: string;
      confirmLabel: string;
      tone?: 'default' | 'danger';
      onConfirm: () => Promise<void>;
      onCancel: () => void;
    };

function Dialog(props: DialogProps) {
  if (props.kind === 'info') {
    return <InfoDialog {...props} />;
  }

  return <ConfirmDialog {...props} />;
}
```

更领域化时，直接提供 `<DeleteAccountDialog />` 往往比让每个调用方重新组合十个底层选项更安全。

### 布局需要由调用方控制：考虑组合

```tsx
<RadioGroup value={theme} onChange={setTheme}>
  <Stack gap="sm">
    <RadioGroup.Item value="system">跟随系统</RadioGroup.Item>
    <RadioGroup.Item value="light">浅色</RadioGroup.Item>
    <RadioGroup.Item value="dark">深色</RadioGroup.Item>
  </Stack>
</RadioGroup>
```

Compound components 适合调用方确实需要安排布局、插入说明或组合少量相对静态成员的基础组件，如 Tabs、RadioGroup、Menu。

### 不要为了模式而用模式

如果内容主要来自 API、顺序固定，而且组件希望严格控制渲染，那么一个明确的 `options` prop 更简单：

```tsx
<Select
  value={country}
  options={countries}
  onChange={setCountry}
/>
```

当你试图在类型层限制 compound component 的 `children` 只能出现某种成员时，常常说明自由组合不是需求，普通 props API 更合适。

**来源**：TkDodo 的 [Building Type-Safe Compound Components](https://tkdodo.eu/blog/building-type-safe-compound-components)；Kent C. Dodds 的 [Inversion of Control](https://kentcdodds.com/blog/inversion-of-control) 与 [Compound Components with React Hooks](https://kentcdodds.com/blog/compound-components-with-react-hooks)。组件 props 使用 discriminated union 是本文结合 TypeScript 的实现建议。

---

## 场景 14：看到两段相似 JSX，就立刻抽成“万能组件”

### 不应该这样写

```tsx
<BaseTable
  rows={rows}
  editable={false}
  selectable
  virtualized={false}
  stickyHeader
  showTotals
  exportable
  rowActions={['view', 'archive']}
  mode="invoice"
  // 后续继续增加每个调用点需要的例外……
/>
```

最初可能只是两张表有相似 `<table>` 标签，却被当成同一业务知识。第三个需求出现后，抽象只能靠 flag 和 callback 继续吞下差异。

### 应该先区分两种重复

1. **同一知识重复**：货币舍入规则、权限判定、invoice query key。它们变化时必须一起变化，应尽早集中。
2. **代码形状相似**：两张表刚好都有三列、两个表单都刚好有提交按钮。它们未来可能朝不同方向变化，可以暂时重复。

先写清楚具体用例：

```tsx
function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  // 发票列、金额汇总、账期语义。
}

function CustomerTable({ customers }: { customers: Customer[] }) {
  // 客户列、批量选择、销售负责人语义。
}
```

当多个真实用例暴露出稳定共同点后，只提炼那一小块：

```tsx
function TableShell({
  title,
  header,
  children,
}: {
  title: string;
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="table-shell">
      <h2>{title}</h2>
      <table>
        <thead>{header}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
```

### 抽象前问四个问题

1. 重复的是业务知识，还是只是当前代码长得像？
2. 两处是否总会因同一个需求一起修改？
3. 抽象后的调用点是否比原代码更能表达意图？
4. 新需求到来时，能否删除或拆开这个抽象，而不是继续加 flag？

“出现三次再抽”可以作为提醒，但不是定律。更可靠的信号是共同约束和差异轴已经可命名。

### 查询抽象的典型边界

固定 query key 与 query function 的薄配置很有价值：

```tsx
function invoiceOptions(id: string) {
  return queryOptions({
    queryKey: ['invoice', id],
    queryFn: ({ signal }) => fetchInvoice(id, { signal }),
  });
}
```

把底层库 20 多个 options 逐项转发成另一套万能 Hook，通常只制造一层同步维护成本。

**来源**：Kent C. Dodds 的 [AHA Programming](https://kentcdodds.com/blog/aha-programming)；Dan Abramov 的 [Goodbye, Clean Code](https://overreacted.io/goodbye-clean-code/) 与 [The WET Codebase](https://overreacted.io/the-wet-codebase/)；TkDodo 的 [Creating Query Abstractions](https://tkdodo.eu/blog/creating-query-abstractions)。这些是作者经验，不是 React API 规则。

---

## 场景 15：目录按技术类型横切，修改一个功能要在全仓库跳转

### 不应该默认这样扩张

```text
src/
├── components/
│   ├── InvoicePage.tsx
│   ├── CustomerPage.tsx
│   └── ... 200 个文件
├── hooks/
│   ├── useInvoice.ts
│   └── useCustomer.ts
├── types/
│   ├── invoice.ts
│   └── customer.ts
├── utils/
│   ├── invoice.ts
│   └── customer.ts
└── tests/
    └── 复制一套 src 目录
```

这种结构只回答“它在技术上是什么”，不回答“它为哪个功能服务”。删除发票功能时，很容易漏掉 `utils/`、query key、测试和类型。

### 中大型项目优先按 vertical 共置

```text
src/
├── invoices/
│   ├── InvoicePage.tsx
│   ├── InvoiceTable.tsx
│   ├── invoiceQueries.ts
│   ├── invoiceReducer.ts
│   ├── invoiceTypes.ts
│   ├── InvoicePage.test.tsx
│   └── index.ts
├── customers/
│   └── ...
└── design-system/
    └── ...
```

共置原则：

- 一起变化的代码放在一起。
- feature 私有的 component、Hook、type、query 和测试留在 feature 内。
- 真正跨多个 vertical 稳定复用时，再提升为 design system 或独立 vertical。
- 每个 vertical 只通过小而明确的 public interface 对外；禁止其他区域 deep import 私有实现。
- 测试靠近被保护的模块，删除功能时能一起被发现。

### `index.ts` 和 barrel import 要分两类看

内部小型 `index.ts` 可以声明 vertical 的公共接口，提高边界可见性。Vercel 对 barrel 的性能警告主要针对拥有成百上千 re-export 的第三方入口：它们可能拖慢 dev 启动、构建或冷启动。

因此：

- 对大型第三方包，优先其**官方公开 subpath**，或使用框架的 `optimizePackageImports`。
- 不为了规避 barrel 直接 import 包内未承诺稳定的 `dist/...` 私有路径。
- 不把“所有 index.ts 都禁止”写成 React 规范；用模块规模、side effects 和构建数据判断。

### 小项目的例外

十几个文件的原型无需预建复杂领域层级。可以从扁平结构开始，在查找和修改开始跨越多个功能时再形成 vertical。目录设计服务于变化，不是仪式。

**来源**：TkDodo 的 [The Vertical Codebase](https://tkdodo.eu/blog/the-vertical-codebase)；Kent C. Dodds 的 [Colocation](https://kentcdodds.com/blog/colocation)；Vercel 的 [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)。

---

## 场景 16：为了防止 re-render，到处添加 `memo`、`useMemo`、`useCallback`

### 不应该这样写

```tsx
const label = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
const isEmpty = useMemo(() => items.length === 0, [items]);
const handleOpen = useCallback(() => setOpen(true), []);

export default memo(Toolbar);
```

这些缓存增加了依赖数组、阅读路径和保留引用，却没有证据表明字符串拼接、长度判断或 `Toolbar` render 构成瓶颈。

### 推荐的优化顺序

1. **确认 production build**：开发模式和 Strict Mode 会额外工作。
2. **确认正确性**：不纯 render、Effect 链和过高 state 先修掉。
3. **用 React DevTools Profiler 定位**：找出“频繁且昂贵”的子树，不是只看 render 次数。
4. **先改结构**：把 state 下移，或把不依赖该 state 的内容提升成 `children`。
5. **确认 Compiler 状态**：启用 React Compiler 1.0 的新代码优先依赖自动 memoization。
6. **最后手写缓存**：只覆盖 Compiler 未处理或需要精确引用控制的已测瓶颈。

### 先移动 state、提升内容

```tsx
function Page() {
  return (
    <ColorPicker>
      <ExpensiveReport />
    </ColorPicker>
  );
}

function ColorPicker({ children }: { children: ReactNode }) {
  const [color, setColor] = useState('red');

  return (
    <section style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {children}
    </section>
  );
}
```

`ExpensiveReport` 由 `Page` 创建，不依赖 `ColorPicker` 的 state。改变颜色时，React 可以跳过作为同一 `children` prop 传入的子树；数据流也比层层 memo 更直观。

### 手写 memo 的合理场景

- 未启用 Compiler，某个纯组件以相同 props 高频 render，且本身昂贵。
- 昂贵纯计算的输入在多数 render 中不变。
- 下游 memoized API 确实依赖对象或 callback 的引用稳定。

```tsx
const visibleRows = useMemo(
  () => expensiveFilter(rows, filters),
  [rows, filters],
);
```

### 必须记住的边界

- `memo` 仍会因组件自身 state 或它读取的 Context 变化而 render。
- React 仍可能 render 一个 memoized 组件；它不是语义保证。
- `useMemo` 的缓存可能被丢弃，首次 render 也不会更快。
- 自定义深比较器可能比重新 render 更慢，还可能因漏比较函数 prop 捕获旧闭包。
- 已有项目启用 Compiler 后不要批量删除旧 memo；官方建议先测试，因为删除会改变编译结果。

**来源**：React 官方的 [`memo`](https://react.dev/reference/react/memo)、[`useMemo`](https://react.dev/reference/react/useMemo)、[React Compiler introduction](https://react.dev/learn/react-compiler/introduction) 与 [React Compiler 1.0 announcement](https://react.dev/blog/2025/10/07/react-compiler-1)；Dan Abramov 的 [Before You memo()](https://overreacted.io/before-you-memo/)；Kent C. Dodds 的 [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)；Josh W. Comeau 2025 年更新的 [Understanding useMemo and useCallback](https://www.joshwcomeau.com/react/usememo-and-usecallback/)。

---

## 场景 17：测试绑定内部 state、Hook 数量和子组件结构

### 不应该这样测

```tsx
test('点击后 openIndex 变成 1', () => {
  const wrapper = mount(<Accordion items={items} />);

  wrapper.find(AccordionItem).at(1).simulate('click');
  expect(wrapper.state('openIndex')).toBe(1);
});
```

即使手风琴对用户仍完全正常，只要把 `openIndex` 改名、换成 Reducer、合并 state 或内联子组件，这个测试就会失败。反过来，handler 接错导致页面没打开，它也可能仍通过。

### 应该保护用户可观察行为

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('用户可以展开第二个问题', async () => {
  const user = userEvent.setup();
  render(<Accordion items={items} />);

  await user.click(
    screen.getByRole('button', { name: '退款需要多久？' }),
  );

  expect(
    screen.getByText('通常会在 3—5 个工作日到账。'),
  ).toBeVisible();
});
```

React 组件有两类公共使用者：

- 终端用户通过可访问的 DOM、文字和交互使用它。
- 开发者通过 props、children、回调和公开模块 API 使用它。

测试主要围绕这两类契约。不要让测试成为必须维护的“第三个私有 API 使用者”。

### 测试边界建议

- 优先 role、accessible name、label、可见文字；`data-testid` 是无法用语义查询时的逃生口。
- 让测试经过真实事件与公开 props，不直接调用私有 handler。
- 重构组件边界而行为不变时，测试应继续通过。
- 复杂 Reducer 是纯函数，可以补少量穷尽单元测试；但仍要有组件级用例验证接线。
- Query 测试每例使用隔离的 QueryClient，在 HTTP 边界 mock 网络，错误用例关闭 retry。
- 测试文件与 feature 共置，删除或移动功能时同步处理。

巨型 snapshot 经常只告诉你“很多标记变了”，却不说明用户能力是否破坏。把 snapshot 留给确有稳定序列化契约的小对象，而不是整页 DOM 的默认测试。

**来源**：Testing Library 的 [Introduction](https://testing-library.com/docs/) 与 [About Queries](https://testing-library.com/docs/queries/about/)；Kent C. Dodds 的 [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) 与 [How to know what to test](https://kentcdodds.com/blog/how-to-know-what-to-test)；TanStack Query 的 [Testing 指南](https://tanstack.com/query/latest/docs/framework/react/guides/testing)；React 官方关于复杂 Reducer 可独立测试的说明见 [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)。

---

## 场景 18：loading、空数据、权限与 render 错误没有明确边界

### 症状

- `if (!data) return null` 同时代表加载、空结果、404 和权限不足。
- 一个图表 render 崩溃，整页白屏。
- 父组件尝试用 `try/catch` 包住 `<Child />`，却捕获不到子组件 render 错误。

### 不应该这样写

```tsx
function InvoiceArea() {
  try {
    return <InvoiceReport />; // ❌ 子组件 render 错误不会这样被捕获。
  } catch {
    return <p>加载失败</p>;
  }
}
```

也不要把所有非成功情况压成一个布尔值：

```tsx
if (!invoice) return <Spinner />; // 可能永远在转，也无法区分 404。
```

### 应该把产品状态和故障范围写出来

```tsx
function InvoiceRoute({ invoiceId }: { invoiceId: string }) {
  return (
    <InvoiceErrorBoundary invoiceId={invoiceId}>
      <Suspense fallback={<InvoiceSkeleton />}>
        <InvoiceContent invoiceId={invoiceId} />
      </Suspense>
    </InvoiceErrorBoundary>
  );
}
```

其中 `InvoiceErrorBoundary` 应由框架提供，或由项目集中维护为 class Error Boundary；当前 React 仍不能用普通函数组件直接实现 `componentDidCatch`。fallback 应提供用户能理解的状态与恢复动作，而不仅是 `console.error`。

在非 Suspense 数据层中，显式区分：

- pending：显示尺寸稳定的 skeleton。
- empty：请求成功但没有记录，提供创建或调整筛选入口。
- not found：实体不存在或已删除。
- forbidden：没有权限，说明下一步。
- failed：显示局部错误、重试，并记录诊断信息。
- success：渲染内容。

### Error Boundary 放在哪里

放在有产品意义、能独立降级的地方：路由、主工作区、消息列表、第三方报表。不要每个头像都套一层，也不要整站只有最外层一个边界。

### 它不会捕获什么

- 普通事件处理器中的错误。
- 一般 `setTimeout`、Promise callback 等异步错误。
- 服务端渲染错误。
- Error Boundary 自己 render 时的错误。

这些错误要在事件/数据层显式处理，或交给框架的服务端与路由错误机制。Error Boundary 是 render 子树的隔离边界，不是全局 `try/catch`。

**来源**：React 官方的 [Catching rendering errors with an Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)、[error-boundaries lint](https://react.dev/reference/eslint-plugin-react-hooks/lints/error-boundaries) 与 [`<Suspense>`](https://react.dev/reference/react/Suspense)。

---

## 一张“坏味道 → 优先动作”速查表

| 看到的坏味道 | 先做什么 | 不要先做什么 |
|---|---|---|
| Effect 里只调用 setter | 检查能否在 render 直接计算，或在事件中一次更新 | 加 `useMemo`、禁用依赖 lint |
| 多个 `isXxx` 可以互相矛盾 | 合并成单一 status / discriminated union | 再加一个布尔值修补 |
| prop 被复制到 state | 决定受控、`initialX`，或用 key 重置 | 用 Effect 持续镜像 |
| 输入一个字整页变慢 | 把 state 下移；用 Profiler 看昂贵子树 | 全树包 `memo` |
| 列表编辑内容跳到另一行 | 使用数据中的稳定 ID 作为 key | 用 index 或随机 key |
| 依赖数组很难满足 | 拆同步过程、移动函数/对象、区分事件与 Effect | `eslint-disable` |
| 每个组件都 fetch | 使用框架数据层或服务端状态缓存 | 复制更多 loading/error 样板 |
| Context value 不断膨胀 | 按领域拆分；先尝试 props/children | 再加一个万能 `AppContext` |
| 公共组件 props 充满 flags | 显式 variant、领域组件或合适的组合 API | 再增加布尔 prop |
| `utils/` 与 `components/` 找不到代码 | 按 feature/vertical 共置并定义 public interface | 创建更多技术类型目录 |
| 测试一重构就碎 | 通过公开 props、role、label 和可见结果测试 | 断言 state、Hook 次数、子组件名 |
| 一个局部错误整页白屏 | 在可独立恢复的功能/路由放 Error Boundary | 用父 render 的 `try/catch` |

## PR 评审清单

### Render 与 state

- [ ] 组件顶层只做纯计算，没有修改 props、state 或外部对象。
- [ ] 能从 props/state 计算出的值没有重复存入 state。
- [ ] 每块 state 都有清晰 owner，并靠近真正使用位置。
- [ ] 不存在能互相矛盾的布尔状态组合。
- [ ] 对象和数组更新没有修改旧快照；依赖旧值时使用函数式 setter。
- [ ] 复杂 Reducer action 描述“发生了什么”，Reducer 本身无副作用。
- [ ] 列表 key 稳定；组件定义没有嵌套在另一个组件函数中。
- [ ] 受控值、默认值和只读取一次的 `initialX` 语义明确。

### 事件、Effect 与数据

- [ ] 用户动作直接发生在对应事件处理器，不经由 state + Effect 转发。
- [ ] 每个 Effect 都能说出它同步的外部系统。
- [ ] Effect setup/cleanup 对称，Strict Mode 重建不会产生用户可见差异。
- [ ] `exhaustive-deps` 没有被压制；依赖与代码实际读取一致。
- [ ] `useEffectEvent` 只承载真正非响应式的 Effect 内事件。
- [ ] 手写 fetch 有竞态处理；复杂数据获取使用框架或缓存层。
- [ ] 所有影响查询结果的变量进入 query key。
- [ ] 只有独立请求并行，真实依赖仍然显式。

### API、模块、性能与测试

- [ ] Context 只处理合适的跨层领域，没有成为万能 store。
- [ ] 公共组件没有非法的布尔 prop 组合；调用点能看出意图。
- [ ] 抽象代表稳定共同知识，而不是只消除表面重复。
- [ ] 同一 feature 的 component、query、type、test 能一起找到。
- [ ] 公共模块有小而明确的出口，其他 feature 不 deep import 私有实现。
- [ ] memoization 来自测量或明确引用边界，不是默认装饰。
- [ ] 启用 React Compiler 时，新代码优先依赖 Compiler；旧 memo 不批量删除。
- [ ] 测试面向公共 props 与用户可观察行为，不绑定内部实现。
- [ ] loading、empty、not found、forbidden、failed、success 有可区分语义。
- [ ] Error Boundary 位于能独立降级和恢复的产品边界。

## 渐进改造现有项目的顺序

不要先进行全仓库“最佳实践重写”。按风险与回报逐步推进：

1. **先守住正确性**：启用并修复 React Hooks 推荐 lint；保留 Strict Mode；处理 state mutation、随机 key 和 Effect cleanup。
2. **减少同步负担**：删除冗余 state、派生 Effect 和事件转 Effect；把 prop mirroring 改成受控、`initialX` 或 key。
3. **明确所有权**：把局部 state 下移，把真正共享 state 提到最近公共父级；拆分万能 Context。
4. **形成业务边界**：复杂更新改为领域 Reducer；按 vertical 共置 query、type、component 和 test；只公开稳定接口。
5. **补可靠性**：用行为测试覆盖高风险用例，给可独立恢复区域加 Error Boundary，明确空态与错误态。
6. **最后优化性能**：在 production build 用 Profiler 测量；尝试结构调整和 Compiler，再对剩余热点手写 memoization。

每一步都应由现有行为测试或关键手工用例保护。一次只改一种风险来源，避免把逻辑重构、目录搬迁、数据层替换和性能优化混在同一个 PR。

## 来源索引与适用范围

### React 官方：语义与默认写法

- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)：render 纯度、局部 mutation、Strict Mode。
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)：关联、矛盾、冗余、重复与深层 state。
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)：最近公共 owner、受控与非受控组件。
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)：tree position、type、key 与 state 身份。
- [Updating Objects in State](https://react.dev/learn/updating-objects-in-state) 与 [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)：不可变快照、浅拷贝与 Immer 边界。
- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)：Reducer 的收益、成本与纯度。
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)：派生数据、事件逻辑、key 重置与数据获取。
- [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)：依赖数组、lint 与独立同步过程。
- [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent)：React 19.2 的非响应式 Effect 事件及限制。
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)：按目的抽 Hook、共享逻辑不共享 state。
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)：Context 的前置替代与适用场景。
- [`memo`](https://react.dev/reference/react/memo)、[`useMemo`](https://react.dev/reference/react/useMemo)、[React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1)：性能优化的非语义性质与现代 Compiler 边界。
- [Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)：render 错误隔离与捕获范围。

### 作者文章：工程判断与反例

- Dan Abramov：[Before You memo()](https://overreacted.io/before-you-memo/)、[A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)、[Goodbye, Clean Code](https://overreacted.io/goodbye-clean-code/)。前两篇早于 React Compiler 与 `useEffectEvent`，本文只采用仍被当前官方文档支持的结构和闭包模型。
- Kent C. Dodds：[State Colocation](https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster)、[Colocation](https://kentcdodds.com/blog/colocation)、[AHA Programming](https://kentcdodds.com/blog/aha-programming)、[How to use React Context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively)、[When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)、[Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)。
- Josh W. Comeau：[Understanding useMemo and useCallback](https://www.joshwcomeau.com/react/usememo-and-usecallback/)。页面已于 2025-12 更新并纳入 React Compiler 1.0；文章内若仍出现更早的未来时表述，以 React 官方 1.0 公告为准。
- TkDodo：[Creating Query Abstractions](https://tkdodo.eu/blog/creating-query-abstractions)、[The Vertical Codebase](https://tkdodo.eu/blog/the-vertical-codebase)、[Building Type-Safe Compound Components](https://tkdodo.eu/blog/building-type-safe-compound-components)、[React Query and Forms](https://tkdodo.eu/blog/react-query-and-forms)。这些是 TanStack Query 维护者的工程经验，不是 React 规范。

### 工具与框架补充

- [Testing Library Introduction](https://testing-library.com/docs/)：用户中心、避免实现细节的测试原则。
- [TanStack Query：Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options) 与 [Request Waterfalls](https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls)：可复用查询配置和请求瀑布。
- [Vercel：How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)：大型第三方 barrel import 的具体工程问题；不能外推成所有内部 `index.ts` 的禁令。

## 最后的判断标准

如果一次需求变化到来，维护者能在一个清晰的 feature 内找到事实来源，沿着显式 props/action 看懂变化原因，在 Effect 边界看到完整 setup/cleanup，并用面向用户的测试验证结果，这段 React 代码通常已经很容易维护。

反过来，如果代码只能靠万能 Context、Effect 链、随机 key、布尔 prop 组合、全局 `utils/` 和遍地 memo 勉强保持运行，即使每个文件都很短，也仍然是一套高认知成本系统。
