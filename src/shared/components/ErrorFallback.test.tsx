import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import userEvent from "@testing-library/user-event";

import { ErrorFallback } from "./ErrorFallback";

function BrokenComponent() {
  throw new Error("Chart crashed");
  return <></>
}

describe("ErrorFallback", () => {
    it("renders fallback UI", () => {
        render(
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
            >
                <BrokenComponent />
            </ErrorBoundary>
        );

        expect(
            screen.getByText("Something went wrong")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Chart crashed")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /retry/i,
            })
        ).toBeInTheDocument();
    });

    it("calls reset when retry is clicked", async () => {
        const user = userEvent.setup();

        const onReset = vi.fn();

        render(
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={onReset}
            >
                <BrokenComponent />
            </ErrorBoundary>
        );

        await user.click(
            screen.getByRole("button", {
                name: /retry/i,
            })
        );

        expect(onReset).toHaveBeenCalled();
    });
});
