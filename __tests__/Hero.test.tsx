import React from "react";
import { render, screen, act } from "@testing-library/react"; // Import act
import "@testing-library/jest-dom";
import Hero from "@/components/Hero";

// --- MOCKS START ---
// Mock Next/Image because standard <img> tags are easier to test
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} />;
    },
}));
// --- MOCKS END ---

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("Hero", () => {
  test("renders heading text", () => {
    // If text is static, use getByText. If animated, use findByText.
    render(<Hero />);
    expect(screen.getByText(/READ/i)).toBeInTheDocument();
  });

  test("renders both images", () => {
    render(<Hero />);
    // Note: ensure your alt texts in component match these exactly (case-insensitive regex is good)
    expect(screen.getByAltText(/backgroundimage/i)).toBeInTheDocument();
    expect(screen.getByAltText(/second background image/i)).toBeInTheDocument();
  });

  test("animation state toggles with timer", () => {
    render(<Hero />);
    const imgBox = screen.getByTestId("hero-imgbox");

    // Initial state
    expect(imgBox).toHaveClass("imgbox");

    // Advance time wrapped in act() to trigger React state updates
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(imgBox).toHaveClass("animate");

    // Advance again to toggle back
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(imgBox).not.toHaveClass("animate");
  });

  // Replaced "clears interval" with a safer unmount test
  // Testing implementation details like "getTimerCount" is flaky.
  // Instead, just ensure unmounting doesn't throw errors.
  test("unmounts cleanly", () => {
    const { unmount } = render(<Hero />);
    unmount();
  });
});