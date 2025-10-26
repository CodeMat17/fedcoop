import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);


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

    // Only admin role can access admin routes
    if (role === "admin") {
      return NextResponse.next();
    }

    // Any other role (including undefined, 'coop', or any other value) gets access denied
    const url = new URL("/access-denied", req.url);
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
