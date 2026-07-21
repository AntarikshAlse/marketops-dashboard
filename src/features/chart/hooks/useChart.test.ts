import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useChart } from "./useChart";

const addSeries = vi.fn();
const remove = vi.fn();

vi.mock("lightweight-charts", () => {
    const setData = vi.fn();
    const update = vi.fn();

    return {
        ColorType: {
            Solid: "solid",
        },
        LineSeries: {},
        createChart: vi.fn(() => ({
            addSeries: vi.fn(() => ({
                setData,
                update,
            })),
            remove,
        })),
    };
});

describe("useChart", () => {
    it("creates chart", () => {
        const { result } = renderHook(() => useChart());

        const div = document.createElement("div");

        result.current.containerRef.current = div;

        expect(result.current).toBeDefined();
    });
});