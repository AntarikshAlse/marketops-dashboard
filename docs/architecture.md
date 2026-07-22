
1. Architecture Diagram

```mermaid
flowchart LR

WS[Binance WebSocket]

CM[Connection Manager]

STORE[Zustand Store]

WATCH[Watchlist]

CHART[Trading Chart]

OVERLAY[Performance Overlay]

WS --> CM

CM --> STORE

STORE --> WATCH

STORE --> CHART

STORE --> OVERLAY
```

2. Performance Diagram

```mermaid
flowchart TD

A[WebSocket Message]

B[Connection Manager]

C[Batch Queue]

D[100ms Flush]

E[Zustand Batch Update]

F[Virtualized Watchlist]

G[Trading Chart]

A --> B

B --> C

C --> D

D --> E

E --> F

E --> G
```

3. Project Structure

src
│
├── app
│
├── pages
│
├── widgets
│
├── shared
│   ├── websocket
│   ├── store
│   ├── hooks
│   ├── components
│   └── utils
│
├── features
│
└── entities