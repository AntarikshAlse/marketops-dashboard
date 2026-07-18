import type { ServerMessage } from './types';

export interface ConnectionEvents {
    open: () => void;

    close: () => void;

    reconnect: (
        attempt: number,
    ) => void;

    message: (
        message: ServerMessage,
    ) => void;

    error: (error: Event) => void;
}