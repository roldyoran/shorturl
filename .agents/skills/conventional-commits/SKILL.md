---
name: conventional-commits
description: Use conventional commit format for all git commits. This skill ensures consistent and standardized commit messages following the conventional commits specification in English only. The body must be descriptive and explain what was changed in the files.
license: LICENSE.txt
---

This skill enforces the use of conventional commits format for all git commits. All commit messages MUST be written in English only.

## Conventional Commits Specification

Commit messages must follow this format:

```
<type>(<scope>): <description>

<descriptive body explaining what was done in the files>
```

### Types

Use one of the following types:
- `feat` — A new feature
- `fix` — A bug fix
- `refactor` — Code refactoring without changing behavior
- `docs` — Documentation changes
- `test` — Adding or updating tests
- `chore` — Maintenance tasks, tooling, dependencies
- `perf` — Performance improvements
- `style` — Code style changes (formatting, semicolons, etc.)
- `build` — Build system or dependency changes
- `ci` — CI configuration changes
- `revert` — Reverting a previous commit

### Scope

The scope is optional but recommended when it adds clarity. Use a scope that describes the area of the codebase:

**Frontend:**
- `ui` — User interface, components, pages
- `router` — Routing, navigation, redirects
- `state` — State management, stores
- `forms` — Form handling, validation
- `styles` — CSS, styling, themes

**Backend:**
- `api` — API endpoints, routes, controllers
- `db` — Database, migrations, schemas, queries
- `auth` — Authentication, authorization, sessions
- `middleware` — Middleware, interceptors
- `services` — Business logic, services

**General:**
- `config` — Configuration files, environment
- `deps` — Dependencies, packages
- `tests` — Test files and test infrastructure
- `docs` — Documentation
- `infra` — Infrastructure, deployment
- `utils` — Utility functions, helpers
- `types` — Types, interfaces, schemas
- `i18n` — Internationalization, translations
- `logging` — Logging, monitoring
- `security` — Security fixes, sanitization
- `cache` — Caching, caching strategies
- `email` — Email templates, notifications
- `file` — File handling, uploads
- `mobile` — Mobile-specific changes (React Native, Flutter, etc.)
- `desktop` — Desktop application changes

### Description

- Use imperative mood: "add" not "added" or "adds"
- Keep it concise (max 50 characters)
- Don't capitalize the first letter
- No period at the end

### Body

The body is **mandatory** and must include:

1. **Summary**: A brief description of what was done (1-3 lines)
2. **File list**: A list of all modified or created files with a very brief description of the change

Use this format:
```
<summary description>

Files:
- filename.ext: brief description of change
- another-file.ext: brief description of change
```

#### File List Requirements

- List ALL files that were modified, created, or deleted
- Use relative paths from the project root
- Keep the description extremely brief (2-5 words)
- Group related files together if needed

### Examples

```
feat(api): add user registration endpoint

Created new POST endpoint for user signup with validation. Added password hashing and token generation.

Files:
- routes/auth.ts: added POST /register endpoint
- controllers/auth.ts: added registration logic with validation
- models/user.ts: added user schema with email/password fields
- utils/auth.ts: added password hashing and token generation functions
- middleware/auth.ts: added auth middleware
```

```
fix(ui): resolve button alignment on mobile

Fixed spacing issue in the navigation component that caused buttons to overflow on small screens.

Files:
- components/Navbar.vue: fixed flexbox alignment and added responsive styles
- styles/buttons.css: adjusted padding and margins for mobile
```

```
refactor(db): optimize query performance

Restructured database queries to reduce N+1 problems. Added proper indexing for frequently accessed columns.

Files:
- models/post.ts: replaced eager loading with proper joins
- queries/posts.ts: refactored query methods
- migrations/001_add_indexes.sql: added indexes for foreign keys
```

```
chore(deps): update React to version 18

Upgraded React and related packages to latest stable version. Fixed deprecation warnings.

Files:
- package.json: updated React and React DOM to v18
- package-lock.json: regenerated lock file
- src/index.tsx: updated root render to use createRoot
```

## Rules

1. **Language**: All commit messages MUST be in English
2. **Format**: Follow the conventional commits structure exactly
3. **Body required**: Always include a descriptive body that explains what was changed
4. **File list required**: Always include a list of all modified/created files with brief descriptions
5. **Imperative mood**: Use "add", "fix", "update" not "added", "fixed", "updated"
6. **No emoji**: Do not use emojis in commit messages
7. **Breaking changes**: Prefix with `!` after type/scope or use `BREAKING CHANGE:` in footer