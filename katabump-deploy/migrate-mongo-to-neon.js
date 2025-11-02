// Script to migrate data from MongoDB to Neon PostgreSQL
// Run this ONCE to transfer all your existing data

import mongoose from 'mongoose';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_URI_HERE';
// Neon Connection  
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_qHJBV89WgejL@ep-dry-cell-aena69o3.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

// MongoDB Models (same as your existing schema)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const PostSchema = new mongoose.Schema({
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

const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  parentCommentId: { type: String },
  name: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleAr: { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionAr: { type: String, default: '' },
  date: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, default: '' }
});

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleAr: { type: String, default: '' },
  dateRange: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  contentAr: { type: String, default: '' },
  htmlContent: { type: String, default: '' },
  author: { type: String, required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  status: { type: String, default: 'open' },
  priority: { type: String, default: 'normal' },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TicketReplySchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model('User', UserSchema);
const PostModel = mongoose.model('Post', PostSchema);
const CommentModel = mongoose.model('Comment', CommentSchema);
const EventModel = mongoose.model('Event', EventSchema);
const NewsModel = mongoose.model('News', NewsSchema);
const TicketModel = mongoose.model('Ticket', TicketSchema);
const TicketReplyModel = mongoose.model('TicketReply', TicketReplySchema);
const AdminModel = mongoose.model('Admin', AdminSchema);
const NewsletterSubscriberModel = mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);

// Initialize Neon
const sqlClient = neon(DATABASE_URL);

async function migrate() {
  console.log('🚀 Starting migration from MongoDB to Neon...\n');

  try {
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ========== MIGRATE ADMINS ==========
    console.log('👤 Migrating admins...');
    const admins = await AdminModel.find();
    console.log(`Found ${admins.length} admins`);
    
    for (const admin of admins) {
      try {
        await sqlClient`
          INSERT INTO admins (username, password, role, created_at)
          VALUES (${admin.username}, ${admin.password}, ${admin.role}, ${admin.createdAt})
          ON CONFLICT (username) DO NOTHING
        `;
        console.log(`  ✅ Migrated admin: ${admin.username}`);
      } catch (err) {
        console.log(`  ⚠️  Admin already exists or error: ${admin.username}`);
      }
    }

    // ========== MIGRATE USERS ==========
    console.log('\n👥 Migrating users...');
    const users = await UserModel.find();
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      try {
        await sqlClient`
          INSERT INTO users (username, password)
          VALUES (${user.username}, ${user.password})
          ON CONFLICT (username) DO NOTHING
        `;
        console.log(`  ✅ Migrated user: ${user.username}`);
      } catch (err) {
        console.log(`  ⚠️  User already exists or error: ${user.username}`);
      }
    }

    // ========== MIGRATE POSTS ==========
    console.log('\n📝 Migrating posts...');
    const posts = await PostModel.find();
    console.log(`Found ${posts.length} posts`);
    
    for (const post of posts) {
      try {
        await sqlClient`
          INSERT INTO posts (title, content, summary, image, category, tags, author, views, reading_time, featured, created_at)
          VALUES (
            ${post.title},
            ${post.content},
            ${post.summary},
            ${post.image},
            ${post.category},
            ${post.tags},
            ${post.author},
            ${post.views},
            ${post.readingTime},
            ${post.featured},
            ${post.createdAt}
          )
        `;
        console.log(`  ✅ Migrated post: ${post.title}`);
      } catch (err) {
        console.log(`  ⚠️  Error migrating post: ${post.title}`, err.message);
      }
    }

    // ========== MIGRATE COMMENTS ==========
    console.log('\n💬 Migrating comments...');
    const comments = await CommentModel.find();
    console.log(`Found ${comments.length} comments`);
    
    for (const comment of comments) {
      try {
        await sqlClient`
          INSERT INTO comments (post_id, parent_comment_id, name, content, created_at)
          VALUES (
            ${comment.postId},
            ${comment.parentCommentId || null},
            ${comment.name},
            ${comment.content},
            ${comment.createdAt}
          )
        `;
        console.log(`  ✅ Migrated comment by: ${comment.name}`);
      } catch (err) {
        console.log(`  ⚠️  Error migrating comment`, err.message);
      }
    }

    // ========== MIGRATE EVENTS ==========
    console.log('\n📅 Migrating events...');
    const events = await EventModel.find();
    console.log(`Found ${events.length} events`);
    
    for (const event of events) {
      try {
        await sqlClient`
          INSERT INTO events (title, title_ar, description, description_ar, date, type, image)
          VALUES (
            ${event.title},
            ${event.titleAr},
            ${event.description},
            ${event.descriptionAr},
            ${event.date},
            ${event.type},
            ${event.image}
          )
        `;
        console.log(`  ✅ Migrated event: ${event.title}`);
      } catch (err) {
        console.log(`  ⚠️  Error migrating event: ${event.title}`, err.message);
      }
    }

    // ========== MIGRATE NEWS ==========
    console.log('\n📰 Migrating news...');
    const newsItems = await NewsModel.find();
    console.log(`Found ${newsItems.length} news items`);
    
    for (const news of newsItems) {
      try {
        await sqlClient`
          INSERT INTO news (title, title_ar, date_range, image, category, content, content_ar, html_content, author, featured, created_at)
          VALUES (
            ${news.title},
            ${news.titleAr},
            ${news.dateRange},
            ${news.image},
            ${news.category},
            ${news.content},
            ${news.contentAr},
            ${news.htmlContent},
            ${news.author},
            ${news.featured},
            ${news.createdAt}
          )
        `;
        console.log(`  ✅ Migrated news: ${news.title}`);
      } catch (err) {
        console.log(`  ⚠️  Error migrating news: ${news.title}`, err.message);
      }
    }

    // ========== MIGRATE TICKETS ==========
    console.log('\n🎫 Migrating tickets...');
    const tickets = await TicketModel.find();
    console.log(`Found ${tickets.length} tickets`);
    
    for (const ticket of tickets) {
      try {
        const result = await sqlClient`
          INSERT INTO tickets (title, description, user_name, user_email, status, priority, category, created_at, updated_at)
          VALUES (
            ${ticket.title},
            ${ticket.description},
            ${ticket.userName},
            ${ticket.userEmail},
            ${ticket.status},
            ${ticket.priority},
            ${ticket.category},
            ${ticket.createdAt},
            ${ticket.updatedAt}
          )
          RETURNING id
        `;
        console.log(`  ✅ Migrated ticket: ${ticket.title}`);

        // Migrate ticket replies
        const replies = await TicketReplyModel.find({ ticketId: ticket._id.toString() });
        for (const reply of replies) {
          await sqlClient`
            INSERT INTO ticket_replies (ticket_id, author_name, content, is_admin, created_at)
            VALUES (
              ${result[0].id},
              ${reply.authorName},
              ${reply.content},
              ${reply.isAdmin},
              ${reply.createdAt}
            )
          `;
        }
        console.log(`    ✅ Migrated ${replies.length} replies`);
      } catch (err) {
        console.log(`  ⚠️  Error migrating ticket: ${ticket.title}`, err.message);
      }
    }

    // ========== MIGRATE NEWSLETTER SUBSCRIBERS ==========
    console.log('\n📧 Migrating newsletter subscribers...');
    const subscribers = await NewsletterSubscriberModel.find();
    console.log(`Found ${subscribers.length} subscribers`);
    
    for (const subscriber of subscribers) {
      try {
        await sqlClient`
          INSERT INTO newsletter_subscribers (email, created_at)
          VALUES (${subscriber.email}, ${subscriber.createdAt})
          ON CONFLICT (email) DO NOTHING
        `;
        console.log(`  ✅ Migrated subscriber: ${subscriber.email}`);
      } catch (err) {
        console.log(`  ⚠️  Subscriber already exists or error: ${subscriber.email}`);
      }
    }

    console.log('\n✅ Migration completed successfully! 🎉');
    console.log('\n📊 Summary:');
    console.log(`   Admins: ${admins.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Comments: ${comments.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   News: ${newsItems.length}`);
    console.log(`   Tickets: ${tickets.length}`);
    console.log(`   Newsletter Subscribers: ${subscribers.length}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n📦 Disconnected from MongoDB');
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('\n🎊 All done! Your data is now in Neon PostgreSQL');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
