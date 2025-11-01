# Biomera Gaming Blog

## Overview

Biomera Gaming Blog is a modern, full-stack CrossFire gaming website built with React, TypeScript, Express, and in-memory storage. It features a news section with CrossFire-style grid layouts, a mercenaries/characters showcase with interactive hover effects, and AI-generated CrossFire-themed imagery. The platform emphasizes bilingual support (English/Arabic), responsive design, and engaging visual experiences, transforming from a general blog into a gaming-focused hub. The business vision is to provide a rich, interactive content experience for CrossFire enthusiasts, leveraging modern web technologies to deliver high performance and an intuitive user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React 18** and **TypeScript**, using **Vite** for fast development and optimized builds. **Wouter** handles client-side routing, and **TanStack Query** manages server state, caching, and data synchronization.

The UI is constructed using **shadcn/ui** components built on Radix UI primitives, styled with **Tailwind CSS** following a "New York" design system variant. It includes dark mode support with theme persistence and comprehensive **bilingual support** (English/Arabic) with RTL/LTR layout handling. State management primarily uses React Context for global concerns, TanStack Query for async data, and local component state.

### Backend Architecture

The backend runs on **Express.js** with **Node.js** and **TypeScript**, utilizing ESM modules. It includes custom middleware for logging, JSON parsing, and error handling.

Data is currently managed with an **in-memory storage implementation** (`MemStorage`) using Map data structures for core entities like users, posts, news, and mercenaries. A **Drizzle ORM** configuration exists for a future PostgreSQL migration path, with defined schemas using UUIDs and proper relationships. Authentication is **JWT-based** with configurable secrets and simple password verification for admin access, with `bcryptjs` prepared for hashing. The API is **RESTful** under the `/api` namespace, providing endpoints for gaming-specific content like news and mercenaries, with robust error handling.

### Data Schema

Core entities include Users, Posts, Comments, Events, NewsItem, and Mercenary, defined in Drizzle schemas and storage interfaces. **Zod** schemas are used for validation, generated from Drizzle definitions.

### Page Structure

**Public Pages** include Home (with category filtering and search), News (CrossFire-style grid with detail pages), Mercenaries (interactive character gallery), GraveGames (event info), Article (full post view), About, and Contact.

**Admin Pages** include Admin Login and a Dashboard for content management (create/edit/delete posts and events, image uploads) with rich text editing via ReactQuill, client-side route protection, and enhanced security layers (frontend and backend JWT verification).

### Design System Implementation

The design system uses **Inter**, **Crimson Pro**, **IBM Plex Sans Arabic**, and **JetBrains Mono** fonts with a responsive type scale. Layouts feature full-width sections with constrained content areas and responsive padding. Component patterns include compound components, controlled forms with validation, accessible dialogs via Radix, toast notifications, and interactive hover effects. News pages utilize grid-based layouts with responsive columns and featured items.

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: PostgreSQL driver (configured, not active)
- **Drizzle ORM**: Type-safe SQL query builder
- **drizzle-kit**: CLI for database operations

### Authentication
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing (prepared)

### UI Framework
- **@radix-ui/react-\***: Unstyled, accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **tailwind-merge**: Intelligent Tailwind class merging

### Form Handling
- **react-hook-form**: Performant form library
- **@hookform/resolvers**: Integration with validation libraries
- **zod**: Schema validation and TypeScript type inference

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundler for production server
- **vite**: Frontend build tool
- **@replit/vite-plugin-\***: Replit-specific plugins

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className construction
- **nanoid**: Unique ID generation
- **lucide-react**: Icon library
- **react-icons**: Additional icon sets

### Asset Management
- Static assets served from `attached_assets/` at `/assets`.
- AI-generated CrossFire-themed images are used for visual content.
- **Catbox.moe Integration**: Admin dashboard supports image uploads to catbox.moe for public hosting.