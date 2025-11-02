// KataBump Backend - Complete PostgreSQL/Neon Storage
// This file replaces MongoDB storage completely

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Database schema definitions
const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  author: text("author").notNull(),
  views: integer("views").notNull().default(0),
  readingTime: integer("reading_time").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  parentCommentId: varchar("parent_comment_id"),
  name: text("name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull().default(""),
  description: text("description").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  date: text("date").notNull(),
  type: text("type").notNull(),
  image: text("image").notNull().default(""),
});

const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull().default(""),
  dateRange: text("date_range").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  contentAr: text("content_ar").notNull().default(""),
  htmlContent: text("html_content").notNull().default(""),
  author: text("author").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("normal"),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const ticketReplies = pgTable("ticket_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Initialize database connection
const sqlClient = neon(process.env.DATABASE_URL);
const db = drizzle(sqlClient);

// Storage class
export class PostgreSQLStorage {
  constructor() {
    this.mercenaries = new Map();
    this.initializeMercenaries();
    console.log('✅ PostgreSQL Storage initialized with Neon');
  }

  initializeMercenaries() {
    const mercenaries = [
      { id: "1", name: "Wolf", image: "/assets/merc-wolf.jpg", role: "Assault" },
      { id: "2", name: "Vipers", image: "/assets/merc-vipers.jpg", role: "Sniper" },
      { id: "3", name: "Sisterhood", image: "/assets/merc-sisterhood.jpg", role: "Medic" },
      { id: "4", name: "Black Mamba", image: "/assets/merc-blackmamba.jpg", role: "Scout" },
      { id: "5", name: "Arch Honorary", image: "/assets/merc-archhonorary.jpg", role: "Tank" },
      { id: "6", name: "Desperado", image: "/assets/merc-desperado.jpg", role: "Engineer" },
      { id: "7", name: "Ronin", image: "/assets/merc-ronin.jpg", role: "Samurai" },
      { id: "8", name: "Dean", image: "/assets/merc-dean.jpg", role: "Specialist" },
      { id: "9", name: "Thoth", image: "/assets/merc-thoth.jpg", role: "Guardian" },
      { id: "10", name: "SFG", image: "/assets/merc-sfg.jpg", role: "Special Forces Group" },
    ];
    mercenaries.forEach((merc) => this.mercenaries.set(merc.id, merc));
  }

  // ========== USERS ==========
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user) {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // ========== POSTS ==========
  async getAllPosts() {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async getPostById(id) {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  }

  async createPost(post) {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async updatePost(id, post) {
    const result = await db.update(posts).set(post).where(eq(posts.id, id)).returning();
    return result[0];
  }

  async deletePost(id) {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning();
    return result.length > 0;
  }

  async incrementPostViews(id) {
    const post = await this.getPostById(id);
    if (post) {
      await db.update(posts).set({ views: post.views + 1 }).where(eq(posts.id, id));
    }
  }

  // ========== COMMENTS ==========
  async getCommentsByPostId(postId) {
    return await db.select().from(comments).where(eq(comments.postId, postId)).orderBy(desc(comments.createdAt));
  }

  async createComment(comment) {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }

  // ========== EVENTS ==========
  async getAllEvents() {
    return await db.select().from(events);
  }

  async getEventById(id) {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async createEvent(event) {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id, event) {
    const result = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return result[0];
  }

  async deleteEvent(id) {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return result.length > 0;
  }

  // ========== NEWS ==========
  async getAllNews() {
    const newsItems = await db.select().from(news).orderBy(desc(news.createdAt));
    return newsItems.map((item) => ({
      id: item.id,
      title: item.title,
      titleAr: item.titleAr,
      dateRange: item.dateRange,
      image: item.image,
      category: item.category,
      content: item.content,
      contentAr: item.contentAr,
      htmlContent: item.htmlContent,
      author: item.author,
      featured: item.featured,
      createdAt: item.createdAt,
    }));
  }

  async createNews(newsItem) {
    const result = await db.insert(news).values(newsItem).returning();
    return {
      id: result[0].id,
      title: result[0].title,
      titleAr: result[0].titleAr,
      dateRange: result[0].dateRange,
      image: result[0].image,
      category: result[0].category,
      content: result[0].content,
      contentAr: result[0].contentAr,
      htmlContent: result[0].htmlContent,
      author: result[0].author,
      featured: result[0].featured,
      createdAt: result[0].createdAt,
    };
  }

  async updateNews(id, newsItem) {
    const result = await db.update(news).set(newsItem).where(eq(news.id, id)).returning();
    if (!result[0]) return undefined;
    return {
      id: result[0].id,
      title: result[0].title,
      titleAr: result[0].titleAr,
      dateRange: result[0].dateRange,
      image: result[0].image,
      category: result[0].category,
      content: result[0].content,
      contentAr: result[0].contentAr,
      htmlContent: result[0].htmlContent,
      author: result[0].author,
      featured: result[0].featured,
      createdAt: result[0].createdAt,
    };
  }

  async deleteNews(id) {
    const result = await db.delete(news).where(eq(news.id, id)).returning();
    return result.length > 0;
  }

  // ========== MERCENARIES (in-memory) ==========
  async getAllMercenaries() {
    return Array.from(this.mercenaries.values());
  }

  // ========== TICKETS ==========
  async getAllTickets() {
    return await db.select().from(tickets).orderBy(desc(tickets.createdAt));
  }

  async getTicketById(id) {
    const result = await db.select().from(tickets).where(eq(tickets.id, id));
    return result[0];
  }

  async getTicketsByEmail(email) {
    return await db.select().from(tickets).where(eq(tickets.userEmail, email)).orderBy(desc(tickets.createdAt));
  }

  async createTicket(ticket) {
    const result = await db.insert(tickets).values(ticket).returning();
    return result[0];
  }

  async updateTicket(id, ticket) {
    const result = await db.update(tickets).set({ ...ticket, updatedAt: new Date() }).where(eq(tickets.id, id)).returning();
    return result[0];
  }

  async deleteTicket(id) {
    const result = await db.delete(tickets).where(eq(tickets.id, id)).returning();
    return result.length > 0;
  }

  // ========== TICKET REPLIES ==========
  async getTicketReplies(ticketId) {
    return await db.select().from(ticketReplies).where(eq(ticketReplies.ticketId, ticketId)).orderBy(ticketReplies.createdAt);
  }

  async createTicketReply(reply) {
    const result = await db.insert(ticketReplies).values(reply).returning();
    return result[0];
  }

  // ========== ADMINS ==========
  async getAllAdmins() {
    return await db.select().from(admins).orderBy(desc(admins.createdAt));
  }

  async getAdminById(id) {
    const result = await db.select().from(admins).where(eq(admins.id, id));
    return result[0];
  }

  async getAdminByUsername(username) {
    const result = await db.select().from(admins).where(eq(admins.username, username));
    return result[0];
  }

  async createAdmin(admin) {
    const result = await db.insert(admins).values(admin).returning();
    return result[0];
  }

  async updateAdmin(id, admin) {
    const result = await db.update(admins).set(admin).where(eq(admins.id, id)).returning();
    return result[0];
  }

  async deleteAdmin(id) {
    const result = await db.delete(admins).where(eq(admins.id, id)).returning();
    return result.length > 0;
  }

  // ========== NEWSLETTER SUBSCRIBERS ==========
  async getAllNewsletterSubscribers() {
    return await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  }

  async getNewsletterSubscriberByEmail(email) {
    const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return result[0];
  }

  async createNewsletterSubscriber(subscriber) {
    const result = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return result[0];
  }

  async deleteNewsletterSubscriber(id) {
    const result = await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id)).returning();
    return result.length > 0;
  }
}

// Export single instance
export const storage = new PostgreSQLStorage();
