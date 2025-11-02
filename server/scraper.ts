import * as cheerio from 'cheerio';
import type { InsertEvent, InsertNews } from '@shared/schema';

interface ScrapedEvent {
  title: string;
  description: string;
  date: string;
  type: string;
  image: string;
}

interface ScrapedNews {
  title: string;
  dateRange: string;
  image: string;
  category: string;
  content: string;
  author: string;
}

export class Z8GamesScraper {
  private readonly EVENTS_URL = 'https://crossfire.z8games.com/events.html';
  private readonly FORUM_BASE_URL = 'https://forum.z8games.com';

  async scrapeEvents(): Promise<ScrapedEvent[]> {
    try {
      const response = await fetch(this.EVENTS_URL);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const events: ScrapedEvent[] = [];
      
      $('.event-card, .event-item, [class*="event"]').each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('h3, h2, .event-title, [class*="title"]').first().text().trim();
        const description = $el.find('p, .event-description, [class*="description"]').first().text().trim();
        const dateText = $el.find('.event-date, [class*="date"], h4').first().text().trim();
        const imageUrl = $el.find('img').first().attr('src') || '';
        
        if (title && title.length > 3) {
          events.push({
            title,
            description: description || title,
            date: dateText || 'Ongoing',
            type: dateText.toLowerCase().includes('ongoing') ? 'ongoing' : 'upcoming',
            image: imageUrl.startsWith('http') ? imageUrl : `https://z8games.akamaized.net${imageUrl}`
          });
        }
      });
      
      return events.filter((event, index, self) => 
        index === self.findIndex(e => e.title === event.title)
      );
    } catch (error) {
      console.error('Error scraping events:', error);
      return [];
    }
  }

  async scrapeForumAnnouncements(forumUrl?: string): Promise<ScrapedNews[]> {
    try {
      const url = forumUrl || `${this.FORUM_BASE_URL}/categories/crossfire-announcements`;
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const newsItems: ScrapedNews[] = [];
      
      $('article, .discussion, [class*="Discussion"]').each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('h1, h2, h3, .discussion-title, [class*="Title"]').first().text().trim();
        const content = $el.find('p, .discussion-content, [class*="Message"]').first().text().trim();
        const author = $el.find('.author, [class*="Author"], [class*="GM"]').first().text().trim() || 'GM Xenon';
        const dateText = $el.find('time, .date, [class*="Date"]').first().text().trim();
        const imageUrl = $el.find('img').first().attr('src') || '';
        
        if (title && title.length > 5) {
          newsItems.push({
            title,
            dateRange: dateText || new Date().toLocaleDateString(),
            image: imageUrl.startsWith('http') ? imageUrl : imageUrl ? `https://z8games.akamaized.net${imageUrl}` : '',
            category: 'Announcements',
            content: content || title,
            author: author.replace(/\[GM\]/gi, '').trim() || 'GM Xenon'
          });
        }
      });
      
      return newsItems.filter((news, index, self) => 
        index === self.findIndex(n => n.title === news.title)
      ).slice(0, 10);
    } catch (error) {
      console.error('Error scraping forum announcements:', error);
      return [];
    }
  }

  async scrapeSpecificForum(discussionUrl: string): Promise<ScrapedNews | null> {
    try {
      const response = await fetch(discussionUrl);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const title = $('h1').first().text().trim();
      const content = $('article p, .Message p').first().text().trim();
      const author = $('.author, [class*="Author"]').first().text().trim() || 'GM Xenon';
      const dateText = $('time').first().text().trim();
      const imageUrl = $('article img, .Message img').first().attr('src') || '';
      
      if (!title) return null;
      
      return {
        title,
        dateRange: dateText || new Date().toLocaleDateString(),
        image: imageUrl.startsWith('http') ? imageUrl : imageUrl ? `https://z8games.akamaized.net${imageUrl}` : '',
        category: 'News',
        content: content || title,
        author: author.replace(/\[GM\]/gi, '').trim() || 'GM Xenon'
      };
    } catch (error) {
      console.error('Error scraping specific forum:', error);
      return null;
    }
  }

  convertToInsertEvent(scraped: ScrapedEvent): InsertEvent {
    const mappedType = scraped.type === 'ongoing' ? 'trending' : scraped.type;
    
    return {
      title: scraped.title,
      titleAr: scraped.title,
      description: scraped.description,
      descriptionAr: scraped.description,
      date: scraped.date,
      type: mappedType as 'upcoming' | 'trending',
      image: scraped.image
    };
  }

  convertToInsertNews(scraped: ScrapedNews): InsertNews {
    return {
      title: scraped.title,
      titleAr: scraped.title,
      dateRange: scraped.dateRange,
      image: scraped.image,
      category: scraped.category,
      content: scraped.content,
      contentAr: scraped.content,
      author: scraped.author,
      featured: false
    };
  }
}

export const scraper = new Z8GamesScraper();
