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
- `api` — API endpoints, routes, controllers
- `ui` — User interface, components, pages
- `db` — Database, migrations, schemas
- `auth` — Authentication, authorization, sessions
- `config` — Configuration files, environment
- `deps` — Dependencies, packages
- `tests` — Test files and test infrastructure
- `docs` — Documentation
- `infra` — Infrastructure, deployment
- `utils` — Utility functions, helpers

### Description

- Use imperative mood: "add" not "added" or "adds"
- Keep it concise (max 50 characters)
- Don't capitalize the first letter
- No period at the end

### Body

The body is **mandatory** and must:
- Be descriptive about what was done in the files that were changed
- Explain the "what" and "why", not "how"
- Be brief but informative (1-3 lines recommended)
- Reference any related issues or PRs if applicable

### Examples

```
feat(api): add user registration endpoint

Created new POST endpoint for user signup with validation. Added password hashing and token generation.
```

```
fix(ui): resolve button alignment on mobile

Fixed spacing issue in the navigation component that caused buttons to overflow on small screens.
```

```
refactor(db): optimize query performance

Restructured database queries to reduce N+1 problems. Added proper indexing for frequently accessed columns.
```

```
test(auth): add integration tests for login flow

Created test suite covering valid credentials, invalid credentials, and session timeout scenarios.
```

```
chore(deps): update React to version 18

Upgraded React and related packages to latest stable version. Fixed deprecation warnings.
```

```
perf(utils): improve array processing speed

Replaced forEach with map for better performance. Added memoization for expensive computations.
```

## Rules

1. **Language**: All commit messages MUST be in English
2. **Format**: Follow the conventional commits structure exactly
3. **Body required**: Always include a descriptive body that explains what was changed
4. **Imperative mood**: Use "add", "fix", "update" not "added", "fixed", "updated"
5. **No emoji**: Do not use emojis in commit messages
6. **Breaking changes**: Prefix with `!` after type/scope or use `BREAKING CHANGE:` in footer