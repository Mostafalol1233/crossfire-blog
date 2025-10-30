# Bimora Blog Pro

## Overview

Bimora Blog Pro is a modern, full-stack blog platform built with React, TypeScript, Express, and PostgreSQL. It features a content-first design philosophy with bilingual support (English/Arabic), admin dashboard for content management, and a rich reading experience. The platform emphasizes typography, elegant design, and responsive layouts inspired by Medium, Ghost, and Notion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR and optimized production builds
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query (React Query)** for server state management, caching, and data synchronization

**UI Component System**
- **shadcn/ui** components built on Radix UI primitives for accessible, composable UI elements
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Design system** based on "New York" style variant with custom color schemes, typography scale, and spacing primitives
- **Dark mode** support with theme persistence in localStorage
- **Bilingual support** (English/Arabic) with RTL/LTR layout handling via context providers

**State Management Pattern**
- React Context API for cross-cutting concerns (theme, language)
- TanStack Query for async server state
- Local component state for UI interactions
- No global state management library (Redux/Zustand) - keeping state close to where it's used

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with TypeScript
- **ESM modules** throughout (type: "module" in package.json)
- Custom middleware for request logging, JSON parsing, and error handling

**Storage Layer**
- **In-memory storage implementation** (`MemStorage` class) as the current data persistence layer
- Uses Map data structures for users, posts, comments, and events
- **Database migration path**: Drizzle ORM configured for PostgreSQL migration (schema defined but not yet connected)
- Schema uses UUID primary keys, timestamp tracking, and proper foreign key relationships

**Authentication & Authorization**
- **JWT-based authentication** with configurable secret (environment variable)
- **Simple password verification** for admin access (environment variable: `ADMIN_PASSWORD`)
- bcryptjs for password hashing (prepared but using plain text comparison currently)
- Authorization middleware (`requireAuth`) validates JWT tokens on protected routes

**API Design**
- RESTful endpoints under `/api` namespace
- Separate route handlers for auth, posts, comments, and events
- Request/response logging middleware for API calls
- Error handling with appropriate HTTP status codes

### Data Schema

**Core Entities** (defined in Drizzle schema):
- **Users**: id, username, password (hashed)
- **Posts**: id, title, content, summary, image, category, tags (array), author, views, readingTime, featured flag, createdAt
- **Comments**: id, postId (foreign key), name, content, createdAt
- **Events**: id, title, date, type (upcoming/trending)

**Validation**
- Zod schemas generated from Drizzle definitions using `drizzle-zod`
- Insert schemas exclude auto-generated fields (id, timestamps, computed fields)

### Page Structure

**Public Pages**
- **Home**: Hero section, category filtering, search, article grid, sidebar with recent posts/popular tags/most viewed
- **Article**: Full post view with markdown rendering, related articles, comments section
- **About**: Static informational page
- **Contact**: Contact form (frontend only, no submission endpoint)

**Admin Pages**
- **Admin Login**: Password authentication to obtain JWT token
- **Admin Dashboard**: Create/edit/delete posts and events, view stats, manage content

### Design System Implementation

**Typography Hierarchy**
- Primary fonts: Inter (UI), Crimson Pro (headlines), IBM Plex Sans Arabic (Arabic), JetBrains Mono (code)
- Responsive type scale using Tailwind text utilities (text-xl → text-5xl)
- Optimized reading experience: max-w-prose containers, leading-relaxed line height

**Layout System**
- Container strategy: Full-width sections with inner max-w-7xl constraint
- Responsive padding: px-4 md:px-8, py-12 md:py-20
- Grid layouts for article cards with responsive columns
- Sticky header with backdrop blur effect

**Component Patterns**
- Compound components (Card + CardHeader + CardContent)
- Controlled form inputs with validation
- Accessible dialogs and modals using Radix primitives
- Toast notifications for user feedback

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: PostgreSQL driver for Neon Database (configured but not active)
- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **drizzle-kit**: CLI for migrations and database operations
- **Note**: Currently using in-memory storage; PostgreSQL integration is prepared but not connected

### Authentication
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing (prepared for database implementation)

### UI Framework
- **@radix-ui/react-\***: 20+ unstyled, accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **tailwind-merge**: Intelligent Tailwind class merging

### Form Handling
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration with validation libraries
- **zod**: Schema validation and TypeScript type inference

### Development Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast bundler for production server build
- **vite**: Frontend build tool with HMR
- **@replit/vite-plugin-\***: Replit-specific plugins for error overlay and development features

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className construction
- **nanoid**: Unique ID generation
- **lucide-react**: Icon library
- **react-icons**: Additional icon sets (including brand icons)

### Asset Management
- Static assets stored in `attached_assets/` directory
- Generated images for hero backgrounds and article covers
- Vite alias configuration for easy asset imports (@assets)