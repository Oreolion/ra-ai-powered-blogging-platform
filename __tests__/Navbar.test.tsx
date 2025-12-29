import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "@/components/Navbar";

// --- MOCKS START ---

// 1. Mock Next.js Navigation (usePathname is common in Navbars)
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn() }),
}));

// 2. Mock Convex Auth (If your Navbar shows login/user buttons)
jest.mock("convex/react", () => ({
  useQuery: jest.fn(() => null), // Return null user (logged out state)
  useConvexAuth: () => ({ isLoading: false, isAuthenticated: false }),
}));

// 3. Mock Next/Link (To avoid routing errors during click)
// We replace Link with a simple <a> tag to prevent test crashes
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// --- MOCKS END ---

describe("Navbar", () => {
  test("initial state: closed menu", () => {
    render(<Navbar />);
    // Hamburger is visible
    expect(screen.getByTestId("hamburger-icon")).toBeInTheDocument();
    
    // Check strict visibility or existence
    // If you use CSS to hide it (display:none), use .not.toBeVisible()
    // If you use conditional rendering {isOpen && ...}, use .not.toBeInTheDocument()
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
    
    // Note: If your mobile menu is "hidden" via CSS but still in DOM, this length check might fail.
    // Assuming conditional rendering here:
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(1);
  });

  test("opens mobile nav on hamburger click", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByTestId("hamburger-icon"));
    
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
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
      // We look for whatever button is currently available
      const openBtn = screen.queryByTestId("hamburger-icon");
      const closeBtn = screen.queryByTestId("close-icon");
      
      if (openBtn) fireEvent.click(openBtn);
      else if (closeBtn) fireEvent.click(closeBtn);
    }
    
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
  });
});