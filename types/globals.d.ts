export {};

// Create a type for the roles
export type Roles = "admin" | "coop";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
