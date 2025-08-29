import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "@/components/Hero";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("Hero", () => {
  test("renders heading text", async () => {
    render(<Hero />);
    expect(await screen.findByText(/READ/i)).toBeInTheDocument();
  });

  test("renders both images", () => {
    render(<Hero />);
    expect(screen.getByAltText(/backgroundimage/i)).toBeInTheDocument();
    expect(screen.getByAltText(/second background image/i)).toBeInTheDocument();
  });

  test("animation state toggles with timer", () => {
    render(<Hero />);
    const imgBox = screen.getByTestId("hero-imgbox");

    expect(imgBox).toHaveClass("imgbox");

    jest.advanceTimersByTime(3000);
    expect(imgBox).toHaveClass("animate");

    jest.advanceTimersByTime(3000);
    expect(imgBox).not.toHaveClass("animate");
  });

  test("clears interval on unmount", () => {
    const { unmount } = render(<Hero />);
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
