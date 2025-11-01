import { 
  type User, 
  type InsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Event,
  type InsertEvent,
  type News,
  type InsertNews,
  users,
  posts,
  comments,
  events,
  news
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface NewsItem {
  id: string;
  title: string;
  dateRange: string;
  image: string;
  featured?: boolean;
  category: string;
  content: string;
  author: string;
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
  createNews(news: Partial<NewsItem>): Promise<NewsItem>;
  updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem | undefined>;
  deleteNews(id: string): Promise<boolean>;

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

    initialPosts.push(
      {
        id: "ewc-2025-crossfire",
        title: "CrossFire at 2025 Esports World Cup: The Battle for Glory",
        content: `# CROSSFIRE at 2025 Esports World Cup: August 15th - 24th

## Attention Mercenaries!

**THE BATTLE FOR GLORY STARTS NOW!** The **2025 Esports World Cup** is officially underway, and the stage is set for a world-class head-to-head battle! To celebrate the kickoff, the **Champions Pass** is back with exciting rewards!

## Event Details

From **August 15th until the 24th**, dive into the action via the in-game **Esports Tab** — cheer on your favorite teams, complete epic Missions, and level up your pass to score **items, crates, and characters**. Let the hype begin!

## Champions Pass Rewards

Progress through 20 levels of exclusive rewards:

### Level 1-5
- Champions Pass
- Bulletproof Package 14 Days
- Survival Gear 7 days
- 5 CFS Energy Crates
- 5 CFS Brave Crates

### Level 6-10
- CFS Festival Weapons 7 Days
- 5 CFS Festival Crates
- CFS Triumph Weapons 7 Days
- 5 CFS Triumph Crates
- 5 CFS Hero Crates

### Level 11-15
- 5 CFS Fervor Crates
- CFS Bliss Weapons 30 Days
- 5 CFS Bliss Crates
- Katy 30 days
- 5 CFS Aurora Crates

### Level 16-20
- CFS24 GF Weapons 30 Days
- 10 CFS24 GF Crates
- 10 CFS Galaxy Crates
- Gigi 30 days
- **EWC x CF Champion 2025 Rewards**

## Watch the Action Live

### EWC Stream Schedule

The tournament features top teams from around the globe competing for a **$2 million USD prize pool**!

**Stream Times (ET):**
- August 19-22: Watch Missions between 4:00 AM - 12:00 PM
- August 23: Watch Missions between 3:00 AM - 12:30 PM

**Watch the stream in-game** to qualify for the events and catch all the action live! You can also watch on Twitch and share with your friends.

## Location & Format

- **Location**: Riyadh, Saudi Arabia
- **Prize Pool**: $2 million USD
- **Format**: Teams from across the globe competing in the highest-level CROSSFIRE tournament
- **Special Event**: Champions Pass rewards including exclusive weapons, crates, and character items

## How to Participate

1. Launch CrossFire and navigate to the Esports Tab
2. Complete daily missions during the tournament
3. Watch live streams to earn bonus rewards
4. Level up your Champions Pass for exclusive items
5. Support your favorite teams!

Don't miss out on this historic World Cup event, Mercenaries!

**- CrossFire Team**`,
        summary: "CrossFire makes its debut at the 2025 Esports World Cup in Riyadh with a $2M prize pool, Champions Pass rewards, and exclusive in-game content from August 15-24.",
        image: "/assets/news-superfans.jpg",
        category: "Events",
        tags: ["Esports", "World Cup", "Tournament", "Champions Pass", "Rewards"],
        author: "[GM]Xenon",
        featured: false,
        readingTime: 5,
        views: 8934,
        createdAt: new Date("2025-10-30")
      },
      {
        id: "16bit-weapons-release",
        title: "16-Bit Retro Weapons Collection: Gaming Nostalgia Meets Modern Warfare",
        content: `# 16-Bit Weapons: A Pixel Perfect Arsenal

## Nostalgia Hits Different

Get ready to relive the golden age of gaming! CrossFire is thrilled to announce the release of the **16-Bit Weapons Collection** - a stunning tribute to classic video game aesthetics that brings retro pixel art into modern tactical combat.

## The Collection

Released on **September 30th**, this limited-time collection transforms your arsenal into works of pixelated perfection:

### Featured Weapons

**Assault Rifles:**
- **AK-47-16Bit**: The legendary assault rifle reimagined with vibrant pixel art
- **M4A1-16Bit**: Tactical precision meets retro design

**Sniper Rifles:**
- **Barrett M82A1-Prismatic Demon**: A devastating sniper with holographic pixel effects
- **AWM-16Bit**: Long-range dominance in 8-bit glory

**SMGs:**
- **MP5-16Bit**: Close-quarters combat with arcade-style flair
- **P90-16Bit**: Futuristic meets retro

### Special Melee Weapons
- **Banana Knife Pop Art**: A playful addition to the retro arsenal
- **Mini Watercolor Melee**: Artistic expression in combat

## Visual Design

Each weapon features:
- **Authentic pixel art** inspired by 16-bit era gaming
- **Vibrant color palettes** with neon accents
- **Animated effects** that pulse and glow
- **Unique kill markers** with retro game sounds
- **Custom reload animations** with pixel transitions

## How to Obtain

The 16-Bit Weapons are available through:

### 16-Bit Crates
- Available in the Black Market
- Limited-time availability
- Contains random 16-Bit weapons
- Bonus rewards for multiple openings

### VG Weapons Crate
- Special Video Game themed crate
- Higher chance for premium 16-Bit weapons
- Exclusive character skins included

## Pair It With Characters

Complete your retro look with these matching characters:
- **Game Girl Character**: A gaming enthusiast turned soldier
- **Pixel Pop Set**: Full outfit with matching accessories

## Community Response

The CrossFire community has been buzzing with excitement since the announcement. Players are sharing their favorite weapon combinations and creating montage videos showcasing the stunning visual effects.

Popular combinations include:
- Barrett-Prismatic Demon + Game Girl Character
- AK-47-16Bit + Banana Knife Pop Art
- Full 16-Bit loadout for ultimate nostalgia

## Limited Time Event

Don't miss out on this nostalgic journey! The 16-Bit collection is available for a limited time only. Log in now to add these iconic weapons to your arsenal and dominate the battlefield in pixel-perfect style.

### Event Duration
- **Start**: September 30
- **End**: October 27
- **Availability**: Black Market and Special Crates

## Tips for Collection

1. **Daily Login**: Log in every day for bonus crates
2. **Complete Missions**: Special 16-Bit themed missions offer guaranteed rewards
3. **Trading**: Some 16-Bit items are tradeable with other players
4. **Bundle Deals**: Look for special bundle offers in the shop

## The Power of Nostalgia

The 16-Bit collection isn't just about aesthetics - it's about celebrating gaming history while enjoying cutting-edge FPS action. Each weapon performs identically to its standard counterpart but offers a unique visual experience that turns heads on the battlefield.

**Relive the classics. Dominate the present. Get your 16-Bit weapons today!**

**- CrossFire Team**`,
        summary: "The 16-Bit Retro Weapons Collection brings pixel-perfect nostalgia to CrossFire with vibrant retro-styled weapons, special effects, and matching character skins available for a limited time.",
        image: "/assets/feature-weap.jpg",
        category: "News",
        tags: ["Weapons", "16-Bit", "Retro", "Collection", "Limited Edition"],
        author: "Biomera Team",
        featured: false,
        readingTime: 6,
        views: 7256,
        createdAt: new Date("2025-10-28")
      },
      {
        id: "anti-cheat-update",
        title: "CrossFire Anti-Cheat System: Major Security Update",
        content: `# Anti-Cheat News: Protecting Fair Play

## Commitment to Fair Competition

At CrossFire, we believe in maintaining a fair and competitive environment for all players. We're excited to announce major updates to our anti-cheat system that will enhance security and ensure everyone enjoys a level playing field.

## What's New

Released on **October 16th**, our updated anti-cheat system features:

### Advanced Detection Technology

**Real-Time Monitoring:**
- Enhanced behavioral analysis to detect unusual patterns
- Machine learning algorithms that adapt to new cheating methods
- Instant flagging of suspicious activity
- Automatic screenshot collection during matches

**Hardware Fingerprinting:**
- Unique device identification
- Ban evasion prevention
- Multi-account cheater tracking
- Cross-region violation sharing

### Improved Reporting System

We've completely overhauled the player reporting interface:

**New Features:**
- In-game report button with instant submission
- Video evidence upload capability
- Detailed report categories (aimbot, wallhack, speed hack, etc.)
- Report status tracking
- Community feedback on reports

### Transparent Ban System

We believe in transparency. Our new system includes:
- **Public ban announcements** for repeat offenders
- **Ban duration clarity** (temporary vs. permanent)
- **Appeal process** for false positives
- **Evidence review** for contested bans

## Zero Tolerance Policy

CrossFire maintains a strict zero-tolerance policy for cheating:

### First Offense
- **Account Suspension**: 30 days minimum
- **Rank Reset**: All competitive progress removed
- **Inventory Lock**: Premium items frozen during suspension

### Second Offense
- **Permanent Account Ban**
- **Hardware ID Ban**: Prevents new account creation
- **Community Blacklist**: Shared with partner regions

### Severe Cases
Egregious violations including:
- Cheat development or distribution
- Account boosting services
- Tournament cheating
- Server exploitation

Result in immediate permanent bans with no appeal option.

## Community Involvement

### Trusted Reporter Program

Active community members can join our Trusted Reporter program:
- Priority review of submitted reports
- Access to advanced reporting tools
- Monthly rewards for accurate reports
- Direct communication with anti-cheat team

### Fair Play Rewards

Players maintaining clean records receive:
- **Fair Play Badge**: Display your integrity
- **Exclusive Skins**: Quarterly rewards for good behavior
- **Priority Matchmaking**: Faster queues with verified players
- **VIP Support**: Enhanced customer service access

## Technical Improvements

Our development team has implemented:

### Server-Side Verification
- Hit registration validation
- Movement pattern analysis
- Impossible action detection
- Bullet trajectory verification

### Client Protection
- Memory scanning prevention
- Process injection blocking
- DLL injection detection
- Modified file identification

## Player Privacy

While enhancing security, we remain committed to privacy:
- **Minimal data collection**: Only what's necessary for cheat detection
- **Encrypted transmission**: All data securely transmitted
- **Limited retention**: Data deleted after verification
- **No personal info sharing**: Your privacy is protected

## Community Response

Since implementing these updates, we've seen:
- **68% reduction** in reported cheating incidents
- **92% positive feedback** from the community
- **45% increase** in player retention
- **Cleaner competitive environment** across all ranks

## How You Can Help

1. **Report Suspicious Behavior**: Use the in-game report feature
2. **Stay Informed**: Follow official channels for updates
3. **Protect Your Account**: Never share login credentials
4. **Avoid Third-Party Software**: Only use official CrossFire clients

## Looking Forward

This is just the beginning. Our anti-cheat team continuously monitors emerging threats and develops countermeasures. Future updates will include:
- AI-powered cheat prediction
- Enhanced mobile anti-cheat for CrossFire: Legends
- Cross-platform security synchronization
- Community-driven security initiatives

## Conclusion

Fair play is the foundation of competitive gaming. With these comprehensive anti-cheat measures, CrossFire is safer and more competitive than ever. Together, we're building a community where skill and strategy triumph over deception.

**Play Fair. Play CrossFire.**

**- CrossFire Security Team**`,
        summary: "CrossFire unveils comprehensive anti-cheat system update featuring advanced detection technology, improved reporting, transparent banning, and community involvement programs to ensure fair play.",
        image: "/assets/feature-comp.jpg",
        category: "News",
        tags: ["Anti-Cheat", "Security", "Fair Play", "Updates", "Community"],
        author: "Biomera Security Team",
        featured: false,
        readingTime: 7,
        views: 6812,
        createdAt: new Date("2025-10-26")
      },
      {
        id: "halloween-creative-contest",
        title: "Halloween Creative Contest & Boo-tique Bargains 2025",
        content: `# Halloween Creative Contest & Spooky Savings!

## Get Ready for a Frighteningly Good Time!

The spooky season is upon us, and CrossFire is celebrating with not one, but TWO spine-tingling events! Get ready for the **Halloween Creative Contest** and exclusive **Boo-tique Bargains** that'll make your Halloween gaming experience unforgettable.

## Halloween Creative Contest

### Show Us Your Spooky Side!

From **October 15th - November 1st**, we're inviting the CrossFire community to unleash their creativity with Halloween-themed content!

### Contest Categories

**Fan Art:**
- Digital illustrations
- Traditional drawings
- 3D character models
- Weapon skin designs
- Map concept art

**Content Creation:**
- Halloween-themed montages
- Spooky gameplay highlights
- CrossFire horror stories
- Costume showcases
- Creative screenshots

**Written Content:**
- Short stories set in CrossFire universe
- Character backstories
- Map lore and legends
- Halloween event narratives

### Amazing Prizes!

**Grand Prize (1 Winner):**
- 100,000 ZP
- Exclusive Halloween 2025 Weapon Collection (Permanent)
- Custom namecard featuring your artwork
- Featured on official CrossFire social media
- In-game title: "Halloween Legend"

**Runner-Up (3 Winners):**
- 50,000 ZP
- Pumpkin Bloodline Weapon Set (30 days)
- Featured in community showcase
- In-game title: "Spooky Creator"

**Honorable Mentions (10 Winners):**
- 25,000 ZP
- Halloween mystery crate
- Community recognition

### How to Enter

1. Create your Halloween-themed content
2. Post on social media with #CrossFireHalloween2025
3. Submit entry link through official contest portal
4. Wait for community voting (October 25-29)
5. Winners announced October 31st!

## Boo-tique Bargains Event

### Spooky Savings You Can't Resist!

From **October 29th - November 2nd**, the Boo-tique is open for business with frighteningly good deals!

### Featured Items on Sale

**Weapons (Up to 40% Off):**
- Copycat-Halloween Character Bundle
- Armsel Striker-Ignite
- Green Dragon Kriss Super V
- Halloween 2025 Weapon Set
- M4A1-S T Javelin Beast

**Character Skins (Special Pricing):**
- Nano Copycat-P.B. (30% off)
- Duskira Witch (25% off)
- Kaia Character (20% off)
- Personal Security-Spectral (35% off)

**Limited Edition:**
- **Pumpkin Bloodline Set** (October 23 only)
  - Complete armor set with glowing jack-o-lantern effects
  - Matching weapons with pumpkin particle effects
  - Exclusive pumpkin melee weapon

### Daily Flash Sales

Each day features 2-hour flash sales with up to 60% discounts:
- **October 29**: Halloween crates (11 AM - 1 PM ET)
- **October 30**: Character bundles (6 PM - 8 PM ET)
- **October 31**: Weapon skins (12 PM - 2 PM ET)
- **November 1**: Mystery boxes (9 AM - 11 AM ET)
- **November 2**: Final clearance (8 PM - 10 PM ET)

## Halloween Weekend Party Rewards

### Login Bonuses

Log in during the Halloween weekend to receive:
- **Friday**: Pumpkin grenade skin
- **Saturday**: Spider web namecard
- **Sunday**: Bat wing spray
- **Bonus**: Log in all 3 days for exclusive Halloween avatar frame

### Halloween Missions

Complete special Halloween-themed missions for rewards:

**Mission 1: Trick or Treat**
- Get 100 kills in Halloween-themed maps
- Reward: 5,000 GP + Halloween crate key

**Mission 2: Haunted Victory**
- Win 25 matches during event period
- Reward: Temporary Halloween weapon (7 days)

**Mission 3: Graveyard Guardian**
- Survive 50 rounds in Mutation mode
- Reward: Exclusive "Zombie Hunter" title

**Mission 4: Costume Party**
- Play 10 matches with a Halloween character skin
- Reward: Permanent Halloween spray collection

## CrossFire Cauldron Mini-Game

### Brew Your Luck!

The CrossFire Cauldron returns with Halloween magic! Drop ingredients into the cauldron and receive random rewards:

**Possible Rewards:**
- Rare weapon skins
- Character fragments
- ZP vouchers
- Premium crates
- Exclusive Halloween items

**How to Play:**
- Collect ingredients through daily missions
- Visit the Cauldron in the Event Hub
- Choose your ingredients wisely
- Watch the magic happen!
- Claim your rewards!

## Community Events

### Costume Contest (In-Game)**  
Show off your best Halloween character customization:
- **Prize**: Most creative outfit wins 50,000 ZP
- **Voting**: Community vote via social media
- **Deadline**: October 31st, 11:59 PM ET

### Halloween Tournament
- **Date**: October 31st, 7 PM ET
- **Format**: 5v5 Search & Destroy
- **Prize Pool**: 500,000 ZP distributed among top 8 teams
- **Special Rule**: Halloween skins only!

## Don't Miss Out!

This Halloween brings together creativity, competition, and incredible savings. Whether you're an artist, content creator, or deal hunter, there's something for everyone in CrossFire's Halloween celebration!

**Join the festivities, show your creativity, and grab these limited-time deals before they vanish into the night!**

**Happy Halloween, Mercenaries!**

**- CrossFire Team**`,
        summary: "Join CrossFire's Halloween celebration with a creative contest featuring amazing prizes, exclusive Boo-tique bargains with up to 60% off, special weekend missions, and community events from October 15 - November 2.",
        image: "/assets/news-halloween.jpg",
        category: "Events",
        tags: ["Halloween", "Contest", "Sale", "Creative", "Community", "Limited Time"],
        author: "[GM]Ganbatte",
        featured: false,
        readingTime: 8,
        views: 9341,
        createdAt: new Date("2025-10-25")
      }
    );

    initialPosts.forEach((post) => this.posts.set(post.id, post));

    // Initialize news items
    const newsItems: NewsItem[] = [
      {
        id: "mystic-moonlight-market",
        title: "Mystic Moonlight Market",
        dateRange: "October 15 - November 4",
        image: "/assets/news-sapphire.jpg",
        category: "Events",
        author: "[GM]Ganbatte",
        featured: true,
        content: `Attention Mercenaries!!

For there to be darkness there must be light. In the shadows of the night, when the abyss devours all light possible, the light of the Mystic Moonlight Market cuts through it all!

From October 15th to November 4th, the USP Match-Obsidian Beast illuminates the Lapis Prospect alongside Corinne in the Black Market! Gather them to your side to also take home their Namecards and Sprays.

Available Items:
- [NC]USP Match-Obsidian Beast + [SP]USP Match-Obsidian Beast
- [NC] Corinne + [SP] Corinne

Got your eyes on more than one prize? Check out the other weapons also on display in the Lapis Prospect!

Featured Weapons:
- M14EBR-S-Carapace Harvester
- M200Cheytac-Dominator Harvester
- COP.357-Dominator Harvester
- M37 Stakeout-Harvester
- Huskbreaker

## M4A1-S & Barrett Infinity Weapon Select Box

Not to be outdone in matters of light and darkness, the M4A1-S & Barrett Infinity Weapon Select Box is showing off in style!

Available celestial beings:
- M4A1-S-Angel
- M4A1-S-Demon
- Barrett-Angel
- Barrett-Demon

## Smoke-Jackstalk Bonus

Wait, there is something waiting in the fog! The Smoke-Jackstalk! For every 50 Lapis you buy, you will receive one Smoke-Jackstalk - with no limit!

Will you follow the light to your destiny, Mercenaries? Or...Will you let the darkness embrace you?

-CrossFire Team`
      },
      {
        id: "cf-event-pass-season-5",
        title: "CF Event Pass Season 5 Rewind",
        dateRange: "September 30 - December 3",
        image: "/assets/feature-weap.jpg",
        category: "Events",
        author: "[GM]Ganbatte",
        content: `Attention Mercenaries,

Sometimes the best way to keep things fresh is to rewind back to basics!

CF Event Pass Season 5: Rewind has begun! From September 30 to December 3, don't adjust your monitors - we really are going retro. This season brings arcade style treasures, mercenaries who have seen real battle, and other rewards.

## Here's what you can Rewind to:

Complete missions to earn Battle Coins and unlock tiered rewards.

Spend your Battle Coins in the Coin Shop, stocked with exclusive loot.

Some rewards require specific pass levels to unlock, so don't let your progress go cold!

## Premium Event Pass

Premium Event Pass is available for 30,000 ZP, unlocking even more legendary items. To reach the highest peaks of power, you'll need to redeem rewards in order. Once you hit Level 100 and you have claimed all your premium loot, you can try your luck in the new and fabled Bonus Prospect.

## Extra Levels & Battle Coins

Missed a few missions or rewound too far? No worries, you can purchase levels and even receive extra Battle Coins as a bonus. But beware: unused coins will vanish after the grace period once the season ends, so spend them before they disappear!

Go Back to The Action, Mercenaries!`
      },
      {
        id: "cfs-super-fans",
        title: "CFS Super Fans",
        dateRange: "October 22 - November 4",
        image: "/assets/news-superfans.jpg",
        category: "Events",
        author: "[GM]Xenon",
        content: `Attention Mercenaries,

CFS Super Fans has arrived! Show your support for your favorite Pro team and score some epic weapons from the Citrine Well while you're at it!

From October 22nd until November 4th, this special event will bring an exciting touch to your CrossFire experience. During this period, the Citrine Well will serve as your portal to unlock an arsenal of CFS-themed weapons. Whether cheering for your favorite team or diving into the game, this is your chance to enhance your gameplay and celebrate the spirit of competition.

## New Weapons Available

- M4A1-S-CFS Sunfire Iron Beast
- AWM-CFS Sunfire Ironhawk
- Barrett-CFS Sunfire Demon

## Returning Weapons

- QBZ-03-CFS Mirage Jewelry
- Scar Light-S-CFS Dusk Tiger
- Cheytac-CFS Jupiter Dominator

## Weapon Select Boxes

### CFS Fervor Weapon Select Box
- AK47-K-CFS Fervor
- AWM-CFS Fervor
- D.Eagle-CFS Fervor
- J.Knife-CFS Fervor

### CFS Bliss Weapon Select Box
- AA-12-CFS Bliss
- Barrett-CFS Bliss
- COP.357-CFS Bliss
- D.Karambit-CFS Bliss

### CFS24 GF Weapon Select Box
- M4A1-S-CFS24 GF
- FRF2-CFS24 GF
- Anaconda-CFS24 GF
- B.Knuckles-CFS24 GF

## Special Features

By purchasing at this special CFS Citrine Well during the event period, you will get the chance to win some amazing weapons, and a portion of the proceeds will also go directly to 2025 eSports.

If you don't win a weapon, you will still gain a random amount of exchange coins from opening Citrine crates, which you can use to redeem each weapon once.

Each Citrine you purchase also gives you a Wishing Ticket with a random amount of Wishing EXP. The Wishing Well will grant your favorite weapons once you have accumulated enough Wishing EXP.

Once you have earned enough Wishing EXP, you can redeem your prize and switch to another wish. However, be careful not to switch while you have already placed EXP, or your progress will be reset.

Don't miss out! Join the celebration and embrace the competition!

-CrossFire Team`
      },
      {
        id: "crossfire-2025-roadmap",
        title: "CrossFire 2025 Roadmap",
        dateRange: "2025 Updates",
        image: "/assets/feature-crossfire.jpg",
        category: "News",
        author: "Biomera Team",
        content: "CrossFire 2025: The Ultimate Gaming Experience Awaits - New maps, weapons, characters, CF Pass Season 9, mobile game return, Esports World Cup debut, and the development of CrossFire 2."
      },
      {
        id: "grave-games",
        title: "Grave Games - The Spider's Web",
        dateRange: "October 1 - 31",
        image: "/assets/news-gravegames.jpg",
        category: "Events",
        author: "CrossFire Team",
        content: "Enter the Spider's Web this Halloween season! Complete challenges, earn exclusive rewards, and check your progress through the Grave Games portal."
      },
      {
        id: "boo-tique-bargains",
        title: "Boo-tique Bargains",
        dateRange: "October 29 - November 2",
        image: "/assets/news-halloween.jpg",
        category: "Events",
        author: "CrossFire Team",
        content: "Get spooky savings at the Boo-tique! Limited time Halloween deals on exclusive weapons, characters, and cosmetic items. Don't miss these frightfully good bargains!"
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
      {
        id: "11",
        name: "SWAT Enforcer",
        image: "/assets/merc-desperado.jpg",
        role: "Tactical Officer",
      },
      {
        id: "12",
        name: "Delta Operative",
        image: "/assets/merc-sisterhood.jpg",
        role: "Special Operations",
      },
      {
        id: "13",
        name: "Night Stalker",
        image: "/assets/merc-blackmamba.jpg",
        role: "Stealth Operations",
      },
      {
        id: "14",
        name: "Combat Medic",
        image: "/assets/merc-wolf.jpg",
        role: "Medical Support",
      },
      {
        id: "15",
        name: "Marksman",
        image: "/assets/merc-vipers.jpg",
        role: "Sniper",
      },
      {
        id: "16",
        name: "Urban Assault",
        image: "/assets/merc-archhonorary.jpg",
        role: "Close Quarters",
      },
      {
        id: "17",
        name: "Ghost Recon",
        image: "/assets/merc-ronin.jpg",
        role: "Reconnaissance",
      },
      {
        id: "18",
        name: "Demolitions Expert",
        image: "/assets/merc-dean.jpg",
        role: "Explosives",
      },
      {
        id: "19",
        name: "Heavy Gunner",
        image: "/assets/merc-thoth.jpg",
        role: "Support",
      },
      {
        id: "20",
        name: "Cyber Ops",
        image: "/assets/merc-sfg.jpg",
        role: "Tech Specialist",
      },
      {
        id: "21",
        name: "Shadow Hunter",
        image: "/assets/merc-desperado.jpg",
        role: "Infiltrator",
      },
      {
        id: "22",
        name: "Breach Specialist",
        image: "/assets/merc-sisterhood.jpg",
        role: "Entry Team",
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
      parentCommentId: insertComment.parentCommentId ?? null,
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

  async createNews(newsData: Partial<NewsItem>): Promise<NewsItem> {
    const id = randomUUID();
    const news: NewsItem = {
      id,
      title: newsData.title || "",
      dateRange: newsData.dateRange || "",
      image: newsData.image || "",
      category: newsData.category || "News",
      content: newsData.content || "",
      author: newsData.author || "",
      featured: newsData.featured ?? false,
    };
    this.news.set(id, news);
    return news;
  }

  async updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem | undefined> {
    const news = this.news.get(id);
    if (!news) return undefined;
    
    const updatedNews = { ...news, ...updates };
    this.news.set(id, updatedNews);
    return updatedNews;
  }

  async deleteNews(id: string): Promise<boolean> {
    return this.news.delete(id);
  }

  // Mercenaries methods
  async getAllMercenaries(): Promise<Mercenary[]> {
    return Array.from(this.mercenaries.values());
  }
}

export class DatabaseStorage implements IStorage {
  private mercenaries: Map<string, Mercenary>;

  constructor() {
    this.mercenaries = new Map();
    this.initializeMercenaries();
  }

  private initializeMercenaries() {
    const mercenaries: Mercenary[] = [
      {
        id: "1",
        name: "Wolf",
        image: "/assets/merc-wolf.jpg",
        role: "Assault",
      },
      {
        id: "2",
        name: "Vipers",
        image: "/assets/merc-vipers.jpg",
        role: "Sniper",
      },
      {
        id: "3",
        name: "Sisterhood",
        image: "/assets/merc-sisterhood.jpg",
        role: "Medic",
      },
      {
        id: "4",
        name: "Black Mamba",
        image: "/assets/merc-blackmamba.jpg",
        role: "Scout",
      },
      {
        id: "5",
        name: "Arch Honorary",
        image: "/assets/merc-archhonorary.jpg",
        role: "Tank",
      },
      {
        id: "6",
        name: "Desperado",
        image: "/assets/merc-desperado.jpg",
        role: "Engineer",
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
      {
        id: "11",
        name: "SWAT Enforcer",
        image: "/assets/merc-desperado.jpg",
        role: "Tactical Officer",
      },
      {
        id: "12",
        name: "Delta Operative",
        image: "/assets/merc-sisterhood.jpg",
        role: "Special Operations",
      },
      {
        id: "13",
        name: "Night Stalker",
        image: "/assets/merc-blackmamba.jpg",
        role: "Stealth Operations",
      },
      {
        id: "14",
        name: "Combat Medic",
        image: "/assets/merc-wolf.jpg",
        role: "Medical Support",
      },
      {
        id: "15",
        name: "Marksman",
        image: "/assets/merc-vipers.jpg",
        role: "Sniper",
      },
      {
        id: "16",
        name: "Urban Assault",
        image: "/assets/merc-archhonorary.jpg",
        role: "Close Quarters",
      },
      {
        id: "17",
        name: "Ghost Recon",
        image: "/assets/merc-ronin.jpg",
        role: "Reconnaissance",
      },
      {
        id: "18",
        name: "Demolitions Expert",
        image: "/assets/merc-dean.jpg",
        role: "Explosives",
      },
      {
        id: "19",
        name: "Heavy Gunner",
        image: "/assets/merc-thoth.jpg",
        role: "Support",
      },
      {
        id: "20",
        name: "Cyber Ops",
        image: "/assets/merc-sfg.jpg",
        role: "Tech Specialist",
      },
      {
        id: "21",
        name: "Shadow Hunter",
        image: "/assets/merc-desperado.jpg",
        role: "Infiltrator",
      },
      {
        id: "22",
        name: "Breach Specialist",
        image: "/assets/merc-sisterhood.jpg",
        role: "Entry Team",
      },
    ];

    mercenaries.forEach((merc) => this.mercenaries.set(merc.id, merc));
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      const result = await db.select().from(posts).orderBy(desc(posts.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting all posts:", error);
      return [];
    }
  }

  async getPostById(id: string): Promise<Post | undefined> {
    try {
      const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting post by id:", error);
      return undefined;
    }
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    try {
      const result = await db.insert(posts).values(insertPost).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  async updatePost(id: string, updates: Partial<InsertPost>): Promise<Post | undefined> {
    try {
      const result = await db.update(posts).set(updates).where(eq(posts.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error("Error updating post:", error);
      return undefined;
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      const result = await db.delete(posts).where(eq(posts.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  }

  async incrementPostViews(id: string): Promise<void> {
    try {
      const post = await this.getPostById(id);
      if (post) {
        await db.update(posts).set({ views: post.views + 1 }).where(eq(posts.id, id));
      }
    } catch (error) {
      console.error("Error incrementing post views:", error);
    }
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      const result = await db.select().from(comments).where(eq(comments.postId, postId)).orderBy(desc(comments.createdAt));
      return result;
    } catch (error) {
      console.error("Error getting comments by post id:", error);
      return [];
    }
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    try {
      const result = await db.insert(comments).values(insertComment).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const result = await db.select().from(events);
      return result;
    } catch (error) {
      console.error("Error getting all events:", error);
      return [];
    }
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    try {
      const result = await db.insert(events).values(insertEvent).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    try {
      const result = await db.delete(events).where(eq(events.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  }

  async getAllNews(): Promise<NewsItem[]> {
    try {
      const result = await db.select().from(news);
      return result.map((item) => ({
        id: item.id,
        title: item.title,
        dateRange: item.dateRange,
        image: item.image,
        category: item.category,
        content: item.content,
        author: item.author,
        featured: item.featured,
      }));
    } catch (error) {
      console.error("Error getting all news:", error);
      return [];
    }
  }

  async createNews(newsData: Partial<NewsItem>): Promise<NewsItem> {
    try {
      const insertData: InsertNews = {
        title: newsData.title || "",
        dateRange: newsData.dateRange || "",
        image: newsData.image || "",
        category: newsData.category || "News",
        content: newsData.content || "",
        author: newsData.author || "",
        featured: newsData.featured ?? false,
      };
      
      const result = await db.insert(news).values(insertData).returning();
      const item = result[0];
      
      return {
        id: item.id,
        title: item.title,
        dateRange: item.dateRange,
        image: item.image,
        category: item.category,
        content: item.content,
        author: item.author,
        featured: item.featured,
      };
    } catch (error) {
      console.error("Error creating news:", error);
      throw error;
    }
  }

  async updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem | undefined> {
    try {
      const updateData: Partial<InsertNews> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.dateRange !== undefined) updateData.dateRange = updates.dateRange;
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.featured !== undefined) updateData.featured = updates.featured;

      const result = await db.update(news).set(updateData).where(eq(news.id, id)).returning();
      
      if (result.length === 0) return undefined;
      
      const item = result[0];
      return {
        id: item.id,
        title: item.title,
        dateRange: item.dateRange,
        image: item.image,
        category: item.category,
        content: item.content,
        author: item.author,
        featured: item.featured,
      };
    } catch (error) {
      console.error("Error updating news:", error);
      return undefined;
    }
  }

  async deleteNews(id: string): Promise<boolean> {
    try {
      const result = await db.delete(news).where(eq(news.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error deleting news:", error);
      return false;
    }
  }

  async getAllMercenaries(): Promise<Mercenary[]> {
    return Array.from(this.mercenaries.values());
  }
}

export const storage = new DatabaseStorage();
