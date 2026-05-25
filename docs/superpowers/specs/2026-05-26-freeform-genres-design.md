# Freeform Genres Design

## Goal

Allow admins to enter any genre value for a book while keeping the archive genre filter limited to genres that currently exist in the database.

## Current State

- `genre` is constrained to a fixed enum in shared TypeScript types.
- Admin book create/edit validation only accepts the fixed enum values.
- The admin form renders a fixed select for genre.
- Archive filter controls render from the same fixed genre list.
- URL parsing for the archive only accepts those fixed values.
- The `books` table enforces the same restriction with a SQL `CHECK` constraint.

## Decision

Store `genre` as a plain trimmed string instead of an enum.

The archive UI will derive its genre filter options from the current book data at runtime. The filter list will contain `All` plus the distinct genres currently present in the database, sorted consistently for stable navigation and rendering.

This change will not introduce a separate genres table, aliasing rules, or aggressive normalization. The system will preserve the exact trimmed value entered by the admin.

## Scope

In scope:

- Accept free-form genres in admin create/edit flows
- Persist custom genre strings in the books table
- Remove the database constraint that restricts genre values
- Derive archive genre filter options from existing book data
- Update archive URL parsing so custom genres remain selectable
- Preserve compatibility with existing book records

Out of scope:

- Genre synonym merging
- Case folding or title-casing entered genres
- Dedicated genre management screens
- Backfilling or rewriting existing genre values
- Converting genre into a relational table

## Design

### Data Model

`genre` becomes a non-empty string in the shared book schema and related input types.

The books table will continue storing `genre` in a text column, but the SQL `CHECK` constraint on allowed values will be removed. Existing rows require no data transformation because their current values remain valid under the new model.

### Admin Form

The admin book form will replace the fixed genre select with a text input.

The submitted value will be trimmed server-side before validation. Empty or whitespace-only values will be rejected. The saved value will be the exact trimmed string, preserving the admin’s chosen capitalization and punctuation.

### Server Validation

Book form parsing and shared input validation will accept any non-empty string for `genre`.

Validation responsibilities:

- Trim surrounding whitespace
- Reject empty results
- Preserve the remaining value exactly as entered

No additional canonicalization will be added in this change.

### Archive Filters

ArchiveShell will derive the genre option list from the loaded `books` array.

Behavior:

- Build a distinct set of current genres from all books
- Sort the resulting list alphabetically
- Render `All` followed by those live values in both desktop and mobile filter controls
- Continue filtering books by exact genre match

If a genre no longer exists in the current dataset, it will disappear from the filter list automatically.

### Search Params

Archive search param parsing will stop using a fixed literal union for `genre`.

Instead, `genre` will be parsed as a generic string with a default of `All`. This is required so custom genre values in the URL are preserved and do not get rejected by the parser.

Format, sort, and view params remain fixed literal sets because those are still closed vocabularies.

### Database Migration

The books schema source file will be updated to remove the genre `CHECK` constraint.

Because this project uses direct SQL scripts for the books table rather than a managed migration framework, the implementation will include a safe database migration step for existing environments. The migration must preserve all current rows and indexes while removing the old genre constraint from the table definition.

## Error Handling

- Empty or whitespace-only genre submissions return the existing form error path.
- Existing books with old enum-based genres continue to render and filter normally.
- Unknown custom genres in the URL will only show results if matching books exist; otherwise the archive will render an empty filtered state without crashing.

## Testing

Verification should cover:

1. Create a book with a new custom genre and confirm it saves successfully.
2. Edit an existing book and change its genre to a different custom value.
3. Load the archive and confirm the new genre appears in the filter controls.
4. Filter by the new genre and confirm matching books are shown.
5. Confirm the filter controls only show genres present in the current dataset.
6. Confirm whitespace-only genre input is rejected.
7. Confirm legacy values such as `Fiction` still render and filter correctly.

## Risks

- Without normalization, near-duplicate values such as `Sci-Fi` and `sci-fi` will be treated as separate genres.
- Changing the archive parser from a literal set to a free string requires care so `All` remains the stable default state.
- Removing a SQL constraint in an existing database requires a safe table migration path, not just a schema file edit.

## Implementation Notes

- Follow existing admin form and archive component patterns rather than introducing a new abstraction.
- Keep `format` as the only closed-vocabulary book classification field.
- Avoid touching unrelated seeded data or archive presentation logic beyond what is necessary for free-form genres.
