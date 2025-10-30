import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ArticleCard, type Article } from "@/components/ArticleCard";
import { EventsRibbon, type Event } from "@/components/EventsRibbon";
import { CategoryFilter, type Category } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";
import { Sidebar } from "@/components/Sidebar";
import { useLanguage } from "@/components/LanguageProvider";
import tutorialImage from "@assets/generated_images/Tutorial_article_cover_image_2152de25.png";
import newsImage from "@assets/generated_images/News_article_cover_image_13b95cee.png";
import eventsImage from "@assets/generated_images/Events_article_cover_image_a2828103.png";

export default function Home() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const heroPost = {
    id: "1",
    title: "Building Modern Web Applications with React and TypeScript",
    summary:
      "Learn how to create scalable, type-safe applications using the latest features of React 18 and TypeScript 5. Master best practices for component architecture and state management.",
    category: "Tutorials",
    image: tutorialImage,
    author: "Bimora Team",
    date: "Jan 15, 2025",
    readingTime: 8,
    views: 15420,
  };

  const events: Event[] = [
    {
      id: "1",
      title: "New React 19 Features Released",
      date: "Jan 20",
      type: "upcoming",
    },
    {
      id: "2",
      title: "TypeScript 5.4 Beta Available",
      date: "Jan 18",
      type: "trending",
    },
    {
      id: "3",
      title: "Web Dev Conference 2025",
      date: "Feb 5",
      type: "upcoming",
    },
    {
      id: "4",
      title: "AI Tools for Developers",
      date: "Trending",
      type: "trending",
    },
    {
      id: "5",
      title: "Next.js 15 Launch Event",
      date: "Jan 25",
      type: "upcoming",
    },
  ];

  const allArticles: Article[] = [
    {
      id: "2",
      title: "Complete Guide to TypeScript Generics",
      summary:
        "Master TypeScript generics with practical examples and best practices for building reusable components.",
      category: "Tutorials",
      image: tutorialImage,
      author: "Sarah Johnson",
      date: "Jan 12, 2025",
      readingTime: 6,
      views: 8230,
      tags: ["TypeScript", "Programming", "Web Dev"],
      featured: true,
    },
    {
      id: "3",
      title: "Top 10 Web Development Trends for 2025",
      summary:
        "Explore the latest trends shaping the future of web development, from AI integration to edge computing.",
      category: "News",
      image: newsImage,
      author: "Michael Chen",
      date: "Jan 10, 2025",
      readingTime: 5,
      views: 12350,
      tags: ["Trends", "Web Dev", "Technology"],
    },
    {
      id: "4",
      title: "Review: The Best Code Editors in 2025",
      summary:
        "An in-depth comparison of VS Code, WebStorm, and Sublime Text. Which editor is right for you?",
      category: "Reviews",
      image: newsImage,
      author: "Alex Martinez",
      date: "Jan 8, 2025",
      readingTime: 7,
      views: 9840,
      tags: ["Tools", "Reviews", "Productivity"],
    },
    {
      id: "5",
      title: "Upcoming Tech Conferences You Can't Miss",
      summary:
        "Mark your calendar for these essential technology events happening throughout 2025.",
      category: "Events",
      image: eventsImage,
      author: "Emily Davis",
      date: "Jan 5, 2025",
      readingTime: 4,
      views: 6720,
      tags: ["Events", "Conferences", "Networking"],
    },
    {
      id: "6",
      title: "Advanced React Patterns and Techniques",
      summary:
        "Dive deep into compound components, render props, and custom hooks for building flexible UIs.",
      category: "Tutorials",
      image: tutorialImage,
      author: "David Wilson",
      date: "Jan 3, 2025",
      readingTime: 10,
      views: 11200,
      tags: ["React", "Advanced", "Patterns"],
    },
    {
      id: "7",
      title: "Breaking: Major Security Update for Node.js",
      summary:
        "Critical vulnerability patched in latest Node.js release. Update your applications immediately.",
      category: "News",
      image: newsImage,
      author: "Security Team",
      date: "Jan 1, 2025",
      readingTime: 3,
      views: 18900,
      tags: ["Security", "Node.js", "Updates"],
      featured: true,
    },
    {
      id: "8",
      title: "Tailwind CSS vs Bootstrap: 2025 Comparison",
      summary:
        "Which CSS framework should you choose for your next project? We break down the pros and cons.",
      category: "Reviews",
      image: newsImage,
      author: "CSS Expert",
      date: "Dec 28, 2024",
      readingTime: 8,
      views: 14560,
      tags: ["CSS", "Frameworks", "Comparison"],
    },
    {
      id: "9",
      title: "Virtual Workshop: Building with Next.js 14",
      summary:
        "Join our hands-on workshop to learn server components, streaming, and more in Next.js 14.",
      category: "Events",
      image: eventsImage,
      author: "Workshop Team",
      date: "Dec 25, 2024",
      readingTime: 2,
      views: 5430,
      tags: ["Workshop", "Next.js", "Learning"],
    },
  ];

  const filteredArticles = allArticles.filter((article) => {
    const matchesCategory =
      activeCategory === "all" ||
      article.category.toLowerCase() === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const recentPosts = [
    {
      id: "10",
      title: "Getting Started with Next.js 14",
      image: tutorialImage,
      date: "2 days ago",
    },
    {
      id: "11",
      title: "CSS Grid Layout Mastery",
      image: newsImage,
      date: "4 days ago",
    },
    {
      id: "12",
      title: "API Design Best Practices",
      image: eventsImage,
      date: "1 week ago",
    },
  ];

  const popularTags = [
    { name: "React", count: 45 },
    { name: "TypeScript", count: 38 },
    { name: "CSS", count: 32 },
    { name: "JavaScript", count: 56 },
    { name: "Node.js", count: 29 },
    { name: "Web Dev", count: 41 },
  ];

  const mostViewed = [
    { id: "13", title: "Understanding React Hooks in Depth", views: 25400 },
    { id: "14", title: "Modern CSS Techniques", views: 18900 },
    { id: "15", title: "Building REST APIs with Node.js", views: 16200 },
  ];

  const bimoraPicks = [
    {
      id: "16",
      title: "The Future of Web Development",
      image: tutorialImage,
      date: "Jan 10",
    },
    {
      id: "17",
      title: "Microservices Architecture Guide",
      image: newsImage,
      date: "Jan 8",
    },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection post={heroPost} />

      <EventsRibbon events={events} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <main className="lg:col-span-8 space-y-8 md:space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {t("categories")}
              </h2>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
              </div>

              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No articles found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </main>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Sidebar
                recentPosts={recentPosts}
                popularTags={popularTags}
                mostViewed={mostViewed}
                bimoraPicks={bimoraPicks}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
