import { describe, expect, it } from "vitest";

const PROTECTED_ROUTES = ["/dashboard", "/configuracoes"];
const AUTH_ROUTES = ["/login", "/cadastro", "/esqueci-senha"];

function shouldRedirectToLogin(pathname: string, isAuthenticated: boolean): boolean {
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  return !isAuthenticated && isProtected;
}

function shouldRedirectToDashboard(pathname: string, isAuthenticated: boolean): boolean {
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  return isAuthenticated && isAuthRoute;
}

describe("auth route protection", () => {
  it("redirects unauthenticated users from dashboard to login", () => {
    expect(shouldRedirectToLogin("/dashboard", false)).toBe(true);
  });

  it("allows authenticated users on dashboard", () => {
    expect(shouldRedirectToLogin("/dashboard", true)).toBe(false);
  });

  it("redirects authenticated users away from login", () => {
    expect(shouldRedirectToDashboard("/login", true)).toBe(true);
  });

  it("allows unauthenticated users on login", () => {
    expect(shouldRedirectToDashboard("/login", false)).toBe(false);
  });
});
