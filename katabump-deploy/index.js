// server/index.ts
import express2 from "express";
import path3 from "path";
import { fileURLToPath } from "url";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";

// shared/mongodb-schema.ts
import mongoose, { Schema } from "mongoose";
import { z } from "zod";
var UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
var PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  author: { type: String, required: true },
  views: { type: Number, default: 0 },
  readingTime: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var CommentSchema = new Schema({
  postId: { type: String, required: true },
  parentCommentId: { type: String },
  name: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
var EventSchema = new Schema({
  title: { type: String, required: true },
  titleAr: { type: String, default: "" },
  description: { type: String, default: "" },
  descriptionAr: { type: String, default: "" },
  date: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, default: "" }
});
var NewsSchema = new Schema({
  title: { type: String, required: true },
  titleAr: { type: String, default: "" },
  dateRange: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  contentAr: { type: String, default: "" },
  htmlContent: { type: String, default: "" },
  author: { type: String, required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var TicketSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  status: { type: String, default: "open" },
  priority: { type: String, default: "normal" },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
var TicketReplySchema = new Schema({
  ticketId: { type: String, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
var AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now }
});
var NewsletterSubscriberSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});
var UserModel = mongoose.model("User", UserSchema);
var PostModel = mongoose.model("Post", PostSchema);
var CommentModel = mongoose.model("Comment", CommentSchema);
var EventModel = mongoose.model("Event", EventSchema);
var NewsModel = mongoose.model("News", NewsSchema);
var TicketModel = mongoose.model("Ticket", TicketSchema);
var TicketReplyModel = mongoose.model("TicketReply", TicketReplySchema);
var AdminModel = mongoose.model("Admin", AdminSchema);
var NewsletterSubscriberModel = mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema);
var insertUserSchema = z.object({
  username: z.string(),
  password: z.string()
});
var insertPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  image: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  readingTime: z.number(),
  featured: z.boolean().optional()
});
var insertCommentSchema = z.object({
  postId: z.string(),
  parentCommentId: z.string().optional(),
  name: z.string(),
  content: z.string()
});
var insertEventSchema = z.object({
  title: z.string(),
  titleAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  date: z.string(),
  type: z.string(),
  image: z.string().optional()
});
var insertNewsSchema = z.object({
  title: z.string(),
  titleAr: z.string().optional(),
  dateRange: z.string(),
  image: z.string(),
  category: z.string(),
  content: z.string(),
  contentAr: z.string().optional(),
  htmlContent: z.string().optional(),
  author: z.string(),
  featured: z.boolean().optional()
});
var insertTicketSchema = z.object({
  title: z.string(),
  description: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  category: z.string()
});
var insertTicketReplySchema = z.object({
  ticketId: z.string(),
  authorName: z.string(),
  content: z.string(),
  isAdmin: z.boolean().optional()
});
var insertAdminSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.string().optional()
});
var insertNewsletterSubscriberSchema = z.object({
  email: z.string().email()
});

// server/mongodb.ts
import mongoose2 from "mongoose";
var isConnected = false;
async function connectMongoDB() {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    await mongoose2.connect(mongoUri);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
mongoose2.connection.on("disconnected", () => {
  isConnected = false;
  console.log("MongoDB disconnected");
});
mongoose2.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// server/mongodb-storage.ts
var MongoDBStorage = class {
  mercenaries;
  initialized = false;
  constructor() {
    this.mercenaries = /* @__PURE__ */ new Map();
    this.initializeMercenaries();
    this.connect();
  }
  async connect() {
    if (!this.initialized) {
      await connectMongoDB();
      this.initialized = true;
    }
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
      { id: "10", name: "SFG", image: "/assets/merc-sfg.jpg", role: "Special Forces Group" }
    ];
    mercenaries.forEach((merc) => this.mercenaries.set(merc.id, merc));
  }
  async getUser(id) {
    const user = await UserModel.findById(id);
    return user || void 0;
  }
  async getUserByUsername(username) {
    const user = await UserModel.findOne({ username });
    return user || void 0;
  }
  async createUser(user) {
    const newUser = await UserModel.create(user);
    return newUser;
  }
  async getAllPosts() {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    return posts;
  }
  async getPostById(id) {
    const post = await PostModel.findById(id);
    return post || void 0;
  }
  async createPost(post) {
    const newPost = await PostModel.create(post);
    return newPost;
  }
  async updatePost(id, post) {
    const updated = await PostModel.findByIdAndUpdate(id, post, { new: true });
    return updated || void 0;
  }
  async deletePost(id) {
    const result = await PostModel.findByIdAndDelete(id);
    return !!result;
  }
  async incrementPostViews(id) {
    await PostModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
  async getCommentsByPostId(postId) {
    const comments = await CommentModel.find({ postId }).sort({ createdAt: -1 });
    return comments;
  }
  async createComment(comment) {
    const newComment = await CommentModel.create(comment);
    return newComment;
  }
  async getAllEvents() {
    const events = await EventModel.find();
    return events;
  }
  async createEvent(event) {
    const newEvent = await EventModel.create(event);
    return newEvent;
  }
  async deleteEvent(id) {
    const result = await EventModel.findByIdAndDelete(id);
    return !!result;
  }
  async getAllNews() {
    const news = await NewsModel.find().sort({ createdAt: -1 });
    return news.map((item) => ({
      id: String(item._id),
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
      createdAt: item.createdAt
    }));
  }
  async createNews(news) {
    const newNews = await NewsModel.create(news);
    return {
      id: String(newNews._id),
      title: newNews.title,
      titleAr: newNews.titleAr,
      dateRange: newNews.dateRange,
      image: newNews.image,
      category: newNews.category,
      content: newNews.content,
      contentAr: newNews.contentAr,
      htmlContent: newNews.htmlContent,
      author: newNews.author,
      featured: newNews.featured,
      createdAt: newNews.createdAt
    };
  }
  async updateNews(id, news) {
    const updated = await NewsModel.findByIdAndUpdate(id, news, { new: true });
    if (!updated) return void 0;
    return {
      id: String(updated._id),
      title: updated.title,
      titleAr: updated.titleAr,
      dateRange: updated.dateRange,
      image: updated.image,
      category: updated.category,
      content: updated.content,
      contentAr: updated.contentAr,
      htmlContent: updated.htmlContent,
      author: updated.author,
      featured: updated.featured,
      createdAt: updated.createdAt
    };
  }
  async deleteNews(id) {
    const result = await NewsModel.findByIdAndDelete(id);
    return !!result;
  }
  async getAllMercenaries() {
    return Array.from(this.mercenaries.values());
  }
  async getAllTickets() {
    const tickets = await TicketModel.find().sort({ createdAt: -1 });
    return tickets;
  }
  async getTicketById(id) {
    const ticket = await TicketModel.findById(id);
    return ticket || void 0;
  }
  async getTicketsByEmail(email) {
    const tickets = await TicketModel.find({ userEmail: email }).sort({ createdAt: -1 });
    return tickets;
  }
  async createTicket(ticket) {
    const newTicket = await TicketModel.create(ticket);
    return newTicket;
  }
  async updateTicket(id, ticket) {
    const updated = await TicketModel.findByIdAndUpdate(
      id,
      { ...ticket, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
    return updated || void 0;
  }
  async deleteTicket(id) {
    const result = await TicketModel.findByIdAndDelete(id);
    return !!result;
  }
  async getTicketReplies(ticketId) {
    const replies = await TicketReplyModel.find({ ticketId }).sort({ createdAt: 1 });
    return replies;
  }
  async createTicketReply(reply) {
    const newReply = await TicketReplyModel.create(reply);
    return newReply;
  }
  async getAllAdmins() {
    const admins = await AdminModel.find().sort({ createdAt: -1 });
    return admins;
  }
  async getAdminById(id) {
    const admin = await AdminModel.findById(id);
    return admin || void 0;
  }
  async getAdminByUsername(username) {
    const admin = await AdminModel.findOne({ username });
    return admin || void 0;
  }
  async createAdmin(admin) {
    const newAdmin = await AdminModel.create(admin);
    return newAdmin;
  }
  async updateAdmin(id, admin) {
    const updated = await AdminModel.findByIdAndUpdate(id, admin, { new: true });
    return updated || void 0;
  }
  async deleteAdmin(id) {
    const result = await AdminModel.findByIdAndDelete(id);
    return !!result;
  }
  async getEventById(id) {
    const event = await EventModel.findById(id);
    return event || void 0;
  }
  async updateEvent(id, event) {
    const updated = await EventModel.findByIdAndUpdate(id, event, { new: true });
    return updated || void 0;
  }
  async getAllNewsletterSubscribers() {
    const subscribers = await NewsletterSubscriberModel.find().sort({ createdAt: -1 });
    return subscribers;
  }
  async getNewsletterSubscriberByEmail(email) {
    const subscriber = await NewsletterSubscriberModel.findOne({ email });
    return subscriber || void 0;
  }
  async createNewsletterSubscriber(subscriber) {
    const newSubscriber = await NewsletterSubscriberModel.create(subscriber);
    return newSubscriber;
  }
  async deleteNewsletterSubscriber(id) {
    const result = await NewsletterSubscriberModel.findByIdAndDelete(id);
    return !!result;
  }
};

// server/storage.ts
var storage = new MongoDBStorage();

// server/utils/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
async function verifyAdminPassword(password) {
  return password === ADMIN_PASSWORD;
}
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("[AUTH] Authorization header:", authHeader ? "present" : "missing");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[AUTH] No Bearer token found");
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.substring(7);
  console.log("[AUTH] Token extracted, length:", token.length);
  const payload = verifyToken(token);
  console.log("[AUTH] Token verification result:", payload ? "valid" : "invalid");
  if (!payload) {
    return res.status(401).json({ error: "Invalid token" });
  }
  req.user = payload;
  next();
}
function requireSuperAdmin(req, res, next) {
  const user = req.user;
  if (!user || user.role !== "super_admin") {
    return res.status(403).json({ error: "Forbidden: Super Admin access required" });
  }
  next();
}

// server/utils/helpers.ts
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}
function generateSummary(content, maxLength = 200) {
  const plainText = content.replace(/[#*`]/g, "").trim();
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return plainText.substring(0, maxLength).trim() + "...";
}
function formatDate(date) {
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 6e4);
  const diffHours = Math.floor(diffMs / 36e5);
  const diffDays = Math.floor(diffMs / 864e5);
  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
}

// server/scraper.ts
import * as cheerio from "cheerio";
var Z8GamesScraper = class {
  EVENTS_URL = "https://crossfire.z8games.com/events.html";
  FORUM_BASE_URL = "https://forum.z8games.com";
  extractImageUrl($el, baseUrl = "https://z8games.akamaized.net") {
    let imageUrl = "";
    const $img = $el.find("img").first();
    if ($img.length > 0) {
      imageUrl = $img.attr("src") || $img.attr("data-src") || $img.attr("data-original") || $img.attr("srcset")?.split(",")[0]?.trim()?.split(" ")[0] || "";
      if (!imageUrl) {
        const imgStyle = $img.attr("style") || "";
        const bgMatch = imgStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
        if (bgMatch) {
          imageUrl = bgMatch[1];
        }
      }
    }
    if (!imageUrl) {
      const elementStyle = $el.attr("style") || "";
      const bgMatch = elementStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (bgMatch) {
        imageUrl = bgMatch[1];
      }
    }
    if (!imageUrl) {
      const $bgElement = $el.find('[style*="background-image"]').first();
      if ($bgElement.length > 0) {
        const bgStyle = $bgElement.attr("style") || "";
        const bgMatch = bgStyle.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
        if (bgMatch) {
          imageUrl = bgMatch[1];
        }
      }
    }
    if (!imageUrl) {
      imageUrl = $el.attr("data-background") || $el.attr("data-bg") || $el.attr("data-image") || "";
      if (!imageUrl) {
        const $dataEl = $el.find("[data-background], [data-bg], [data-image]").first();
        if ($dataEl.length > 0) {
          imageUrl = $dataEl.attr("data-background") || $dataEl.attr("data-bg") || $dataEl.attr("data-image") || "";
        }
      }
    }
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/")) {
      return `${baseUrl}${imageUrl}`;
    }
    return imageUrl;
  }
  fixHtmlContentUrls(htmlContent, baseUrl = "https://forum.z8games.com") {
    return htmlContent.replace(/src="(\/[^"]+)"/g, `src="${baseUrl}$1"`).replace(/src='(\/[^']+)'/g, `src='${baseUrl}$1'`).replace(/data-src="(\/[^"]+)"/g, `data-src="${baseUrl}$1"`).replace(/data-src='(\/[^']+)'/g, `data-src='${baseUrl}$1'`).replace(/data-original="(\/[^"]+)"/g, `data-original="${baseUrl}$1"`).replace(/data-original='(\/[^']+)'/g, `data-original='${baseUrl}$1'`);
  }
  async scrapeEvents() {
    try {
      const response = await fetch(this.EVENTS_URL);
      const html = await response.text();
      const $ = cheerio.load(html);
      const events = [];
      $('.event-card, .event-item, [class*="event"]').each((_, element) => {
        const $el = $(element);
        const title = $el.find('h3, h2, .event-title, [class*="title"]').first().text().trim();
        const description = $el.find('p, .event-description, [class*="description"]').first().text().trim();
        const dateText = $el.find('.event-date, [class*="date"], h4').first().text().trim();
        const imageUrl = this.extractImageUrl($el);
        if (title && title.length > 3) {
          events.push({
            title,
            description: description || title,
            date: dateText || "Ongoing",
            type: dateText.toLowerCase().includes("ongoing") ? "ongoing" : "upcoming",
            image: imageUrl
          });
        }
      });
      return events.filter(
        (event, index, self) => index === self.findIndex((e) => e.title === event.title)
      );
    } catch (error) {
      console.error("Error scraping events:", error);
      return [];
    }
  }
  async scrapeForumAnnouncements(forumUrl) {
    try {
      const url = forumUrl || `${this.FORUM_BASE_URL}/categories/crossfire-announcements`;
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      const newsItems = [];
      $('article, .discussion, [class*="Discussion"]').each((_, element) => {
        const $el = $(element);
        const title = $el.find('h1, h2, h3, .discussion-title, [class*="Title"]').first().text().trim();
        const contentElement = $el.find('.discussion-content, [class*="Message"]').first();
        const content = contentElement.text().trim();
        let htmlContent = contentElement.html() || "";
        htmlContent = this.fixHtmlContentUrls(htmlContent);
        const author = $el.find('.author, [class*="Author"], [class*="GM"]').first().text().trim() || "GM Xenon";
        const dateText = $el.find('time, .date, [class*="Date"]').first().text().trim();
        const imageUrl = this.extractImageUrl($el, this.FORUM_BASE_URL);
        if (title && title.length > 5) {
          newsItems.push({
            title,
            dateRange: dateText || (/* @__PURE__ */ new Date()).toLocaleDateString(),
            image: imageUrl,
            category: "Announcements",
            content: content || title,
            htmlContent,
            author: author.replace(/\[GM\]/gi, "").trim() || "GM Xenon"
          });
        }
      });
      return newsItems.filter(
        (news, index, self) => index === self.findIndex((n) => n.title === news.title)
      ).slice(0, 10);
    } catch (error) {
      console.error("Error scraping forum announcements:", error);
      return [];
    }
  }
  async scrapeSpecificForum(discussionUrl) {
    try {
      const response = await fetch(discussionUrl);
      const html = await response.text();
      const $ = cheerio.load(html);
      const title = $("h1").first().text().trim();
      const contentElement = $('article, .Message, [class*="Message"]').first();
      const content = contentElement.text().trim();
      let htmlContent = contentElement.html() || "";
      htmlContent = this.fixHtmlContentUrls(htmlContent);
      const author = $('.author, [class*="Author"]').first().text().trim() || "GM Xenon";
      const dateText = $("time").first().text().trim();
      const imageUrl = this.extractImageUrl(contentElement, this.FORUM_BASE_URL);
      if (!title) return null;
      return {
        title,
        dateRange: dateText || (/* @__PURE__ */ new Date()).toLocaleDateString(),
        image: imageUrl,
        category: "News",
        content: content || title,
        htmlContent,
        author: author.replace(/\[GM\]/gi, "").trim() || "GM Xenon"
      };
    } catch (error) {
      console.error("Error scraping specific forum:", error);
      return null;
    }
  }
  convertToInsertEvent(scraped) {
    const mappedType = scraped.type === "ongoing" ? "trending" : scraped.type;
    return {
      title: scraped.title,
      titleAr: scraped.title,
      description: scraped.description,
      descriptionAr: scraped.description,
      date: scraped.date,
      type: mappedType,
      image: scraped.image
    };
  }
  convertToInsertNews(scraped) {
    return {
      title: scraped.title,
      titleAr: scraped.title,
      dateRange: scraped.dateRange,
      image: scraped.image,
      category: scraped.category,
      content: scraped.content,
      contentAr: scraped.content,
      htmlContent: scraped.htmlContent || scraped.content,
      author: scraped.author,
      featured: false
    };
  }
};
var scraper = new Z8GamesScraper();

// server/routes.ts
var upload = multer({ storage: multer.memoryStorage() });
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username && password) {
        const admin = await storage.getAdminByUsername(username);
        if (!admin) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const isValid = await comparePassword(password, admin.password);
        if (!isValid) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = generateToken({
          id: admin.id,
          username: admin.username,
          role: admin.role
        });
        res.json({
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            role: admin.role
          }
        });
      } else if (password) {
        const isValid = await verifyAdminPassword(password);
        if (!isValid) {
          return res.status(401).json({ error: "Invalid password" });
        }
        const token = generateToken({ role: "super_admin" });
        res.json({ token, admin: { role: "super_admin" } });
      } else {
        return res.status(400).json({ error: "Username and password or password required" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/posts", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      let posts = await storage.getAllPosts();
      if (category && category !== "all") {
        posts = posts.filter(
          (post) => post.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (search) {
        const searchLower = search.toLowerCase();
        posts = posts.filter(
          (post) => post.title.toLowerCase().includes(searchLower) || post.summary.toLowerCase().includes(searchLower) || post.content.toLowerCase().includes(searchLower) || post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }
      if (featured === "true") {
        posts = posts.filter((post) => post.featured);
      }
      const formattedPosts = posts.map((post) => ({
        ...post,
        date: formatDate(post.createdAt)
      }));
      res.json(formattedPosts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      await storage.incrementPostViews(req.params.id);
      const formattedPost = {
        ...post,
        date: formatDate(post.createdAt)
      };
      res.json(formattedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/posts", requireAuth, async (req, res) => {
    try {
      const data = insertPostSchema.parse(req.body);
      const readingTime = data.readingTime || calculateReadingTime(data.content);
      const summary = data.summary || generateSummary(data.content);
      const post = await storage.createPost({
        ...data,
        readingTime,
        summary
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      if (updates.content && !updates.readingTime) {
        updates.readingTime = calculateReadingTime(updates.content);
      }
      if (updates.content && !updates.summary) {
        updates.summary = generateSummary(updates.content);
      }
      const post = await storage.updatePost(req.params.id, updates);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deletePost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/posts/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByPostId(req.params.id);
      const formattedComments = comments.map((comment) => ({
        ...comment,
        date: formatDate(comment.createdAt)
      }));
      res.json(formattedComments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const { author, content, parentCommentId } = req.body;
      const commentData = {
        postId: id,
        name: author,
        content,
        parentCommentId: parentCommentId || void 0
      };
      const data = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(data);
      const formattedComment = {
        ...comment,
        date: formatDate(comment.createdAt)
      };
      res.status(201).json(formattedComment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/events", requireAuth, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      const allComments = await Promise.all(
        posts.map((post) => storage.getCommentsByPostId(post.id))
      );
      const totalComments = allComments.flat().length;
      const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
      res.json({
        totalPosts: posts.length,
        totalComments,
        totalViews,
        recentPosts: posts.slice(0, 5).map((post) => ({
          ...post,
          date: formatDate(post.createdAt)
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/news", requireAuth, async (req, res) => {
    try {
      const data = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(data);
      res.status(201).json(news);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/news/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const news = await storage.updateNews(req.params.id, updates);
      if (!news) {
        return res.status(404).json({ error: "News item not found" });
      }
      res.json(news);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/news/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteNews(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "News item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/mercenaries", async (req, res) => {
    try {
      const mercenaries = await storage.getAllMercenaries();
      res.json(mercenaries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/tickets", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      const tickets = await storage.getAllTickets();
      const formattedTickets = tickets.map((ticket) => {
        const formatted = {
          ...ticket,
          createdAt: formatDate(ticket.createdAt),
          updatedAt: formatDate(ticket.updatedAt)
        };
        if (user.role !== "super_admin") {
          delete formatted.userEmail;
        }
        return formatted;
      });
      res.json(formattedTickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/tickets/my/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const tickets = await storage.getTicketsByEmail(email);
      const formattedTickets = tickets.map((ticket) => ({
        ...ticket,
        createdAt: formatDate(ticket.createdAt),
        updatedAt: formatDate(ticket.updatedAt)
      }));
      res.json(formattedTickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/tickets/:id", async (req, res) => {
    try {
      const ticket = await storage.getTicketById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      const formattedTicket = {
        ...ticket,
        createdAt: formatDate(ticket.createdAt),
        updatedAt: formatDate(ticket.updatedAt)
      };
      res.json(formattedTicket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/tickets", async (req, res) => {
    try {
      const data = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(data);
      const formattedTicket = {
        ...ticket,
        createdAt: formatDate(ticket.createdAt),
        updatedAt: formatDate(ticket.updatedAt)
      };
      res.status(201).json(formattedTicket);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/tickets/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const ticket = await storage.updateTicket(req.params.id, updates);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      const formattedTicket = {
        ...ticket,
        createdAt: formatDate(ticket.createdAt),
        updatedAt: formatDate(ticket.updatedAt)
      };
      res.json(formattedTicket);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/tickets/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteTicket(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/tickets/:id/replies", async (req, res) => {
    try {
      const replies = await storage.getTicketReplies(req.params.id);
      const formattedReplies = replies.map((reply) => ({
        ...reply,
        createdAt: formatDate(reply.createdAt)
      }));
      res.json(formattedReplies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/tickets/:id/replies", async (req, res) => {
    try {
      const { id } = req.params;
      const { authorName, content, isAdmin } = req.body;
      const replyData = {
        ticketId: id,
        authorName,
        content,
        isAdmin: isAdmin || false
      };
      const data = insertTicketReplySchema.parse(replyData);
      const reply = await storage.createTicketReply(data);
      const formattedReply = {
        ...reply,
        createdAt: formatDate(reply.createdAt)
      };
      res.status(201).json(formattedReply);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/admins", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      const sanitizedAdmins = admins.map(({ password, ...admin }) => admin);
      res.json(sanitizedAdmins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/admins", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
      const { username, password, role } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const hashedPassword = await hashPassword(password);
      const data = insertAdminSchema.parse({
        username,
        password: hashedPassword,
        role: role || "admin"
      });
      const admin = await storage.createAdmin(data);
      const { password: _, ...sanitizedAdmin } = admin;
      res.status(201).json(sanitizedAdmin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.patch("/api/admins/:id", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
      const updates = {};
      if (req.body.username !== void 0) updates.username = req.body.username;
      if (req.body.password !== void 0) {
        updates.password = await hashPassword(req.body.password);
      }
      if (req.body.role !== void 0) updates.role = req.body.role;
      const admin = await storage.updateAdmin(req.params.id, updates);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      const { password: _, ...sanitizedAdmin } = admin;
      res.json(sanitizedAdmin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/admins/:id", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteAdmin(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.patch("/api/events/:id", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const event = await storage.updateEvent(req.params.id, updates);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/newsletter-subscribers", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/newsletter-subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const existing = await storage.getNewsletterSubscriberByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already subscribed" });
      }
      const data = insertNewsletterSubscriberSchema.parse({ email });
      const subscriber = await storage.createNewsletterSubscriber(data);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/newsletter-subscribers/:id", requireAuth, requireSuperAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteNewsletterSubscriber(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/upload-image", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const formData = new FormData();
      formData.append("reqtype", "fileupload");
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("fileToUpload", blob, req.file.originalname);
      const response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error("Failed to upload to catbox.moe");
      }
      const imageUrl = await response.text();
      res.json({ url: imageUrl.trim() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/scrape/events", requireAuth, async (req, res) => {
    try {
      const { selectedItems } = req.body;
      const scrapedEvents = selectedItems || await scraper.scrapeEvents();
      const existingEvents = await storage.getAllEvents();
      const createdEvents = [];
      let skippedCount = 0;
      for (const scrapedEvent of scrapedEvents) {
        const eventData = scraper.convertToInsertEvent(scrapedEvent);
        const isDuplicate = existingEvents.some(
          (existing) => existing.title.toLowerCase() === eventData.title.toLowerCase()
        );
        if (!isDuplicate) {
          const event = await storage.createEvent(eventData);
          createdEvents.push(event);
        } else {
          skippedCount++;
        }
      }
      res.json({
        success: true,
        count: createdEvents.length,
        skipped: skippedCount,
        events: createdEvents
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/scrape/news", requireAuth, async (req, res) => {
    try {
      const { url, selectedItems } = req.body;
      let scrapedNews = [];
      if (selectedItems) {
        scrapedNews = selectedItems;
      } else if (url) {
        const singleNews = await scraper.scrapeSpecificForum(url);
        if (singleNews) {
          scrapedNews.push(singleNews);
        }
      } else {
        scrapedNews = await scraper.scrapeForumAnnouncements();
      }
      const existingNews = await storage.getAllNews();
      const createdNews = [];
      let skippedCount = 0;
      for (const newsItem of scrapedNews) {
        const newsData = scraper.convertToInsertNews(newsItem);
        const isDuplicate = existingNews.some(
          (existing) => existing.title.toLowerCase() === newsData.title.toLowerCase()
        );
        if (!isDuplicate) {
          const news = await storage.createNews(newsData);
          createdNews.push(news);
        } else {
          skippedCount++;
        }
      }
      res.json({
        success: true,
        count: createdNews.length,
        skipped: skippedCount,
        news: createdNews
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/scrape/preview/events", requireAuth, async (req, res) => {
    try {
      const scrapedEvents = await scraper.scrapeEvents();
      res.json({
        count: scrapedEvents.length,
        events: scrapedEvents
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/scrape/preview/news", requireAuth, async (req, res) => {
    try {
      const { url } = req.query;
      let scrapedNews = [];
      if (url) {
        const singleNews = await scraper.scrapeSpecificForum(url);
        if (singleNews) {
          scrapedNews.push(singleNews);
        }
      } else {
        scrapedNews = await scraper.scrapeForumAnnouncements();
      }
      res.json({
        count: scrapedNews.length,
        news: scrapedNews
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = path3.dirname(currentFile);
  const assetsPath = path3.resolve(currentDir, "..", "attached_assets");
  app.use("/assets", express2.static(assetsPath));
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
