// jest.setup.ts
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill TextEncoder / TextDecoder for Jest (Node <19 doesn’t have them globally)
Object.assign(global, { TextEncoder, TextDecoder });

// --- Mock Next.js Router ---
jest.mock("next/router", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
  }),
}));

// --- Mock next/link ---
// --- Mock next/link ---
jest.mock("next/link", () => {
  return ({ children, href, ...rest }) => {
    const resolvedHref = typeof href === "string" ? href : href.pathname;
    return (
      <a href={resolvedHref} {...rest}>
        {children}
      </a>
    );
  };
});

// --- Mock next/image ---
jest.mock("next/image", () => {
  return function NextImage({ src, alt, width, height, ...rest }) {
    return <img src={src} alt={alt} width={width} height={height} {...rest} />;
  };
});
