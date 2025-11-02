# Biomera Gaming Blog

## Overview

Biomera Gaming Blog is a modern, full-stack CrossFire gaming website built with React, TypeScript, Express, and PostgreSQL. It features a news section with CrossFire-style grid layouts, clickable event detail pages, a mercenaries/characters showcase with interactive hover effects, and AI-generated CrossFire-themed imagery. The platform emphasizes **manual bilingual support** (English/Arabic) where admins add translations through the dashboard and users toggle between languages, responsive design, and engaging visual experiences. The business vision is to provide a rich, interactive content experience for CrossFire enthusiasts with advanced **role-based access control** for multiple administrators and newsletter management.

## Recent Changes (November 2025)

### Event Detail Pages
- Created dedicated EventDetail page showing full event descriptions, images, and Arabic translations
- Made events in EventsRibbon clickable, routing to `/events/:id`
- Added translation toggle button for users to switch between English and Arabic content

### Manual Translation System
- Added Arabic translation fields to events (`titleAr`, `descriptionAr`) and news (`titleAr`, `contentAr`)
- Created Translations tab in admin dashboard to manage Arabic translations manually
- Translation toggle available on EventDetail pages for end users

### Multi-Admin Permission System
- Implemented role-based authentication with three levels: `super_admin`, `admin`, `ticket_manager`
- Super admin: Full control over all features including admin management and newsletter
- Regular admin: Can edit news and tickets but cannot access admin/newsletter management
- Ticket manager: Limited to ticket management only
- Ticket emails hidden from non-super admin roles for privacy

### Newsletter Management
- Added newsletter subscription form in footer with email validation
- Created newsletter_subscribers table and API endpoints
- Newsletter subscribers tab in admin dashboard (super admin only)
- Subscribers can be viewed and deleted by super admin

### Admin Dashboard Enhancements
- Reorganized into 7 tabs: Dashboard, Posts, Events & News, Translations, Admins, Newsletter, Tickets
- Role-based tab visibility (Admins and Newsletter tabs only for super_admin)
- Enhanced forms with Arabic fields and RTL support
- Username/password login system for multiple admins (stored in admins table)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with **React 18** and **TypeScript**, using **Vite** for fast development and optimized builds. **Wouter** handles client-side routing, and **TanStack Query** manages server state, caching, and data synchronization.

The UI is constructed using **shadcn/ui** components built on Radix UI primitives, styled with **Tailwind CSS** following a "New York" design system variant. It includes dark mode support with theme persistence and comprehensive **bilingual support** (English/Arabic) with RTL/LTR layout handling. State management primarily uses React Context for global concerns, TanStack Query for async data, and local component state.

### Backend Architecture

The backend runs on **Express.js** with **Node.js** and **TypeScript**, utilizing ESM modules. It includes custom middleware for logging, JSON parsing, and error handling.

Data is managed with **PostgreSQL** using **Drizzle ORM** with defined schemas, UUIDs, and proper relationships for users, posts, news, events, mercenaries, admins, and newsletter subscribers. A **DatabaseStorage** implementation interacts with the database for all CRUD operations, while a fallback **MemStorage** implementation exists for testing. Authentication is **JWT-based** with role claims (super_admin, admin, ticket_manager) encoded in tokens. Multiple admin accounts are stored in the `admins` table with hashed passwords. The API is **RESTful** under the `/api` namespace with **role-based access control middleware** protecting sensitive endpoints.

### Data Schema

Core entities include:
- **Users**: Basic user authentication
- **Posts**: Blog articles with categories and content
- **Comments**: User-generated comments on posts
- **Events**: Gaming events with translations (`title`, `titleAr`, `description`, `descriptionAr`, `imageUrl`, `startDate`, `endDate`)
- **NewsItem**: News articles with translations (`title`, `titleAr`, `content`, `contentAr`, `imageUrl`, `category`)
- **Mercenary**: Character/mercenary showcase
- **Admins**: Multi-admin system with roles (`id`, `username`, `password`, `role`, `createdAt`)
- **NewsletterSubscribers**: Email subscriptions (`id`, `email`, `createdAt`)

**Zod** schemas are used for validation, generated from Drizzle definitions.

### Page Structure

**Public Pages** include:
- Home (with category filtering and search)
- News (CrossFire-style grid with detail pages and translation toggle)
- EventDetail (individual event page with image, description, and translation toggle)
- Mercenaries (interactive character gallery)
- GraveGames (event info with clickable events)
- Article (full post view)
- About and Contact
- Footer with newsletter subscription

**Admin Pages** include:
- AdminLogin (username/password authentication for multiple admins)
- Admin Dashboard with 7 tabs:
  1. **Dashboard**: Stats overview and image upload
  2. **Posts**: Blog post management
  3. **Events & News**: Side-by-side management
  4. **Translations**: Translation status overview and manual Arabic input
  5. **Admins**: Admin user management (super_admin only)
  6. **Newsletter**: Subscriber management (super_admin only)
  7. **Tickets**: Support ticket management (emails hidden for non-super admins)

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