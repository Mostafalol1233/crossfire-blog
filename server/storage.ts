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
    // Initialize posts with a featured CrossFire article
    const initialPosts: Post[] = [
      {
        id: "crossfire-2025-roadmap",
        title: "CrossFire 2025 Roadmap: Everything Coming This Year",
        content: `# CrossFire 2025: The Ultimate Gaming Experience Awaits

The iconic first-person shooter CrossFire is experiencing a massive revival in 2025, with Smilegate Entertainment rolling out an ambitious roadmap packed with new content, features, and global expansion initiatives.

## New Maps Coming to CrossFire

CrossFire is expanding its battlefield roster with five exciting new maps designed for different playstyles:

### Mid Line Map (Search & Destroy)
A tactical masterpiece featuring narrow corridors and strategic chokepoints, perfect for coordinated team play. Expect intense close-quarters combat with multiple bombsite approaches.

### Forest Map (Team Deathmatch)
Set in a lush wilderness environment, this map offers a mix of open sightlines and dense foliage for stealth gameplay. Natural cover and elevation changes create dynamic engagements.

### Battle Zone (Mass Brawl)
An all-out warfare map designed for large-scale battles, featuring multiple capture points and vehicle spawn locations.

### Cross Zone (Event & Random Buff)
A unique event map with randomly spawning power-ups and special abilities, keeping every match unpredictable and exciting.

### Museum 13 (Novice Mode)
A beginner-friendly map designed to help new players learn the fundamentals of CrossFire in a controlled environment.

## New Weapons & Weapon Skins

2025 brings an arsenal of new weapons and stunning skin collections:

### Classic Series
- **M4A1-S Born Beast**: A legendary variant with enhanced stats
- **AWM-Infinite Dragon**: The ultimate sniper rifle with dragon-themed aesthetics
- **FAMAS G2-Nova Lance**: A futuristic assault rifle design

### Esports 2025 Collection
Celebrate competitive CrossFire with tournament-themed weapons:
- AK47-K T. Esports
- AN94-S Esports
- SR-25-D.K. Esports
- Outlaw T. Axe-Esports

### Special Edition Weapons
- **QBZ-03-Unicorn Beast**: Features a unique leveling progression system
- **M82A1-Prestige Glow**: A premium sniper with glowing effects
- **AA-12-T. Gunpowder Awaken**: An explosive shotgun design

### Themed Collections
- Beijing Opera Kukri (traditional Chinese aesthetics)
- Twilight Verdict series
- Flower Shadow series
- Purple Heaven series

## New Characters

Meet the latest mercenaries joining the CrossFire roster:

- **Clara-Victorious & Maiden-Dark Victorious**: Powerful female operators
- **JON Lotus Character**: A tactical specialist
- **Kaia Character**: An agile infiltrator
- **Game Girl Character**: A tech-savvy combatant
- **Veteran Hero Character**: An experienced warrior

## CrossFire Pass Season 9

The ninth season of CrossFire Pass arrives with an **Esports theme**, featuring:
- Exclusive esports-themed weapon skins
- Limited-time character outfits
- Premium rewards across 100+ tiers
- Free and premium track options

## CrossFire: Legends Returns to Southeast Asia

After previous setbacks, CrossFire: Legends is making a comeback in Southeast Asia with a comprehensive beta test:

### Beta Test Details
- **Dates**: July 23 - August 22, 2025
- **Regions**: Malaysia, Indonesia, Thailand, Philippines
- **Full Launch**: Second half of 2025

### Game Modes
- Search & Destroy (classic tactical gameplay)
- Team Deathmatch
- Free-For-All
- Melee-Only battles
- Sniper-Only mode (added mid-beta)

### Featured Content
- 13 classic maps including Black Widow, Desert, and Transport Ship
- Iconic weapons like AK47-Beast, M4A1-Iron Beast
- Unique Southeast Asian themed skins and operators
- Full localization in Thai, Bahasa Indonesia, Malay, and Filipino

### Technical Excellence
- Unity Engine powered for smooth performance
- Optimized for devices with as little as 1GB RAM
- Gyroscope aiming support
- Fully customizable HUD

## Esports World Cup 2025

CrossFire makes its debut at the **Esports World Cup 2025** in Riyadh, Saudi Arabia, marking a major milestone for the franchise:
- First major appearance at a global esports event
- Substantial prize pools
- Top international teams competing
- Live streaming coverage

## Quality-of-Life Improvements

Smilegate is committed to enhancing the player experience with:
- **Enhanced Graphics**: Optimized lighting systems and improved textures
- **Improved Matchmaking**: Faster queue times and better skill-based pairing
- **Customizable Settings**: More graphics options for all PC configurations
- **Weapon Balancing**: Regular adjustments to maintain competitive integrity
- **Anti-Cheat Updates**: Continued development of security measures

## The Future: CrossFire 2

Development is underway for **CrossFire 2**, with Smilegate actively recruiting talented developers. While details remain under wraps, this next-generation sequel promises to revolutionize the franchise with cutting-edge technology and innovative gameplay mechanics.

## Regional Expansion

CrossFire is doubling down on regional content:
- Localized events and tournaments
- Region-specific character designs
- Culturally inspired weapon skins
- Community-driven content creation programs

## Release Timeline

- **Q1 2025**: New maps and CF Pass Season 9
- **Q2 2025**: CrossFire: Legends beta test
- **Mid-2025**: Esports World Cup appearance
- **H2 2025**: Mobile game full launch
- **Ongoing**: Weekly content updates and seasonal events

---

## Conclusion

CrossFire's 2025 roadmap demonstrates Smilegate's commitment to revitalizing this legendary FPS franchise. With new maps, weapons, characters, mobile expansion, and a strong esports push, CrossFire is positioned for a major comeback. Whether you're a veteran player or new to the game, 2025 is the perfect time to experience the intense tactical combat that made CrossFire a global phenomenon.

Stay tuned to official channels for the latest updates, and prepare for the most action-packed year in CrossFire history!`,
        summary: "Discover everything coming to CrossFire in 2025: new maps, weapons, characters, CF Pass Season 9, mobile game return, Esports World Cup debut, and the development of CrossFire 2.",
        image: "/assets/feature-crossfire.jpg",
        category: "News",
        tags: ["CrossFire", "2025", "Roadmap", "Updates", "Esports", "Mobile"],
        author: "Bimora Team",
        featured: true,
        readingTime: 8,
        views: 15420,
        createdAt: new Date("2025-11-01")
      }
    ];

    initialPosts.forEach((post) => this.posts.set(post.id, post));

    // Initialize news items
    const newsItems: NewsItem[] = [
      {
        id: "1",
        title: "MYSTIC MOONLIGHT MARKET",
        dateRange: "October 15 - November 4",
        image: "/assets/news-sapphire.jpg",
        featured: true,
      },
      {
        id: "2",
        title: "CROSSFIRE ROADMAP",
        dateRange: "2025 Updates",
        image: "/assets/feature-crossfire.jpg",
      },
      {
        id: "3",
        title: "CF EVENT PASS SEASON 5",
        dateRange: "Rewind Edition",
        image: "/assets/feature-weap.jpg",
      },
      {
        id: "4",
        title: "CFS SUPER FANS",
        dateRange: "Oct 22 - Nov 4",
        image: "/assets/news-superfans.jpg",
      },
      {
        id: "5",
        title: "THE SPIDER'S WEB",
        dateRange: "Oct 1 - 31",
        image: "/assets/news-gravegames.jpg",
      },
      {
        id: "6",
        title: "BOO-TIQUE BARGAINS",
        dateRange: "Oct 29 - Nov 2",
        image: "/assets/news-halloween.jpg",
      },
    ];

    newsItems.forEach((item) => this.news.set(item.id, item));

    // Initialize mercenaries
    const mercenaries: Mercenary[] = [
      {
        id: "1",
        name: "Annie",
        image: "/assets/merc-desperado.jpg",
        role: "Desperado",
      },
      {
        id: "2",
        name: "Holly",
        image: "/assets/merc-sisterhood.jpg",
        role: "Sisterhood",
      },
      {
        id: "3",
        name: "Magnolia",
        image: "/assets/merc-blackmamba.jpg",
        role: "Black Mamba",
      },
      {
        id: "4",
        name: "Lexy",
        image: "/assets/merc-wolf.jpg",
        role: "Wolf",
      },
      {
        id: "5",
        name: "Vipers",
        image: "/assets/merc-vipers.jpg",
        role: "Special Forces",
      },
      {
        id: "6",
        name: "Arch Honorary",
        image: "/assets/merc-archhonorary.jpg",
        role: "Elite Guard",
      },
      {
        id: "7",
        name: "Ronin",
        image: "/assets/merc-ronin.jpg",
        role: "Samurai",
      },
      {
        id: "8",
        name: "Dean",
        image: "/assets/merc-dean.jpg",
        role: "Specialist",
      },
      {
        id: "9",
        name: "Thoth",
        image: "/assets/merc-thoth.jpg",
        role: "Guardian",
      },
      {
        id: "10",
        name: "SFG",
        image: "/assets/merc-sfg.jpg",
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
    const event: Event = { 
      ...insertEvent, 
      id,
      image: insertEvent.image || ""
    };
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
