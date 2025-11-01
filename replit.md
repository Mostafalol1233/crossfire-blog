# Biomera Gaming Blog

## Overview

Biomera Gaming Blog is a modern, full-stack CrossFire gaming website built with React, TypeScript, Express, and in-memory storage. Originally a blog platform, it has been transformed into a gaming-focused site featuring a news section with CrossFire-style grid layouts, a mercenaries/characters showcase with interactive hover effects, and AI-generated CrossFire-themed imagery. The platform emphasizes bilingual support (English/Arabic), responsive design, and engaging visual experiences.

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
- Uses Map data structures for users, posts, comments, events, news items, and mercenaries
- **Database migration path**: Drizzle ORM configured for PostgreSQL migration (schema defined but not yet connected)
- Schema uses UUID primary keys, timestamp tracking, and proper foreign key relationships
- CrossFire-themed mock data initialized on startup (news items and mercenary characters)

**Authentication & Authorization**
- **JWT-based authentication** with configurable secret (environment variable)
- **Simple password verification** for admin access (environment variable: `ADMIN_PASSWORD`)
- bcryptjs for password hashing (prepared but using plain text comparison currently)
- Authorization middleware (`requireAuth`) validates JWT tokens on protected routes

**API Design**
- RESTful endpoints under `/api` namespace
- Separate route handlers for auth, posts, comments, events, news, and mercenaries
- Request/response logging middleware for API calls
- Error handling with appropriate HTTP status codes
- Gaming-specific endpoints: `/api/news` and `/api/mercenaries`

### Data Schema

**Core Entities** (defined in Drizzle schema and storage interfaces):
- **Users**: id, username, password (hashed)
- **Posts**: id, title, content, summary, image, category, tags (array), author, views, readingTime, featured flag, createdAt
- **Comments**: id, postId (foreign key), name, content, createdAt
- **Events**: id, title, date, type (upcoming/trending)
- **NewsItem** (storage only): id, title, dateRange, image, featured flag
- **Mercenary** (storage only): id, name, image, role

**Validation**
- Zod schemas generated from Drizzle definitions using `drizzle-zod`
- Insert schemas exclude auto-generated fields (id, timestamps, computed fields)

### Page Structure

**Public Pages**
- **Home**: Hero section, category filtering, search, article grid, sidebar with recent posts/popular tags/most viewed
- **News**: CrossFire-style grid layout with featured news card (2x2 grid on desktop), static display cards with hover effects
- **Mercenaries**: Horizontal gallery of character cards with hover-to-enlarge effect using CSS transforms, no layout shifts
- **Article**: Full post view with markdown rendering, related articles, comments section
- **About**: Static informational page
- **Contact**: Contact form (frontend only, no submission endpoint)

**Admin Pages**
- **Admin Login**: Password authentication to obtain JWT token
- **Admin Dashboard**: Create/edit/delete posts and events, view stats, manage content, upload images to catbox.moe

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
- Interactive hover effects with CSS transforms (scale) to avoid layout shifts
- Grid-based news layouts with responsive columns and featured items

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
- Static assets stored in `attached_assets/` directory served at `/assets` route
- Static file serving using Express middleware with proper ESM path resolution (fileURLToPath)
- AI-generated CrossFire-themed images:
  - Tactical assault rifle weapon (tactical_assault_rifle_weapon_17c651c5.png)
  - Intense tactical combat scene (intense_tactical_combat_scene_c8202806.png)
  - Tactical weapons arsenal display (tactical_weapons_arsenal_display_341b61a5.png)
  - Female tactical operator character (female_tactical_operator_character_7f8de27c.png)
  - Male tactical mercenary character (male_tactical_mercenary_character_4eb7f00f.png)
- Vite alias configuration for easy asset imports (@assets)
- **Catbox.moe Integration**: Admin dashboard includes image upload feature with authenticated API endpoint (`/api/upload-image`) that uploads to catbox.moe and returns public URLs

## Recent Changes (November 2025)

### CrossFire Gaming Transformation & Platform Enhancements
- **Rebranding**: Changed site name from "Bimora"/"Bemora" to "Biomera" across all pages and components
- **News Page**: Created CrossFire-style news grid with featured hero card, hover effects, and static display (no navigation)
- **Mercenaries Page**: Implemented character showcase gallery with smooth hover-to-enlarge effect using CSS scale transforms
- **Navigation**: Added News and Mercenaries links to main navigation menu
- **Mock Data**: Populated storage with CrossFire-themed news items (6 items) and mercenary characters (10 items)
- **Visual Design**: Enhanced hover interactions while maintaining layout stability (no layout shifts on hover)
- **Static Asset Serving**: Fixed image serving by implementing Express static middleware for `attached_assets/` folder using proper ESM path resolution (fileURLToPath instead of import.meta.dirname)
- **CrossFire 2025 Roadmap Article**: Created comprehensive article with real game content including new maps (Mid Line, Underground Raid, Maze, Cross Zone, Museum 13), weapons (Classic series, TMP Predator, AR57 Tactical, Kukri, themed collections), characters (Clara-Victorious, JON Lotus, Kaia, Game Girl, Veteran Hero), CrossFire Pass Season 9, CrossFire: Legends beta, Esports World Cup 2025, and quality-of-life improvements
- **Image Upload Feature**: Added catbox.moe integration to admin dashboard with authenticated multipart POST endpoint (`/api/upload-image`), file selection UI, upload progress indicator, and copyable public URL output for easy image hosting