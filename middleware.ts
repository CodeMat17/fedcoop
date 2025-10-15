import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isVerifiedCooperatorsRoute = createRouteMatcher([
  "/admin/verified-cooperators(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Redirect to sign-in if accessing admin routes without authentication
  if (isAdminRoute(req) && !userId) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  // Handle authenticated users accessing admin routes
  if (isAdminRoute(req) && userId) {
    const role = sessionClaims?.metadata?.role as string | undefined;

    // Admin can access all admin routes
    if (role === "admin") {
      return NextResponse.next();
    }

    // Coop users should only access verified-cooperators
    if (role === "coop") {
      if (isVerifiedCooperatorsRoute(req)) {
        return NextResponse.next();
      } else {
        const url = new URL("/admin/verified-cooperators", req.url);
        return NextResponse.redirect(url);
      }
    }

    // Users without admin or coop role are not permitted
    const url = new URL("/no-permission", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
