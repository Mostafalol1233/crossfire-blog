import { 
  type User, 
  type InsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Event,
  type InsertEvent
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface NewsItem {
  id: string;
  title: string;
  dateRange: string;
  image: string;
  featured?: boolean;
}

export interface Mercenary {
  id: string;
  name: string;
  image: string;
  role: string;
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  incrementPostViews(id: string): Promise<void>;
  
  // Comment methods
  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Event methods
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: string): Promise<boolean>;

  // News methods
  getAllNews(): Promise<NewsItem[]>;

  // Mercenaries methods
  getAllMercenaries(): Promise<Mercenary[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<string, Post>;
  private comments: Map<string, Comment>;
  private events: Map<string, Event>;
  private news: Map<string, NewsItem>;
  private mercenaries: Map<string, Mercenary>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.events = new Map();
    this.news = new Map();
    this.mercenaries = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize news items
    const newsItems: NewsItem[] = [
      {
        id: "1",
        title: "MYSTIC MOONLIGHT MARKET",
        dateRange: "October 15 - November 4",
        image: "/assets/generated_images/tactical_weapons_arsenal_display_341b61a5.png",
        featured: true,
      },
      {
        id: "2",
        title: "CROSSFIRE ROADMAP",
        dateRange: "2025 Updates",
        image: "/assets/generated_images/intense_tactical_combat_scene_c8202806.png",
      },
      {
        id: "3",
        title: "CF EVENT PASS SEASON 5",
        dateRange: "Rewind Edition",
        image: "/assets/generated_images/tactical_assault_rifle_weapon_17c651c5.png",
      },
      {
        id: "4",
        title: "CFS SUPER FANS",
        dateRange: "Oct 22 - Nov 4",
        image: "/assets/generated_images/female_tactical_operator_character_7f8de27c.png",
      },
      {
        id: "5",
        title: "THE SPIDER'S WEB",
        dateRange: "Oct 1 - 31",
        image: "/assets/generated_images/male_tactical_mercenary_character_4eb7f00f.png",
      },
      {
        id: "6",
        title: "BOO-TIQUE BARGAINS",
        dateRange: "Oct 29 - Nov 2",
        image: "/assets/generated_images/tactical_weapons_arsenal_display_341b61a5.png",
      },
    ];

    newsItems.forEach((item) => this.news.set(item.id, item));

    // Initialize mercenaries
    const mercenaries: Mercenary[] = [
      {
        id: "1",
        name: "Annie",
        image: "/assets/generated_images/female_tactical_operator_character_7f8de27c.png",
        role: "Desperado",
      },
      {
        id: "2",
        name: "Holly",
        image: "/assets/generated_images/female_tactical_operator_character_7f8de27c.png",
        role: "Sisterhood",
      },
      {
        id: "3",
        name: "Magnolia",
        image: "/assets/generated_images/female_tactical_operator_character_7f8de27c.png",
        role: "Black Mamba",
      },
      {
        id: "4",
        name: "Lexy",
        image: "/assets/generated_images/female_tactical_operator_character_7f8de27c.png",
        role: "Wolf",
      },
      {
        id: "5",
        name: "Vipers",
        image: "/assets/generated_images/male_tactical_mercenary_character_4eb7f00f.png",
        role: "Special Forces",
      },
      {
        id: "6",
        name: "Arch Honorary",
        image: "/assets/generated_images/male_tactical_mercenary_character_4eb7f00f.png",
        role: "Elite Guard",
      },
      {
        id: "7",
        name: "Ronin",
        image: "/assets/generated_images/male_tactical_mercenary_character_4eb7f00f.png",
        role: "Samurai",
      },
      {
        id: "8",
        name: "Dean",
        image: "/assets/generated_images/male_tactical_mercenary_character_4eb7f00f.png",
        role: "Specialist",
      },
      {
        id: "9",
        name: "Thoth",
        image: "/assets/generated_images/male_tactical_mercenary_character_4eb7f00f.png",
        role: "Guardian",
      },
      {
        id: "10",
        name: "SFG",
        image: "/assets/generated_images/male_tactical_mercenary_character_4eb7f00f.png",
        role: "Special Forces Group",
      },
    ];

    mercenaries.forEach((merc) => this.mercenaries.set(merc.id, merc));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Post methods
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = randomUUID();
    const post: Post = { 
      ...insertPost,
      featured: insertPost.featured ?? false,
      id,
      views: 0,
      createdAt: new Date()
    };
    this.posts.set(id, post);
    return post;
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  async incrementPostViews(id: string): Promise<void> {
    const post = this.posts.get(id);
    if (post) {
      post.views += 1;
      this.posts.set(id, post);
    }
  }

  // Comment methods
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // News methods
  async getAllNews(): Promise<NewsItem[]> {
    return Array.from(this.news.values());
  }

  // Mercenaries methods
  async getAllMercenaries(): Promise<Mercenary[]> {
    return Array.from(this.mercenaries.values());
  }
}

export const storage = new MemStorage();
