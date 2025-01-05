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
import type * as auth from "../auth.js";
import type * as blogs from "../blogs.js";
import type * as claude_generateBlogTags from "../claude/generateBlogTags.js";
import type * as claude_index from "../claude/index.js";
import type * as claude from "../claude.js";
import type * as files from "../files.js";
import type * as notes from "../notes.js";
import type * as projects from "../projects.js";
import type * as tagAssociations from "../tagAssociations.js";
import type * as tags from "../tags.js";
import type * as tagsClaudeRuns from "../tagsClaudeRuns.js";
import type * as tasks from "../tasks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blogs: typeof blogs;
  "claude/generateBlogTags": typeof claude_generateBlogTags;
  "claude/index": typeof claude_index;
  claude: typeof claude;
  files: typeof files;
  notes: typeof notes;
  projects: typeof projects;
  tagAssociations: typeof tagAssociations;
  tags: typeof tags;
  tagsClaudeRuns: typeof tagsClaudeRuns;
  tasks: typeof tasks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
