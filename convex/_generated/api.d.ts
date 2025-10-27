/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as cooperatives from "../cooperatives.js";
import type * as excos from "../excos.js";
import type * as files from "../files.js";
import type * as gallery from "../gallery.js";
import type * as hero from "../hero.js";
import type * as members from "../members.js";
import type * as missionVision from "../missionVision.js";
import type * as news from "../news.js";
import type * as ourRole from "../ourRole.js";
import type * as registration from "../registration.js";
import type * as testimonials from "../testimonials.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cooperatives: typeof cooperatives;
  excos: typeof excos;
  files: typeof files;
  gallery: typeof gallery;
  hero: typeof hero;
  members: typeof members;
  missionVision: typeof missionVision;
  news: typeof news;
  ourRole: typeof ourRole;
  registration: typeof registration;
  testimonials: typeof testimonials;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
