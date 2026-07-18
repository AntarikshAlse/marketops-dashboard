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

            this.listeners.open?.();
        };

        this.socket.onmessage = (
            event,
        ) => {
            const message =
                JSON.parse(
                    event.data,
                ) as ServerMessage;

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