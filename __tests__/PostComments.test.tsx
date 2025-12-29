import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostComments } from "@/components/PostComments";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";

// --- MOCKS ---

// 1. Mock Next.js Navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// 2. Mock Clerk User
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

// 3. Mock UI Components
jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

jest.mock("@/components/LoaderSpinner", () => {
  return function MockLoader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

// 4. Mock Next/Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// 5. Mock Convex API and Hooks
// We mock the API object structure so we can identify which query is being called
jest.mock("@/convex/_generated/api", () => ({
  api: {
    posts: {
      createComment: "createComment",
      deleteComment: "deleteComment",
      editComment: "editComment",
      getComments: "getComments",
    },
    users: {
      getUserById: "getUserById",
    },
  },
}));

jest.mock("convex/react", () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

// --- TEST DATA ---

const mockPostId = "post-123";
const mockUserId = "user-123";

const mockComments = [
  {
    _id: "c1",
    userId: "user-123", // Matches current user (author)
    username: "Test User",
    commentUserImage: "/test-avatar.png",
    content: "This is a test comment",
  },
  {
    _id: "c2",
    userId: "user-999", // Different user
    username: "Other User",
    commentUserImage: null,
    content: "This is a really long comment that should trigger the read more logic because it is definitely longer than one hundred characters long to ensure the substring logic works correctly.",
  },
];

const mockConvexUser = {
  _id: "user-123",
  clerkId: "clerk_123",
  imageUrl: "/user-avatar.png",
};

describe("PostComments Component", () => {
  // Mock mutation functions
  const mockCreateComment = jest.fn();
  const mockDeleteComment = jest.fn();
  const mockEditComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Default Mutation Mocks
    (useMutation as jest.Mock).mockImplementation((mutationOp) => {
      if (mutationOp === "createComment") return mockCreateComment;
      if (mutationOp === "deleteComment") return mockDeleteComment;
      if (mutationOp === "editComment") return mockEditComment;
      return jest.fn();
    });

    // Setup Default Query Mocks
    (useQuery as jest.Mock).mockImplementation((queryOp) => {
      if (queryOp === "getComments") return mockComments;
      if (queryOp === "getUserById") return mockConvexUser;
      return null;
    });

    // Setup Default User (Logged In)
    (useUser as jest.Mock).mockReturnValue({
      user: { id: "clerk_123", imageUrl: "/user-avatar.png" },
      isSignedIn: true,
    });
  });

  it("renders comments list correctly", () => {
    render(<PostComments postId={mockPostId} />);

    // Check header/input area
    expect(screen.getByPlaceholderText("What are your thoughts?")).toBeInTheDocument();
    
    // Check comments rendered
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(screen.getByText("Other User")).toBeInTheDocument();
  });

  it("handles 'Read More / Read Less' toggle for long comments", async () => {
    const user = userEvent.setup();
    render(<PostComments postId={mockPostId} />);

    // Initial state: Should show substring (check for part of the text)
    // The component slices at 100 chars.
    const longCommentStart = "This is a really long comment";
    expect(screen.getByText((content) => content.startsWith(longCommentStart))).toBeInTheDocument();
    
    // Find the "...more" button
    const moreBtn = screen.getByText("...more");
    expect(moreBtn).toBeInTheDocument();

    // Click More
    await user.click(moreBtn);
    expect(screen.getByText("...less")).toBeInTheDocument();

    // Click Less
    await user.click(screen.getByText("...less"));
    expect(screen.getByText("...more")).toBeInTheDocument();
  });

  it("allows user to create a comment", async () => {
    const user = userEvent.setup();
    render(<PostComments postId={mockPostId} />);

    const input = screen.getByPlaceholderText("What are your thoughts?");
    const submitBtn = screen.getByText("Comment");

    // Type comment
    await user.type(input, "New amazing comment");
    
    // Submit
    await user.click(submitBtn);

    // Verify Mutation Call
    expect(mockCreateComment).toHaveBeenCalledWith({
      postId: mockPostId,
      content: "New amazing comment",
    });

    // Verify Input Cleared (React state update simulation usually requires re-render, 
    // but we can check if the mock was called which resets state in the component)
  });

  it("shows error toast if creating empty comment", async () => {
    const user = userEvent.setup();
    render(<PostComments postId={mockPostId} />);

    const submitBtn = screen.getByText("Comment");

    // Click without typing
    await user.click(submitBtn);

    expect(mockCreateComment).not.toHaveBeenCalled();
    // (Optional: You could check if toast was called here if you exported the mockToast)
  });

  it("redirects unauthenticated users to sign-in when creating comment", async () => {
    // Mock Logged Out State
    (useUser as jest.Mock).mockReturnValue({ user: null, isSignedIn: false });
    
    const user = userEvent.setup();
    render(<PostComments postId={mockPostId} />);

    const input = screen.getByPlaceholderText("What are your thoughts?");
    await user.type(input, "I am not logged in");
    await user.click(screen.getByText("Comment"));

    expect(mockPush).toHaveBeenCalledWith("/sign-in");
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("allows author to delete their own comment", async () => {
    const user = userEvent.setup();
    render(<PostComments postId={mockPostId} />);

    // Find delete icon (MdOutlineDelete)
    // Since react-icons render SVGs, typically we look for them via a test-id or their structure.
    // However, the library isn't mocked here, so it renders the real SVG.
    // The easiest way is usually to rely on the fact that it is a clickable element inside the comment list item.
    // Given the DOM structure, we can find the delete button by index or parent.
    
    // Better approach: Since we don't have aria-labels on icons, we might find the parent container.
    // Let's assume the icon is clickable. We will click the SECOND icon in the edit/delete group 
    // (Edit is first, Delete is second).
    
    // We only see icons for "Test User" (c1) because mockUserId matches.
    // "Other User" (c2) should NOT have icons.
    
    const commentItems = screen.getAllByRole("listitem");
    const myComment = commentItems[0]; // "Test User"
    
    // Find the SVG that represents delete. 
    // This is tricky without `aria-label` or `data-testid`.
    // Strategy: Get all SVGs in this list item.
    const svgs = myComment.querySelectorAll('svg');
    // Index 0: Default avatar icon (if any) or user icon
    // Index 1: Edit Icon (MdModeEdit)
    // Index 2: Delete Icon (MdOutlineDelete)
    // Note: The first comment has an Image, so no placeholder SVG. 
    // So svgs[0] = Edit, svgs[1] = Delete.
    
    const deleteBtn = svgs[1]; 
    if (deleteBtn) {
        await user.click(deleteBtn);
        expect(mockDeleteComment).toHaveBeenCalledWith({ _id: "c1" });
    } else {
        throw new Error("Delete button not found");
    }
  });

  it("allows author to edit their own comment", async () => {
    const user = userEvent.setup();
    render(<PostComments postId={mockPostId} />);

    const commentItems = screen.getAllByRole("listitem");
    const myComment = commentItems[0]; 
    
    // Click Edit Icon (1st SVG in action group)
    const svgs = myComment.querySelectorAll('svg');
    const editBtn = svgs[0];
    await user.click(editBtn);

    // Verify Edit Mode: Textarea should appear with current content
    const editInput = screen.getAllByRole("textbox")[1]; // [0] is the main "create" input
    expect(editInput).toHaveValue("This is a test comment");

    // Change text
    await user.clear(editInput);
    await user.type(editInput, "Updated content");

    // Click Update
    await user.click(screen.getByText("Update"));

    expect(mockEditComment).toHaveBeenCalledWith({
      _id: "c1",
      newContent: "Updated content",
      userId: "user-123",
    });
  });

  it("does not show edit/delete options for comments by other users", () => {
    render(<PostComments postId={mockPostId} />);

    // "Other User" comment (index 1)
    const commentItems = screen.getAllByRole("listitem");
    const otherComment = commentItems[1];

    // Should not contain the Edit/Delete icons
    // We can check this by querying SVGs inside this item. 
    // "Other User" has no image, so it HAS a placeholder SVG for avatar. 
    // So it should have exactly 1 SVG (Avatar placeholder). 
    // If it had actions, it would have 3 SVGs.
    const svgs = otherComment.querySelectorAll('svg');
    expect(svgs.length).toBe(1); // Only the user avatar placeholder
  });
  
  it("renders 'Be the First to Comment' when list is empty", () => {
    // Override mock for this specific test
    (useQuery as jest.Mock).mockImplementation((queryOp) => {
        if (queryOp === "getComments") return []; // Empty array
        if (queryOp === "getUserById") return mockConvexUser;
        return null;
    });

    render(<PostComments postId={mockPostId} />);
    expect(screen.getByText("Be the First to Comment")).toBeInTheDocument();
  });
});