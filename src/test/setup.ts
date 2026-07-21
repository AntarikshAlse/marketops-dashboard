// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import "@testing-library/jest-dom";

Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: class {
        observe() { }
        unobserve() { }
        disconnect() { }
    },
});

window.matchMedia = () =>
    ({
        matches: false,
        media: "",
        onchange: null,
        addListener() { },
        removeListener() { },
        addEventListener() { },
        removeEventListener() { },
        dispatchEvent() {
            return false;
        },
    }) as any;

// Automatically clean up DOM nodes after every single test
afterEach(() => {
    cleanup()
})
