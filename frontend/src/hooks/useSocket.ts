'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Socket instance singleton
let socket: Socket | null = null;

const getSocketUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        // Remove /api from the end since WebSocket connects to root
        return process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    }
    return 'http://localhost:3001';
};

const getSocket = (): Socket => {
    if (!socket) {
        socket = io(getSocketUrl(), {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected:', socket?.id);
        });

        socket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
        });

        socket.on('connect_error', (error) => {
            console.log('[Socket] Connection error:', error.message);
        });
    }
    return socket;
};

export type SocketEvent =
    | 'transaction:change'
    | 'inventory:change'
    | 'product:change'
    | 'dashboard:change'
    | 'user:change';

interface UseSocketOptions {
    events: SocketEvent[];
    onEvent: () => void;
}

export function useSocket({ events, onEvent }: UseSocketOptions) {
    const onEventRef = useRef(onEvent);

    // Keep ref up to date
    useEffect(() => {
        onEventRef.current = onEvent;
    }, [onEvent]);

    useEffect(() => {
        const socket = getSocket();

        const handleEvent = () => {
            console.log('[Socket] Received event, triggering refresh');
            onEventRef.current();
        };

        // Subscribe to all specified events
        events.forEach((event) => {
            socket.on(event, handleEvent);
        });

        // Cleanup
        return () => {
            events.forEach((event) => {
                socket.off(event, handleEvent);
            });
        };
    }, [events]);
}

// Convenience hooks for specific pages
export function useTransactionSocket(onRefresh: () => void) {
    useSocket({
        events: ['transaction:change'],
        onEvent: onRefresh,
    });
}

export function useInventorySocket(onRefresh: () => void) {
    useSocket({
        events: ['inventory:change'],
        onEvent: onRefresh,
    });
}

export function useProductSocket(onRefresh: () => void) {
    useSocket({
        events: ['product:change'],
        onEvent: onRefresh,
    });
}

export function useDashboardSocket(onRefresh: () => void) {
    useSocket({
        events: ['dashboard:change', 'transaction:change', 'inventory:change'],
        onEvent: onRefresh,
    });
}

export function useUserSocket(onRefresh: () => void) {
    useSocket({
        events: ['user:change'],
        onEvent: onRefresh,
    });
}
