import { useMarketStore } from '../store/marketStore';
import type {
    ConnectionEvents,
} from './events';

import type {
    ServerMessage,
} from './types';

const MAX_BACKOFF = 30000;

export class ConnectionManager {
    private socket?: WebSocket;
    private reconnectAttempt = 0;
    private listeners: Partial<ConnectionEvents> =
        {};
    connect(url: string) {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            this.reconnectAttempt = 0;
            useMarketStore
                .getState()
                .setConnectionStatus(
                    'connected',
                );
            this.listeners.open?.();
        };
        this.socket.onmessage = (
            event,
        ) => {
            const message =
                JSON.parse(
                    event.data,
                ) as ServerMessage;
            switch (message.type) {
                case 'snapshot':
                    useMarketStore
                        .getState()
                        .setSnapshot(
                            message.payload
                                .symbols,
                        );
                    break;
                case 'update':
                    useMarketStore
                        .getState()
                        .updateSymbols(
                            message.payload
                                .updates,
                        );
                    break;
                case 'heartbeat':
                    useMarketStore
                        .getState()
                        .setHeartbeat(
                            message.payload,
                        );
                    break;
            }
            this.listeners.message?.(
                message,
            );

        };
        this.socket.onerror = (
            error,
        ) => {
            this.listeners.error?.(
                error,
            );
        };
        this.socket.onclose = () => {
            this.listeners.close?.();
            useMarketStore
                .getState()
                .setConnectionStatus(
                    'disconnected',
                );
            this.reconnect();
        };
    }
    disconnect() {
        this.socket?.close();
    }
    send(data: unknown) {
        if (
            this.socket?.readyState !==
            WebSocket.OPEN
        )
            return;
        this.socket.send(
            JSON.stringify(data),
        );
    }
    on(
        events: Partial<ConnectionEvents>,
    ) {
        this.listeners = {
            ...this.listeners,
            ...events,
        };
    }
    private reconnect() {
        this.reconnectAttempt++;
        this.listeners.reconnect?.(
            this.reconnectAttempt,
        );
        const delay = Math.min(
            1000 *
            2 **
            this
                .reconnectAttempt,
            MAX_BACKOFF,
        );
        setTimeout(() => {
            this.connect(
                import.meta.env
                    .VITE_WS_URL,
            );
        }, delay);
    }
}