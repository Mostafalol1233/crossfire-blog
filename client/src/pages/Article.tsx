import { useParams, Link } from "wouter";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArticleCard, type Article } from "@/components/ArticleCard";
import { CommentSection, type Comment } from "@/components/CommentSection";
import { useLanguage } from "@/components/LanguageProvider";
import tutorialImage from "@assets/generated_images/Tutorial_article_cover_image_2152de25.png";
import newsImage from "@assets/generated_images/News_article_cover_image_13b95cee.png";

export default function Article() {
  const { id } = useParams();
  const { t } = useLanguage();

  const article = {
    id: id || "1",
    title: "Building Modern Web Applications with React and TypeScript",
    content: `
## Introduction

TypeScript has become an essential tool for building robust React applications. In this comprehensive guide, we'll explore the best practices and patterns for combining these two powerful technologies.

## Why TypeScript with React?

TypeScript brings type safety to your React components, catching errors at compile time rather than runtime. This leads to more maintainable code and better developer experience.

### Key Benefits

1. **Type Safety**: Catch errors before they reach production
2. **Better IDE Support**: Enhanced autocomplete and refactoring
3. **Self-Documenting Code**: Types serve as inline documentation
4. **Easier Refactoring**: Change with confidence

## Setting Up Your Project

Start with a new React project using Vite:

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
\`\`\`

## Component Patterns

### Functional Components with Props

Here's how to properly type a functional component:

\`\`\`typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={\`btn btn-\${variant}\`}>
      {label}
    </button>
  );
};
\`\`\`

### Using Hooks with TypeScript

TypeScript works seamlessly with React hooks:

\`\`\`typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
\`\`\`

## Advanced Patterns

### Generic Components

Create reusable components with generics:

\`\`\`typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <div>{items.map(renderItem)}</div>;
}
\`\`\`

## Best Practices

1. Always define prop types with interfaces
2. Use strict mode in tsconfig.json
3. Leverage type inference when possible
4. Create custom hooks with proper typing

## Conclusion

TypeScript and React together provide a powerful foundation for building scalable applications. Start small, and gradually adopt more advanced patterns as your application grows.
    `,
    category: "Tutorials",
    image: tutorialImage,
    author: "Bimora Team",
    authorBio: "Expert developers passionate about modern web technologies",
    date: "Jan 15, 2025",
    readingTime: 8,
    views: 15420,
    tags: ["React", "TypeScript", "Web Dev", "Tutorial"],
  };

  const relatedArticles: Article[] = [
    {
      id: "2",
      title: "Complete Guide to TypeScript Generics",
      summary:
        "Master TypeScript generics with practical examples and best practices.",
      category: "Tutorials",
      image: tutorialImage,
      author: "Sarah Johnson",
      date: "Jan 12, 2025",
      readingTime: 6,
      views: 8230,
      tags: ["TypeScript", "Programming"],
    },
    {
      id: "3",
      title: "Advanced React Patterns and Techniques",
      summary:
        "Dive deep into compound components and custom hooks for flexible UIs.",
      category: "Tutorials",
      image: tutorialImage,
      author: "David Wilson",
      date: "Jan 3, 2025",
      readingTime: 10,
      views: 11200,
      tags: ["React", "Advanced"],
    },
    {
      id: "4",
      title: "Top 10 Web Development Trends for 2025",
      summary:
        "Explore the latest trends shaping the future of web development.",
      category: "News",
      image: newsImage,
      author: "Michael Chen",
      date: "Jan 10, 2025",
      readingTime: 5,
      views: 12350,
      tags: ["Trends", "Web Dev"],
    },
  ];

  const comments: Comment[] = [
    {
      id: "1",
      name: "John Doe",
      content:
        "Great article! Very informative and well-written. The TypeScript examples were particularly helpful. Looking forward to more content like this.",
      date: "2 hours ago",
    },
    {
      id: "2",
      name: "Jane Smith",
      content:
        "Thanks for sharing this. The code examples were really clear and easy to follow. I've bookmarked this for future reference.",
      date: "5 hours ago",
    },
    {
      id: "3",
      name: "Ahmed Hassan",
      content:
        "Excellent tutorial! This helped me understand TypeScript generics much better. Keep up the great work!",
      date: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Button
          variant="ghost"
          asChild
          className="mb-6"
          data-testid="button-back-home"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8 md:mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default" data-testid="badge-category">
                {article.category}
              </Badge>
              {article.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  data-testid={`badge-tag-${tag.toLowerCase()}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-start gap-4 p-6 bg-card rounded-lg border mb-8">
              <Avatar className="h-12 w-12 md:h-16 md:w-16">
                <AvatarFallback className="text-lg">
                  {article.author.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-lg mb-1">
                  {article.author}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {article.authorBio}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{article.date}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {article.readingTime} {t("readingTime")}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()} {t("views")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-lg">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12 md:mb-20"
            dangerouslySetInnerHTML={{
              __html: article.content
                .split("\n")
                .map((line) => {
                  if (line.startsWith("## ")) {
                    return `<h2 class="text-2xl md:text-3xl font-semibold mt-12 mb-4">${line.slice(3)}</h2>`;
                  }
                  if (line.startsWith("### ")) {
                    return `<h3 class="text-xl md:text-2xl font-semibold mt-8 mb-3">${line.slice(4)}</h3>`;
                  }
                  if (line.startsWith("```")) {
                    return line.includes("```bash")
                      ? '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="font-mono text-sm">'
                      : line.includes("```typescript")
                      ? '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="font-mono text-sm">'
                      : "</code></pre>";
                  }
                  if (line.match(/^\d+\./)) {
                    return `<li class="ml-6">${line.slice(line.indexOf(".") + 2)}</li>`;
                  }
                  if (line.trim() === "") return "<br/>";
                  return `<p class="leading-relaxed my-4">${line}</p>`;
                })
                .join(""),
            }}
          />

          <div className="border-t pt-12 md:pt-20 mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">
              {t("relatedArticles")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>

          <div className="border-t pt-12 md:pt-20">
            <CommentSection comments={comments} />
          </div>
        </article>
      </div>
    </div>
  );
}
