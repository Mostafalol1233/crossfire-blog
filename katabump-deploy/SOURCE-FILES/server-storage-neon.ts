// server/storage.ts - Neon Version for KataBump
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import type {
  InsertUser,
  User,
  InsertPost,
  Post,
  InsertComment,
  Comment,
  InsertEvent,
  Event,
  InsertNews,
  News,
  InsertTicket,
  Ticket,
  InsertTicketReply,
  TicketReply,
  InsertAdmin,
  Admin,
  InsertNewsletterSubscriber,
  NewsletterSubscriber,
} from './schema';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface NewsItem {
  id: string;
  title: string;
  titleAr?: string;
  dateRange: string;
  image: string;
  featured?: boolean;
  category: string;
  content: string;
  contentAr?: string;
  htmlContent?: string;
  author: string;
  createdAt?: Date;
}

export interface Mercenary {
  id: string;
  name: string;
  image: string;
  role: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  incrementPostViews(id: string): Promise<void>;
  
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: string): Promise<boolean>;

  getAllNews(): Promise<NewsItem[]>;
  createNews(news: Partial<NewsItem>): Promise<NewsItem>;
  updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem | undefined>;
  deleteNews(id: string): Promise<boolean>;

  getAllMercenaries(): Promise<Mercenary[]>;

  getAllTickets(): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket | undefined>;
  getTicketsByEmail(email: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  deleteTicket(id: string): Promise<boolean>;

  getTicketReplies(ticketId: string): Promise<TicketReply[]>;
  createTicketReply(reply: InsertTicketReply): Promise<TicketReply>;

  getAllAdmins(): Promise<Admin[]>;
  getAdminById(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: string, admin: Partial<InsertAdmin>): Promise<Admin | undefined>;
  deleteAdmin(id: string): Promise<boolean>;

  getEventById(id: string): Promise<Event | undefined>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;

  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  deleteNewsletterSubscriber(id: string): Promise<boolean>;
}

export class NeonStorage implements IStorage {
  private mercenaries: Map<string, Mercenary>;

  constructor() {
    this.mercenaries = new Map();
    this.initializeMercenaries();
    console.log('✅ Neon PostgreSQL Storage initialized');
  }

  private initializeMercenaries() {
    const mercenaries: Mercenary[] = [
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

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async getAllPosts(): Promise<Post[]> {
    return await db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt));
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const result = await db.select().from(schema.posts).where(eq(schema.posts.id, id));
    return result[0];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(schema.posts).values(post).returning();
    return result[0];
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined> {
    const result = await db.update(schema.posts).set(post).where(eq(schema.posts.id, id)).returning();
    return result[0];
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(schema.posts).where(eq(schema.posts.id, id)).returning();
    return result.length > 0;
  }

  async incrementPostViews(id: string): Promise<void> {
    const post = await this.getPostById(id);
    if (post) {
      await db.update(schema.posts).set({ views: post.views + 1 }).where(eq(schema.posts.id, id));
    }
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return await db.select().from(schema.comments).where(eq(schema.comments.postId, postId)).orderBy(desc(schema.comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(schema.comments).values(comment).returning();
    return result[0];
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(schema.events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(schema.events).values(event).returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(schema.events).where(eq(schema.events.id, id)).returning();
    return result.length > 0;
  }

  async getAllNews(): Promise<NewsItem[]> {
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

  async createNews(news: Partial<NewsItem>): Promise<NewsItem> {
    const result = await db.insert(schema.news).values(news as any).returning();
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

  async updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem | undefined> {
    const result = await db.update(schema.news).set(news as any).where(eq(schema.news.id, id)).returning();
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

  async deleteNews(id: string): Promise<boolean> {
    const result = await db.delete(schema.news).where(eq(schema.news.id, id)).returning();
    return result.length > 0;
  }

  async getAllMercenaries(): Promise<Mercenary[]> {
    return Array.from(this.mercenaries.values());
  }

  async getAllTickets(): Promise<Ticket[]> {
    return await db.select().from(schema.tickets).orderBy(desc(schema.tickets.createdAt));
  }

  async getTicketById(id: string): Promise<Ticket | undefined> {
    const result = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id));
    return result[0];
  }

  async getTicketsByEmail(email: string): Promise<Ticket[]> {
    return await db.select().from(schema.tickets).where(eq(schema.tickets.userEmail, email)).orderBy(desc(schema.tickets.createdAt));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const result = await db.insert(schema.tickets).values(ticket).returning();
    return result[0];
  }

  async updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const result = await db.update(schema.tickets).set({ ...ticket, updatedAt: new Date() }).where(eq(schema.tickets.id, id)).returning();
    return result[0];
  }

  async deleteTicket(id: string): Promise<boolean> {
    const result = await db.delete(schema.tickets).where(eq(schema.tickets.id, id)).returning();
    return result.length > 0;
  }

  async getTicketReplies(ticketId: string): Promise<TicketReply[]> {
    return await db.select().from(schema.ticketReplies).where(eq(schema.ticketReplies.ticketId, ticketId)).orderBy(schema.ticketReplies.createdAt);
  }

  async createTicketReply(reply: InsertTicketReply): Promise<TicketReply> {
    const result = await db.insert(schema.ticketReplies).values(reply).returning();
    return result[0];
  }

  async getAllAdmins(): Promise<Admin[]> {
    return await db.select().from(schema.admins).orderBy(desc(schema.admins.createdAt));
  }

  async getAdminById(id: string): Promise<Admin | undefined> {
    const result = await db.select().from(schema.admins).where(eq(schema.admins.id, id));
    return result[0];
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const result = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
    return result[0];
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const result = await db.insert(schema.admins).values(admin).returning();
    return result[0];
  }

  async updateAdmin(id: string, admin: Partial<InsertAdmin>): Promise<Admin | undefined> {
    const result = await db.update(schema.admins).set(admin).where(eq(schema.admins.id, id)).returning();
    return result[0];
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await db.delete(schema.admins).where(eq(schema.admins.id, id)).returning();
    return result.length > 0;
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const result = await db.select().from(schema.events).where(eq(schema.events.id, id));
    return result[0];
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db.update(schema.events).set(event).where(eq(schema.events.id, id)).returning();
    return result[0];
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(schema.newsletterSubscribers).orderBy(desc(schema.newsletterSubscribers.createdAt));
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const result = await db.select().from(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.email, email));
    return result[0];
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const result = await db.insert(schema.newsletterSubscribers).values(subscriber).returning();
    return result[0];
  }

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    const result = await db.delete(schema.newsletterSubscribers).where(eq(schema.newsletterSubscribers.id, id)).returning();
    return result.length > 0;
  }
}

export type { IStorage };
export { NeonStorage };

export const storage = new NeonStorage();
