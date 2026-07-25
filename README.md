# 📈 MarketOps Dashboard

A high-performance real-time trading dashboard built with **React 19**, **TypeScript**, **Zustand**, **WebSockets**, and **Lightweight Charts**.

The project focuses on frontend architecture and performance optimization techniques used in modern financial dashboards, including batched WebSocket updates, virtualized rendering, optimized state subscriptions, incremental chart updates, code splitting, and runtime performance monitoring.

---

# 🚀 Live Demo

> Coming Soon

---

# 📷 Screenshots

## Dashboard

_Add Screenshot_

---

## Trading Chart

_Add Screenshot_

---

## Performance Overlay

_Add Screenshot_

---

## Bundle Analyzer

_Add Screenshot_

---

# ✨ Features

## Real-Time Data

- Live WebSocket connection
- Automatic market updates
- Connection status indicator
- Heartbeat monitoring

---

## Trading Dashboard

- Live market watchlist
- Price updates
- Percentage change
- Volume updates
- Symbol selection
- Live price chart

---

## Performance Optimizations

- WebSocket batching
- Batched Zustand updates
- Virtualized watchlist
- Incremental chart updates
- Optimized store subscriptions
- React.memo components
- Lazy-loaded chart
- Suspense
- Error Boundaries
- Development Performance Overlay

---

# 🏗 Architecture

```text
                WebSocket
                     │
                     ▼
          Connection Manager
                     │
                     ▼
              Zustand Store
             /      |      \
            ▼       ▼       ▼
      Watchlist   Chart   Performance
```

---

# 🔄 Data Flow

```text
WebSocket Message
        │
        ▼
Connection Manager
        │
        ▼
Batch Queue (100ms)
        │
        ▼
batchUpdateSymbols()
        │
        ▼
Zustand Store
        │
 ┌──────┴────────┐
 ▼               ▼
Watchlist     Trading Chart
```

---

# ⚡ Performance Optimizations

## 1. WebSocket Batching

Instead of updating the UI for every WebSocket message:

```
100 Messages

↓

100 React renders
```

Messages are batched every **100ms**.

```
100 Messages

↓

1 Store Update

↓

1 Render
```

Benefits

- Fewer renders
- Less CPU usage
- Smoother UI

---

## 2. Zustand Map Storage

Instead of

```ts
Symbol[]
```

The dashboard stores symbols as

```ts
Map<string, SymbolState>
```

Benefits

- O(1) lookup
- O(1) updates
- No array traversal

---

## 3. Selector-based Subscriptions

Each row subscribes only to its own symbol.

```ts
useMarketStore(state =>
    state.symbols.get(symbol)
)
```

Only the updated row re-renders.

---

## 4. Virtualized Watchlist

Uses

```
@tanstack/react-virtual
```

Rendering

Instead of

```
1000 DOM rows
```

Only renders

```
~20 visible rows
```

Benefits

- Constant DOM size
- Smooth scrolling
- Lower memory usage

---

## 5. Incremental Chart Updates

Historical data is stored in memory.

Each WebSocket tick only appends a single point.

Instead of

```
setData(500 points)
```

Uses

```
series.update(point)
```

Benefits

- No full chart redraw
- Minimal CPU usage

---

## 6. Lazy Loading

Heavy components are loaded only when needed.

Examples

- Trading Chart
- Performance Overlay

Benefits

- Smaller initial bundle
- Faster page load

---

## 7. Error Boundaries

Chart failures never crash the dashboard.

Uses

```
react-error-boundary
```

Benefits

- Isolated widget failures
- Better user experience

---

## 8. Performance Overlay

Development-only overlay displaying

- FPS
- Render count
- Memory usage
- Update frequency

Used for runtime profiling.

---

# 📊 Performance Results

| Optimization | Before | After |
|------------|---------|--------|
| WebSocket Updates | Every message | Batched |
| Store Updates | Per update | Batch updates |
| Watchlist | Entire list | Virtualized |
| Symbol Lookup | Array Search | O(1) Map |
| Chart Updates | Full redraw | Incremental |
| Bundle | Single large bundle | Code split |
| Errors | Whole page crash | Local recovery |

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite

## State Management

- Zustand

## Charts

- Lightweight Charts

## Styling

- Tailwind CSS
- shadcn/ui

## Performance

- TanStack Virtual
- React Error Boundary

## Tooling

- ESLint
- Prettier
- TypeScript

---

# 📂 Folder Structure

```
src
│
├── app
│
├── pages
│
├── widgets
│
│   ├── ChartPanel
│   ├── WatchlistPanel
│   └── Dashboard
│
├── shared
│
│   ├── websocket
│   ├── store
│   ├── hooks
│   ├── components
│   └── utils
│
├── entities
│
└── features
```

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/yourusername/marketops-dashboard.git
```

---

## Install

```bash
pnpm install
```

---

## Start

```bash
pnpm dev
```

---

## Build

```bash
pnpm build
```

---

# 📈 Future Improvements

- Candlestick chart support
- Order book
- Trade history
- Market depth visualization
- Multiple exchanges
- IndexedDB persistence
- Server-side historical replay
- Web Workers for analytics
- Authentication
- Theme customization

---

# 🎯 Key Engineering Decisions

## Why Zustand?

- Lightweight
- Selector-based subscriptions
- Minimal boilerplate
- Excellent performance

---

## Why WebSockets?

Financial dashboards require

- low latency
- push-based updates
- continuous streaming

Polling would introduce unnecessary requests and latency.

---

## Why Virtualization?

Only visible rows should exist in the DOM.

This keeps rendering constant even with thousands of symbols.

---

## Why Batch Updates?

WebSocket streams may deliver hundreds of updates per second.

Batching prevents excessive renders and improves UI responsiveness.

---

## Why Lightweight Charts?

Designed specifically for financial applications.

Benefits

- Fast rendering
- Small bundle
- Excellent performance

---

## Why React 19?

Leverages the React Compiler to automatically optimize many rendering patterns, reducing the need for manual memoization in most components while keeping the codebase simpler.

---

# 📚 What I Learned

This project helped me gain hands-on experience with

- High-frequency WebSocket data handling
- State management architecture
- Performance profiling
- React rendering optimization
- Virtualization
- Financial chart rendering
- Bundle optimization
- Error isolation
- Production-grade frontend architecture

---

# 🧪 Testing

The project includes testing for

- Store updates
- Error Boundary
- Component rendering
- Performance monitoring

More tests can be added for WebSocket integration and chart behavior.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Antariksh Alse**

Software Developer

GitHub: https://github.com/AntarikshAlse

LinkedIn: https://linkedin.com/in/antariksh-alse

Portfolio: https://antarikshalse.netlify.app