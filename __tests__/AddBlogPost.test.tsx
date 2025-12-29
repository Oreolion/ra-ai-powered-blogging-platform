import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBlogPost from "@/components/AddBlogPost";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

// --- Mocks ---

// 1. Mock Next.js Navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// 2. Mock Convex
jest.mock("convex/react", () => ({
  useMutation: jest.fn(),
  api: {
    posts: {
      createPost: "createPost",
    },
  },
}));

// 3. Mock Toast
const mockToast = jest.fn();
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// 4. Mock UI Components (Select) - CRITICAL FIX
// We replace the complex Radix UI Select with a simple standard HTML select for testing
jest.mock("@/components/ui/select", () => ({
  Select: ({ onValueChange, children }: any) => (
    <div data-testid="mock-select-container">
      {/* We render a hidden native select to trigger changes easily */}
      <select
        data-testid="mock-select"
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">Select Category</option>
        {/* We map the children to extract values (simplified for test) */}
        <option value="Technology">Technology</option>
        <option value="Science">Science</option>
        <option value="Artificial Intelligence">Artificial Intelligence</option>
      </select>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => <div data-value={value}>{children}</div>,
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: () => <span>Select Value</span>,
}));

// 5. Mock Generator Components
jest.mock("@/components/GeneratePost", () => {
  return function MockGeneratePost({ setPostContent, setAudio }: any) {
    return (
      <div data-testid="generate-post-mock">
        <button
          type="button"
          onClick={() => {
            setPostContent("Generated AI Content");
            setAudio("mock-audio-url");
          }}
        >
          Simulate Generate Post
        </button>
      </div>
    );
  };
});

jest.mock("@/components/GenerateThumbnail", () => {
  return function MockGenerateThumbnail({ setImage }: any) {
    return (
      <div data-testid="generate-thumbnail-mock">
        <button
          type="button"
          onClick={() => setImage("mock-image-url")}
        >
          Simulate Generate Thumbnail
        </button>
      </div>
    );
  };
});

describe("AddBlogPost Component", () => {
  const mockCreatePost = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMutation as jest.Mock).mockReturnValue(mockCreatePost);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the form correctly", () => {
    render(<AddBlogPost />);
    expect(screen.getByText("Create post")).toBeInTheDocument();
  });

  it("allows selecting multiple categories and removing them", async () => {
    const user = userEvent.setup();
    render(<AddBlogPost />);

    // 1. Select "Technology" using our Mock Select
    const select = screen.getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "Technology" } });

    // 2. Verify Chip appears
    // Note: We use the data-testid we added to the Chip in the component previously
    expect(screen.getByTestId("category-chip-Technology")).toBeInTheDocument();

    // 3. Select "Science"
    fireEvent.change(select, { target: { value: "Science" } });

    // 4. Verify both Chips exist
    expect(screen.getByTestId("category-chip-Technology")).toBeInTheDocument();
    expect(screen.getByTestId("category-chip-Science")).toBeInTheDocument();

    // 5. Remove "Technology"
    const techChip = screen.getByTestId("category-chip-Technology");
    const closeIcon = techChip.querySelector('svg');
    if (closeIcon) await user.click(closeIcon);

    // 6. Verify Technology is gone, Science remains
    expect(screen.queryByTestId("category-chip-Technology")).not.toBeInTheDocument();
    expect(screen.getByTestId("category-chip-Science")).toBeInTheDocument();
  });

  it("submits the form with joined categories string when valid", async () => {
    const user = userEvent.setup();
    render(<AddBlogPost />);

    // 1. Fill Text Inputs
    await user.type(screen.getByLabelText(/Title/i), "My Test Title");
    await user.type(screen.getByLabelText(/Description/i), "My Test Description");

    // 2. Select Categories (Using Mock Select)
    const select = screen.getByTestId("mock-select");
    fireEvent.change(select, { target: { value: "Technology" } });
    fireEvent.change(select, { target: { value: "Artificial Intelligence" } });

    // Verify chips are there (Sanity check)
    expect(screen.getByTestId("category-chip-Technology")).toBeInTheDocument();
    expect(screen.getByTestId("category-chip-Artificial Intelligence")).toBeInTheDocument();

    // 3. Simulate Generators
    await user.click(screen.getByText("Simulate Generate Post"));
    await user.click(screen.getByText("Simulate Generate Thumbnail"));

    // 4. Submit
    const submitBtn = screen.getByText("Submit & Publish post");
    await user.click(submitBtn);

    // 5. Assertions
    await waitFor(() => {
        expect(mockCreatePost).toHaveBeenCalledTimes(1);
    });

    expect(mockCreatePost).toHaveBeenCalledWith(expect.objectContaining({
        postTitle: "My Test Title",
        postDescription: "My Test Description",
        postContent: "Generated AI Content",
        postCategory: "Technology, Artificial Intelligence", // Joined string
        imageUrl: "mock-image-url",
    }));

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});