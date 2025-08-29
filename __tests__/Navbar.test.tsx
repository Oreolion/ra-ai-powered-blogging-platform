import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  test("initial state: closed menu", () => {
    render(<Navbar />);
    // Hamburger is visible
    expect(screen.getByTestId("hamburger-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
    // Only one "Home" link (desktop nav)
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(1);
  });

  test("opens mobile nav on hamburger click", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("hamburger-icon"));
    // Close icon now shown
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    // Mobile nav adds another "Home" link
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
  });

  test("closes mobile nav on close icon click", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("hamburger-icon")); // open
    fireEvent.click(screen.getByTestId("close-icon")); // close
    expect(screen.getByTestId("hamburger-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(1);
  });

  test("toggle multiple times ends in open state after odd clicks", () => {
    render(<Navbar />);
    for (let i = 0; i < 5; i++) {
      const button =
        screen.queryByTestId("hamburger-icon") || screen.getByTestId("close-icon");
      fireEvent.click(button);
    }
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
  });

  test("only one mobile nav exists when open", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("hamburger-icon")); // open
    fireEvent.click(screen.getByTestId("close-icon")); // close
    fireEvent.click(screen.getByTestId("hamburger-icon")); // open again
    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(2); // desktop + mobile
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
  });
});
