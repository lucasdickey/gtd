## Projects/Roadmap:

1. SHIPPED: Deployed basic NextJS + Convex app to Vercel
2. SHIPPED: JJ's podcast made with NotebookLM, ChatGPT with web search, Eleven Labs, and Udio on AI front
3. SHIPPED: Image file uploader
4. SHIPPED: CMS for Project page
5. STARTED: CMS for personal notes intake
6. STARTED: RAG project
7. CMS for Blog page

- Shopify store via headless ecommm API to sell A-OK gear
- 1-off episode summarizer & transcripts (requires user enter own AssemblyAI and Claude API keys -- pass through, don't store)
- RAG-based text chat "with Lucas"
- RAG-based voice chat "with Lucas" - https://elevenlabs.io/docs/api-reference/conversational-ai or via OpenAI
- Turn JJ podcast workflow into simple web UI so anyone can generate the base podcast (sans music beds)
- Real-time Web Search / Computer Use with RAG for simple 6-company comparison tool

# Cursor Systems Prmompt for this Project:

Please put your explainer and reasoning up front, prior to the code generation.

# Project Context Instructions for Cursor Assistant

Before providing any suggestions or code completions, please be aware of the following project context and technical considerations:

Be mindful of these architectural patterns and principles:

#Next.js App Router Patterns:
Server and Client Components
Data Fetching and Caching
Route Handlers and Middleware
Layout and Page architecture
Loading and Error UI patterns

#Convex Key Concepts:
Optimistic Updates
Real-time Subscriptions
Database Schema Design
Query and Mutation patterns
File Storage patterns
Backend Functions

#TypeScript Best Practices:
Strict Mode patterns
Module architecture
Type inference and narrowing
Utility types usage
Generic patterns

## Project Stack

- Next.js (with App Router based on directory structure)
- Convex as backend/database
- TypeScript
- Tailwind CSS for styling
- React (latest version)
- Clerk (for authentication based on dependencies)
- shadcn/ui components
- Zod for validation
- React Hook Form for form management
- Claude API integration for LLM functionality
- AWS S3 for file storage
- Tailwind CSS for all styling (no CSS modules or styled-components)
- Tiptap library for markdown in admin UI

## Type System Considerations

1. Consider multiple type systems in play:

   - TypeScript types
   - Convex's generated types from schema
   - Zod schema types
   - React prop types
   - EcmaScript built-in types
   - Next.js specific types
   - Clerk auth types
   - shadcn/ui component types
   - Claude API types for LLM responses
   - AWS SDK types for S3 operations

2. When suggesting code:
   - Prefer TypeScript's built-in utility types where applicable
   - Use Convex's generated types from \_generated directory for database operations
   - Utilize Zod's infer utility for form schemas
   - Leverage React.FC for functional components with explicit prop types
   - Consider Next.js specific types for routing and server components
   - Implement proper typing for Claude API responses
   - Use AWS SDK v3 types for S3 operations

## File Structure Awareness

- Maintain separation between client and server code per Convex requirements
- Respect Next.js 13+ app directory conventions
- Keep types in appropriate locations:
  - Convex schemas in convex/schema.ts
  - React component props in component files
  - Shared types in src/types directory
  - API route types in appropriate route handlers
  - LLM-related types in dedicated type files
  - S3 operation types in appropriate utility files

## Styling Guidelines

1. Tailwind CSS:

   - Use Tailwind CSS exclusively for styling
   - Follow utility-first CSS patterns
   - Utilize Tailwind's configuration for custom values
   - Implement responsive design using Tailwind breakpoints
   - Use Tailwind's built-in dark mode utilities
   - Maintain consistency with shadcn/ui component styling

2. Component Styling:
   - No CSS modules or styled-components
   - Use Tailwind's @apply directives sparingly
   - Implement proper responsive design patterns
   - Follow project's color scheme and design system
   - Maintain accessibility standards in styling

## Best Practices

1. TypeScript:

   - Use strict mode compliance
   - Implement proper type narrowing
   - Avoid type assertions unless absolutely necessary
   - Utilize discriminated unions where appropriate
   - Properly handle nullable and undefined values

2. React + Next.js:

   - Consider server vs client components
   - Use proper data fetching patterns (Convex hooks)
   - Implement proper error boundaries
   - Handle loading states appropriately
   - Follow React Server Components conventions

3. Convex:

   - Follow mutation vs query patterns
   - Implement proper pagination where needed
   - Use optimistic updates when appropriate
   - Handle real-time subscriptions correctly
   - Properly type database schemas

4. Forms and Validation:

   - Coordinate between Zod schemas and TypeScript types
   - Implement proper form validation with React Hook Form
   - Handle error states and user feedback
   - Maintain type safety between form data and API endpoints

5. Claude API Integration:

   - Implement proper error handling for API calls
   - Handle rate limiting appropriately
   - Maintain type safety for API responses
   - Implement proper retry logic
   - Cache responses when appropriate

6. AWS S3 Operations:
   - Follow AWS best practices for file uploads/downloads
   - Implement proper error handling
   - Use pre-signed URLs when appropriate
   - Handle file type validation
   - Implement proper file size limitations

## Component Structure

When suggesting component code:

1. Use proper shadcn/ui component imports
2. Implement Tailwind CSS patterns consistently
3. Follow TypeScript best practices for props and state
4. Consider accessibility requirements
5. Handle proper error boundaries and loading states
6. Implement proper file upload/download UI when working with S3
7. Handle LLM response states appropriately

## Security Considerations

1. Implement proper Clerk authentication checks
2. Use appropriate Convex access controls
3. Validate all user inputs with Zod
4. Handle sensitive data appropriately
5. Implement proper CSRF protection
6. Secure file uploads to S3
7. Validate and sanitize LLM responses

## Performance Considerations

1. Implement proper code splitting
2. Use appropriate React hooks for performance
3. Consider proper caching strategies with Convex
4. Optimize image loading with Next.js Image component
5. Implement proper bundling strategies
6. Cache Claude API responses when appropriate
7. Optimize S3 file transfers

## Error Handling

1. Implement proper error boundaries
2. Handle Convex query/mutation errors appropriately
3. Provide proper user feedback
4. Log errors appropriately
5. Handle form validation errors properly
6. Manage Claude API error states
7. Handle S3 operation failures

## Testing Considerations

When suggesting testable code:

1. Make components easily testable
2. Consider mocking Convex queries/mutations
3. Handle proper type mocking
4. Implement proper test utilities
5. Consider proper test coverage
6. Mock Claude API responses appropriately
7. Mock S3 operations for testing

Remember to consider these contexts when providing suggestions, completions, or answering questions about the codebase. Always aim to maintain type safety across the full stack while following best practices for each technology in use. Ensure all styling is done through Tailwind CSS, all file operations go through S3, and LLM functionality uses the Claude API appropriately.

Please bear in mind this current file structure:
.
.
├── Makefile
├── ParentComponent.tsx
├── README.md
├── components.json
├── convex
│   ├── README.md
│   ├── \_generated
│   ├── blogs.ts
│   ├── files.ts
│   ├── notes.ts
│   ├── projects.ts
│   ├── schema.ts
│   ├── tasks.ts
│   └── tsconfig.json
├── next-env.d.ts
├── next.config.js
├── next.config.mjs
├── node_modules
│   ├── @alloc
│   ├── @ampproject
│   ├── @antfu
│   ├── @anthropic-ai
│   ├── @aws-crypto
│   ├── @aws-sdk
│   ├── @babel
│   ├── @clerk
│   ├── @corex
│   ├── @cspotcode
│   ├── @esbuild
│   ├── @eslint
│   ├── @eslint-community
│   ├── @humanwhocodes
│   ├── @isaacs
│   ├── @jridgewell
│   ├── @langchain
│   ├── @next
│   ├── @nodelib
│   ├── @nolyfill
│   ├── @pinecone-database
│   ├── @pkgjs
│   ├── @popperjs
│   ├── @radix-ui
│   ├── @remirror
│   ├── @rtsao
│   ├── @rushstack
│   ├── @sinclair
│   ├── @smithy
│   ├── @swc
│   ├── @tailwindcss
│   ├── @tiptap
│   ├── @ts-morph
│   ├── @tsconfig
│   ├── @types
│   ├── @typescript-eslint
│   ├── @ungap
│   ├── acorn
│   ├── acorn-jsx
│   ├── agent-base
│   ├── ajv
│   ├── ansi-escapes
│   ├── ansi-regex
│   ├── ansi-styles
│   ├── any-promise
│   ├── anymatch
│   ├── arg
│   ├── argparse
│   ├── aria-query
│   ├── array-buffer-byte-length
│   ├── array-includes
│   ├── array-union
│   ├── array.prototype.findlast
│   ├── array.prototype.findlastindex
│   ├── array.prototype.flat
│   ├── array.prototype.flatmap
│   ├── array.prototype.tosorted
│   ├── arraybuffer.prototype.slice
│   ├── ast-types
│   ├── ast-types-flow
│   ├── autoprefixer
│   ├── available-typed-arrays
│   ├── axe-core
│   ├── axobject-query
│   ├── bail
│   ├── balanced-match
│   ├── base64-js
│   ├── binary-extensions
│   ├── bl
│   ├── bowser
│   ├── brace-expansion
│   ├── braces
│   ├── browserslist
│   ├── buffer
│   ├── busboy
│   ├── call-bind
│   ├── callsites
│   ├── camelcase-css
│   ├── caniuse-lite
│   ├── ccount
│   ├── chalk
│   ├── character-entities
│   ├── character-entities-html4
│   ├── character-entities-legacy
│   ├── character-reference-invalid
│   ├── chokidar
│   ├── class-variance-authority
│   ├── cli-cursor
│   ├── cli-spinners
│   ├── cli-truncate
│   ├── client-only
│   ├── clone
│   ├── clsx
│   ├── code-block-writer
│   ├── color-convert
│   ├── color-name
│   ├── colorette
│   ├── comma-separated-tokens
│   ├── commander
│   ├── concat-map
│   ├── convert-source-map
│   ├── convex
│   ├── cosmiconfig
│   ├── crelt
│   ├── cross-spawn
│   ├── cssesc
│   ├── csstype
│   ├── damerau-levenshtein
│   ├── data-uri-to-buffer
│   ├── data-view-buffer
│   ├── data-view-byte-length
│   ├── data-view-byte-offset
│   ├── debug
│   ├── decode-named-character-reference
│   ├── deep-is
│   ├── defaults
│   ├── define-data-property
│   ├── define-properties
│   ├── dequal
│   ├── devlop
│   ├── didyoumean
│   ├── diff
│   ├── dir-glob
│   ├── dlv
│   ├── doctrine
│   ├── eastasianwidth
│   ├── electron-to-chromium
│   ├── emoji-regex
│   ├── enhanced-resolve
│   ├── entities
│   ├── environment
│   ├── error-ex
│   ├── es-abstract
│   ├── es-define-property
│   ├── es-errors
│   ├── es-iterator-helpers
│   ├── es-object-atoms
│   ├── es-set-tostringtag
│   ├── es-shim-unscopables
│   ├── es-to-primitive
│   ├── esbuild
│   ├── escalade
│   ├── escape-string-regexp
│   ├── eslint
│   ├── eslint-config-next
│   ├── eslint-import-resolver-node
│   ├── eslint-import-resolver-typescript
│   ├── eslint-module-utils
│   ├── eslint-plugin-import
│   ├── eslint-plugin-jsx-a11y
│   ├── eslint-plugin-react
│   ├── eslint-plugin-react-hooks
│   ├── eslint-scope
│   ├── eslint-visitor-keys
│   ├── espree
│   ├── esprima
│   ├── esquery
│   ├── esrecurse
│   ├── estraverse
│   ├── estree-util-is-identifier-name
│   ├── esutils
│   ├── eventemitter3
│   ├── execa
│   ├── extend
│   ├── fast-deep-equal
│   ├── fast-glob
│   ├── fast-json-stable-stringify
│   ├── fast-levenshtein
│   ├── fast-xml-parser
│   ├── fastq
│   ├── fetch-blob
│   ├── file-entry-cache
│   ├── fill-range
│   ├── find-up
│   ├── flat-cache
│   ├── flatted
│   ├── for-each
│   ├── foreground-child
│   ├── formdata-polyfill
│   ├── fraction.js
│   ├── framer-motion
│   ├── fs-extra
│   ├── fs.realpath
│   ├── fsevents
│   ├── function-bind
│   ├── function.prototype.name
│   ├── functions-have-names
│   ├── gensync
│   ├── get-east-asian-width
│   ├── get-intrinsic
│   ├── get-stream
│   ├── get-symbol-description
│   ├── get-tsconfig
│   ├── glob
│   ├── glob-parent
│   ├── globals
│   ├── globalthis
│   ├── globby
│   ├── gopd
│   ├── graceful-fs
│   ├── graphemer
│   ├── has-bigints
│   ├── has-flag
│   ├── has-property-descriptors
│   ├── has-proto
│   ├── has-symbols
│   ├── has-tostringtag
│   ├── hasown
│   ├── hast-util-to-jsx-runtime
│   ├── hast-util-whitespace
│   ├── html-url-attributes
│   ├── https-proxy-agent
│   ├── human-signals
│   ├── husky
│   ├── ieee754
│   ├── ignore
│   ├── import-fresh
│   ├── imurmurhash
│   ├── inflight
│   ├── inherits
│   ├── inline-style-parser
│   ├── internal-slot
│   ├── is-alphabetical
│   ├── is-alphanumerical
│   ├── is-array-buffer
│   ├── is-arrayish
│   ├── is-async-function
│   ├── is-bigint
│   ├── is-binary-path
│   ├── is-boolean-object
│   ├── is-bun-module
│   ├── is-callable
│   ├── is-core-module
│   ├── is-data-view
│   ├── is-date-object
│   ├── is-decimal
│   ├── is-extglob
│   ├── is-finalizationregistry
│   ├── is-fullwidth-code-point
│   ├── is-generator-function
│   ├── is-glob
│   ├── is-hexadecimal
│   ├── is-interactive
│   ├── is-map
│   ├── is-negative-zero
│   ├── is-number
│   ├── is-number-object
│   ├── is-path-inside
│   ├── is-plain-obj
│   ├── is-regex
│   ├── is-set
│   ├── is-shared-array-buffer
│   ├── is-stream
│   ├── is-string
│   ├── is-symbol
│   ├── is-typed-array
│   ├── is-unicode-supported
│   ├── is-weakmap
│   ├── is-weakref
│   ├── is-weakset
│   ├── isarray
│   ├── isexe
│   ├── iterator.prototype
│   ├── jackspeak
│   ├── jiti
│   ├── js-tokens
│   ├── js-yaml
│   ├── jsesc
│   ├── json-buffer
│   ├── json-parse-even-better-errors
│   ├── json-schema-traverse
│   ├── json-stable-stringify-without-jsonify
│   ├── json5
│   ├── jsonfile
│   ├── jsx-ast-utils
│   ├── jwt-decode
│   ├── keyv
│   ├── kleur
│   ├── language-subtag-registry
│   ├── language-tags
│   ├── levn
│   ├── lilconfig
│   ├── lines-and-columns
│   ├── linkify-it
│   ├── linkifyjs
│   ├── lint-staged
│   ├── listr2
│   ├── locate-path
│   ├── lodash.\_reinterpolate
│   ├── lodash.castarray
│   ├── lodash.isplainobject
│   ├── lodash.merge
│   ├── lodash.template
│   ├── lodash.templatesettings
│   ├── log-symbols
│   ├── log-update
│   ├── longest-streak
│   ├── loose-envify
│   ├── lru-cache
│   ├── lucide-react
│   ├── markdown-it
│   ├── mdast-util-from-markdown
│   ├── mdast-util-mdx-expression
│   ├── mdast-util-mdx-jsx
│   ├── mdast-util-mdxjs-esm
│   ├── mdast-util-phrasing
│   ├── mdast-util-to-hast
│   ├── mdast-util-to-markdown
│   ├── mdast-util-to-string
│   ├── mdurl
│   ├── merge-stream
│   ├── merge2
│   ├── micromark
│   ├── micromark-core-commonmark
│   ├── micromark-factory-destination
│   ├── micromark-factory-label
│   ├── micromark-factory-space
│   ├── micromark-factory-title
│   ├── micromark-factory-whitespace
│   ├── micromark-util-character
│   ├── micromark-util-chunked
│   ├── micromark-util-classify-character
│   ├── micromark-util-combine-extensions
│   ├── micromark-util-decode-numeric-character-reference
│   ├── micromark-util-decode-string
│   ├── micromark-util-encode
│   ├── micromark-util-html-tag-name
│   ├── micromark-util-normalize-identifier
│   ├── micromark-util-resolve-all
│   ├── micromark-util-sanitize-uri
│   ├── micromark-util-subtokenize
│   ├── micromark-util-symbol
│   ├── micromark-util-types
│   ├── micromatch
│   ├── mimic-fn
│   ├── mimic-function
│   ├── minimatch
│   ├── minimist
│   ├── minipass
│   ├── mkdirp
│   ├── ms
│   ├── mz
│   ├── nanoid
│   ├── natural-compare
│   ├── next
│   ├── next-sitemap
│   ├── node-domexception
│   ├── node-fetch
│   ├── node-releases
│   ├── normalize-path
│   ├── normalize-range
│   ├── npm-run-path
│   ├── object-assign
│   ├── object-hash
│   ├── object-inspect
│   ├── object-keys
│   ├── object.assign
│   ├── object.entries
│   ├── object.fromentries
│   ├── object.groupby
│   ├── object.values
│   ├── once
│   ├── onetime
│   ├── optionator
│   ├── ora
│   ├── orderedmap
│   ├── p-limit
│   ├── p-locate
│   ├── parent-module
│   ├── parse-entities
│   ├── parse-json
│   ├── path-browserify
│   ├── path-exists
│   ├── path-is-absolute
│   ├── path-key
│   ├── path-parse
│   ├── path-scurry
│   ├── path-type
│   ├── picocolors
│   ├── picomatch
│   ├── pidtree
│   ├── pify
│   ├── pirates
│   ├── possible-typed-array-names
│   ├── postcss
│   ├── postcss-import
│   ├── postcss-js
│   ├── postcss-load-config
│   ├── postcss-nested
│   ├── postcss-selector-parser
│   ├── postcss-value-parser
│   ├── prelude-ls
│   ├── prettier
│   ├── prompts
│   ├── prop-types
│   ├── property-information
│   ├── prosemirror-changeset
│   ├── prosemirror-collab
│   ├── prosemirror-commands
│   ├── prosemirror-dropcursor
│   ├── prosemirror-gapcursor
│   ├── prosemirror-history
│   ├── prosemirror-inputrules
│   ├── prosemirror-keymap
│   ├── prosemirror-markdown
│   ├── prosemirror-menu
│   ├── prosemirror-model
│   ├── prosemirror-schema-basic
│   ├── prosemirror-schema-list
│   ├── prosemirror-state
│   ├── prosemirror-tables
│   ├── prosemirror-trailing-node
│   ├── prosemirror-transform
│   ├── prosemirror-view
│   ├── punycode
│   ├── punycode.js
│   ├── queue-microtask
│   ├── react
│   ├── react-dom
│   ├── react-hook-form
│   ├── react-is
│   ├── react-markdown
│   ├── read-cache
│   ├── readable-stream
│   ├── readdirp
│   ├── recast
│   ├── reflect.getprototypeof
│   ├── regexp.prototype.flags
│   ├── remark-parse
│   ├── remark-rehype
│   ├── resolve
│   ├── resolve-from
│   ├── resolve-pkg-maps
│   ├── restore-cursor
│   ├── reusify
│   ├── rfdc
│   ├── rimraf
│   ├── rope-sequence
│   ├── run-parallel
│   ├── safe-array-concat
│   ├── safe-buffer
│   ├── safe-regex-test
│   ├── scheduler
│   ├── semver
│   ├── set-function-length
│   ├── set-function-name
│   ├── shadcn-ui
│   ├── shebang-command
│   ├── shebang-regex
│   ├── side-channel
│   ├── signal-exit
│   ├── sisteransi
│   ├── slash
│   ├── slice-ansi
│   ├── source-map
│   ├── source-map-js
│   ├── space-separated-tokens
│   ├── stdin-discarder
│   ├── streamsearch
│   ├── string-argv
│   ├── string-width
│   ├── string-width-cjs
│   ├── string.prototype.includes
│   ├── string.prototype.matchall
│   ├── string.prototype.repeat
│   ├── string.prototype.trim
│   ├── string.prototype.trimend
│   ├── string.prototype.trimstart
│   ├── string_decoder
│   ├── stringify-entities
│   ├── strip-ansi
│   ├── strip-ansi-cjs
│   ├── strip-bom
│   ├── strip-final-newline
│   ├── strip-json-comments
│   ├── strnum
│   ├── style-to-object
│   ├── styled-jsx
│   ├── sucrase
│   ├── supports-color
│   ├── supports-preserve-symlinks-flag
│   ├── tailwind-merge
│   ├── tailwindcss
│   ├── tailwindcss-animate
│   ├── tailwindcss-motion
│   ├── tapable
│   ├── text-table
│   ├── thenify
│   ├── thenify-all
│   ├── tiny-invariant
│   ├── tippy.js
│   ├── to-regex-range
│   ├── trim-lines
│   ├── trough
│   ├── ts-api-utils
│   ├── ts-interface-checker
│   ├── ts-morph
│   ├── tsconfig-paths
│   ├── tslib
│   ├── type-check
│   ├── type-fest
│   ├── typed-array-buffer
│   ├── typed-array-byte-length
│   ├── typed-array-byte-offset
│   ├── typed-array-length
│   ├── typescript
│   ├── uc.micro
│   ├── unbox-primitive
│   ├── undici-types
│   ├── unified
│   ├── unist-util-is
│   ├── unist-util-position
│   ├── unist-util-stringify-position
│   ├── unist-util-visit
│   ├── unist-util-visit-parents
│   ├── universalify
│   ├── update-browserslist-db
│   ├── uri-js
│   ├── use-sync-external-store
│   ├── util-deprecate
│   ├── uuid
│   ├── vfile
│   ├── vfile-message
│   ├── w3c-keyname
│   ├── wcwidth
│   ├── web-streams-polyfill
│   ├── which
│   ├── which-boxed-primitive
│   ├── which-builtin-type
│   ├── which-collection
│   ├── which-typed-array
│   ├── word-wrap
│   ├── wrap-ansi
│   ├── wrap-ansi-cjs
│   ├── wrappy
│   ├── yallist
│   ├── yaml
│   ├── yocto-queue
│   ├── zod
│   └── zwitch
├── package-lock.json
├── package.json
├── pages
│   └── \_app.js
├── postcss.config.js
├── postcss.config.mjs
├── public
│   ├── a-ok-face.png
│   ├── a-ok-face.svg
│   ├── a-okay-monkey-1.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── projectOne.jpg
│   ├── projectTwoJJPod.jpg
│   ├── robots.txt
│   ├── site.webmanifest
│   ├── sitemap.xml
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   ├── components
│   ├── lib
│   ├── middleware.ts
│   └── utils
├── tailwind.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json

551 directories, 45 files

# Testing

## Overview

The project uses a comprehensive testing strategy with multiple layers:

- Unit tests with Vitest
- Integration tests for Convex functions
- End-to-end tests with Playwright

## Running Tests

```bash
# Run all tests
npm run test

# Run only unit tests
npm run test:unit

# Run only end-to-end tests
npm run test:e2e

# Generate test coverage report
npm run test:coverage
```

## Test Structure

### Unit Tests (`/tests/unit/`)

- `claude/tagGeneration.test.ts`: Tests for Claude API integration and tag generation logic

  - Validates successful tag generation
  - Tests retry mechanism for malformed JSON responses
  - Verifies error handling after max retries

- `tags/tagAssociations.test.ts`: Tests for tag association management
  - Tests creating new tag associations
  - Validates updating existing associations
  - Tests retrieving tags for blog posts

### End-to-End Tests (`/tests/e2e/`)

- `blog.spec.ts`: Tests the complete blog post and tag generation flow
  - Tests admin authentication
  - Validates blog post creation
  - Verifies automatic tag generation
  - Checks tag display on the blog page

## Test Configuration

- Vitest configuration in `vitest.config.ts`

  - Uses jsdom for DOM environment
  - Configured with React testing utilities
  - Coverage reporting enabled

- Playwright configuration in `playwright.config.ts`
  - Tests run against local development server
  - Configured for Chrome, Firefox, and Safari
  - Automatic retry logic for CI environments

## Writing Tests

When adding new features, please ensure:

1. Unit tests cover core logic and edge cases
2. Integration tests verify Convex function behavior
3. E2E tests validate complete user flows
4. Tests follow the existing patterns in their respective directories

## CI Integration

Tests are automatically run:

- On pull requests
- Before deployment
- In CI environment with stricter settings

## Environment Setup

To run tests locally:

1. Ensure all dependencies are installed
2. Set up required environment variables
3. Start the development server for E2E tests
4. Run the appropriate test command

## Test Coverage

We aim for:

- High coverage of core business logic
- Complete coverage of tag generation flows
- Full E2E coverage of critical user paths
