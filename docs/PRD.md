# bkht.library – Project Requirements Document

**Project Name:** bkht.library

**Version:** 1.3

**Date:** May 26, 2026

**Status:** Requirements Specification

## Project Overview

**bkht.library** is a personal digital book archive web application. It recreates the structure, interactions, and overall browsing experience of Katie Chiou's book archive reference, while adopting a more literary **serif-first visual language** and extending the collection model with **book format** support.

The public archive is fully open, fast, and shareable. Authentication exists only to protect the admin workflow used to manage the collection.

## Product Goals

- Present a beautiful, image-forward public archive of owned books.
- Preserve the reference experience: filters, views, author browsing, and modal-first details.
- Keep the public experience simple and open with no reader accounts.
- Provide a lightweight but secure admin workflow for a single maintainer.
- Make the system deployable on Vercel without relying on writable local filesystem storage.

## Core Features

### 1. Public Features (No Authentication Required)

- Header with site title **bkht.library** and collection statistics
- Genre tabs: **All · Fiction · Nonfiction · Poetry**
- Format filter: **All · Hardcover · Paperback · Trade Paperback · Mass Market · Other**
- View toggles: **Icons · List · Gallery**
- Sort options: **Title · Author · Recent**
- Author sidebar on desktop and author drawer/sheet on mobile
- Book cards with cover-first presentation
- Book detail modal with deep-link support via `?book=`
- Fully responsive, fast, image-forward experience

### 2. Admin-Only Features (Protected)

- **Admin Dashboard** at `/admin`
- Add new book with cover upload and metadata
- Edit existing book:
  - title
  - author
  - genre
  - format
  - notes
  - replace image
- Delete book
- View the full book list with management actions
- Optional rebuild / trigger deployment endpoint

## Authentication Requirements

- **Type:** simple, secure admin-only authentication
- **Access:** only `/admin` routes and `/api/admin/*` endpoints are protected
- **Public Site:** remains completely public and fast
- **Method:** email/password login for a single admin user
- **Session:** secure session cookie, HTTP-only in practice, with a 24-hour session lifetime
- **Security:**
  - rate limiting on login attempts
  - no public registration
  - protected admin API routes
  - secure cookies in production

## Data Model

### Book Object

```json
{
  "id": "unique-string",
  "title": "string",
  "author": "string or array",
  "genre": "Fiction | Nonfiction | Poetry",
  "format": "Hardcover | Paperback | Trade Paperback | Mass Market | Other",
  "image": "absolute URL or /books/filename.jpg",
  "dateAdded": "YYYY-MM-DD",
  "notes": "optional string"
}
```

## Design Requirements

### Serif Style Direction

- Maintain elegant serif typography across both public and admin surfaces
- Use a literary, calm visual tone rather than a generic SaaS dashboard style
- Keep format badges subtle and refined
- Favor whitespace, light backgrounds, and image-led layouts over heavy card chrome

### Public Archive UX

- Sticky archive header with title and counts
- Genre filtering visible at the top of the page
- View switching between Icons, List, and Gallery without leaving the archive
- Sorting and filtering controls that feel lightweight and editorial
- Detail modal instead of a primary full-page detail route
- Mobile layout that keeps filters and author access usable without horizontal overflow

## Technical Requirements

- **Framework:** Next.js App Router on Vercel
- **Styling:** Tailwind CSS v4
- **Authentication:** Better Auth with email/password for admin-only access
- **Persistence:** Postgres-backed books table
- **Image Storage:** Blob-backed cover storage with upload-time optimization
- **Image Processing:** `sharp` for resize/compression during upload
- **Protection:** Node-runtime proxy / server-side checks for `/admin` routes

## Architecture Decisions

The original 1.2 draft allowed multiple implementation options such as `books.json`, SQLite/TinyDB, and NextAuth/custom credentials. Those options were narrowed during implementation for deployment compatibility and runtime simplicity.

The locked architecture for v1.3 is:

- **Books data:** Postgres
- **Cover images:** Blob storage
- **Admin auth:** Better Auth email/password
- **Public state:** server-rendered archive data plus client-side URL state for filters and modal

This avoids relying on writable files under `/public` at runtime and fits a serverless deployment model more cleanly.

## Routes

### Public

- `/` — main archive
- `/browse` — redirect to `/`
- `/book/[slug]` — legacy redirect into `/?book={id}`

### Admin

- `/admin/login` — login page
- `/admin` — dashboard
- `/admin/books/new` — add book
- `/admin/books/[id]/edit` — edit book

### APIs

- `/api/books` — public read endpoint
- `/api/auth/[...all]` — auth handler
- `/api/admin/books` — protected admin CRUD list/create
- `/api/admin/books/[id]` — protected admin read/update/delete
- `/api/admin/deploy` — optional protected deploy trigger

## User Flows

### Public User

1. Visit the archive homepage
2. Browse by genre, format, author, sort mode, or view mode
3. Open a book modal
4. Share a deep link using `?book=...`

### Admin

1. Go to `/admin`
2. Login with credentials
3. Access the dashboard
4. Add, edit, or delete books
5. Upload or replace covers
6. See updates reflected on the public archive after revalidation

## Maintenance Workflow

1. Login at `/admin`
2. Add a new book with title, author, genre, format, notes, and cover image
3. Save the record
4. Public archive updates through revalidation
5. Optionally trigger a deploy hook if required by deployment workflow

## Performance and Content Requirements

- Public browsing should remain fast with no auth checks on public routes
- Cover images should be optimized before storage
- Modal detail links should be shareable
- Archive controls should remain usable on mobile and desktop

## Out of Scope

- Multi-user support
- Public editing or contributions
- Advanced roles and permissions
- Rich-text CMS authoring
- Reader accounts, favorites, reviews, or annotations

## Deliverables

- Fully deployed public site at `bkht.library`
- Protected `/admin` section
- Complete GitHub repository
- README with:
  - setup instructions
  - admin workflow
  - required environment variables
  - seeding guidance
- Sample books covering multiple genres and formats

## Change Summary from PRD 1.2

- `books.json` / SQLite / TinyDB options were replaced by **Postgres**
- `/public/books/` runtime image storage was replaced by **Blob storage**
- NextAuth/custom credentials option was replaced by **Better Auth**
- Public format filtering explicitly includes **Mass Market**
- Tailwind baseline is now **Tailwind CSS v4**
