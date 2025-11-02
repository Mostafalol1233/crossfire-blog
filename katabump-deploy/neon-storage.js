// PostgreSQL Storage Implementation for KataBump
// Replace your MongoDB storage with this

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';

// Database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Table definitions (simplified - you'll need to import from your schema)
// Import these from your actual schema file
import * as schema from './neon-schema.js';

export class PostgreSQLStorage {
  constructor() {
    this.mercenaries = new Map();
    this.initializeMercenaries();
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

  // Users
  async getUser(id) {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username) {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async createUser(user) {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  // Posts
  async getAllPosts() {
    return await db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt));
  }

  async getPostById(id) {
    const result = await db.select().from(schema.posts).where(eq(schema.posts.id, id));
    return result[0];
  }

  async createPost(post) {
    const result = await db.insert(schema.posts).values(post).returning();
    return result[0];
  }

  async updatePost(id, post) {
    const result = await db.update(schema.posts).set(post).where(eq(schema.posts.id, id)).returning();
    return result[0];
  }

  async deletePost(id) {
    const result = await db.delete(schema.posts).where(eq(schema.posts.id, id)).returning();
    return result.length > 0;
  }

  async incrementPostViews(id) {
    const post = await this.getPostById(id);
    if (post) {
      await db.update(schema.posts).set({ views: post.views + 1 }).where(eq(schema.posts.id, id));
    }
  }

  // Comments
  async getCommentsByPostId(postId) {
    return await db.select().from(schema.comments).where(eq(schema.comments.postId, postId)).orderBy(desc(schema.comments.createdAt));
  }

  async createComment(comment) {
    const result = await db.insert(schema.comments).values(comment).returning();
    return result[0];
  }

  // Events
  async getAllEvents() {
    return await db.select().from(schema.events);
  }

  async createEvent(event) {
    const result = await db.insert(schema.events).values(event).returning();
    return result[0];
  }

  async deleteEvent(id) {
    const result = await db.delete(schema.events).where(eq(schema.events.id, id)).returning();
    return result.length > 0;
  }

  async getEventById(id) {
    const result = await db.select().from(schema.events).where(eq(schema.events.id, id));
    return result[0];
  }

  async updateEvent(id, event) {
    const result = await db.update(schema.events).set(event).where(eq(schema.events.id, id)).returning();
    return result[0];
  }

  // News
  async getAllNews() {
    const newsItems = await db.select().from(schema.news).orderBy(desc(schema.news.createdAt));
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

  async createNews(news) {
    const result = await db.insert(schema.news).values(news).returning();
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

  async updateNews(id, news) {
    const result = await db.update(schema.news).set(news).where(eq(schema.news.id, id)).returning();
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
    const result = await db.delete(schema.news).where(eq(schema.news.id, id)).returning();
    return result.length > 0;
  }

  // Mercenaries (in-memory)
  async getAllMercenaries() {
    return Array.from(this.mercenaries.values());
  }

  // Tickets
  async getAllTickets() {
    return await db.select().from(schema.tickets).orderBy(desc(schema.tickets.createdAt));
  }

  async getTicketById(id) {
    const result = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id));
    return result[0];
  }

  async getTicketsByEmail(email) {
    return await db.select().from(schema.tickets).where(eq(schema.tickets.userEmail, email)).orderBy(desc(schema.tickets.createdAt));
  }

  async createTicket(ticket) {
    const result = await db.insert(schema.tickets).values(ticket).returning();
    return result[0];
  }

  async updateTicket(id, ticket) {
    const result = await db.update(schema.tickets).set({ ...ticket, updatedAt: new Date() }).where(eq(schema.tickets.id, id)).returning();
    return result[0];
  }

  async deleteTicket(id) {
    const result = await db.delete(schema.tickets).where(eq(schema.tickets.id, id)).returning();
    return result.length > 0;
  }

  // Ticket Replies
  async getTicketReplies(ticketId) {
    return await db.select().from(schema.ticketReplies).where(eq(schema.ticketReplies.ticketId, ticketId)).orderBy(schema.ticketReplies.createdAt);
  }

  async createTicketReply(reply) {
    const result = await db.insert(schema.ticketReplies).values(reply).returning();
    return result[0];
  }

  // Admins
  async getAllAdmins() {
    return await db.select().from(schema.admins);
  }

  async getAdminById(id) {
    const result = await db.select().from(schema.admins).where(eq(schema.admins.id, id));
    return result[0];
  }

  async getAdminByUsername(username) {
    const result = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
    return result[0];
  }

  async createAdmin(admin) {
    const result = await db.insert(schema.admins).values(admin).returning();
    return result[0];
  }

  async updateAdmin(id, admin) {
    const result = await db.update(schema.admins).set(admin).where(eq(schema.admins.id, id)).returning();
    return result[0];
  }

  async deleteAdmin(id) {
    const result = await db.delete(schema.admins).where(eq(schema.admins.id, id)).returning();
    return result.length > 0;
  }

  // Newsletter Subscribers
  async getAllNewsletterSubscribers() {
    return await db.select().from(schema.newsletterSubscribers);
  }

  async getNewsletterSubscriberByEmail(email) {
    const result = await db.select().from(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.email, email));
    return result[0];
  }

  async createNewsletterSubscriber(subscriber) {
    const result = await db.insert(schema.newsletterSubscribers).values(subscriber).returning();
    return result[0];
  }

  async deleteNewsletterSubscriber(id) {
    const result = await db.delete(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.id, id)).returning();
    return result.length > 0;
  }
}

// Export storage instance
export const storage = new PostgreSQLStorage();
