import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/LanguageProvider";

interface NewsItem {
  id: string;
  title: string;
  dateRange: string;
  image: string;
  featured?: boolean;
}

export default function News() {
  const { t } = useLanguage();

  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          {t("news")} & Updates
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className={`${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <Card
                className={`relative overflow-hidden group hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer ${
                  index === 0 ? "h-full min-h-[400px]" : "h-[300px]"
                }`}
                data-testid={`card-news-${item.id}`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3
                      className={`font-bold mb-2 ${
                        index === 0
                          ? "text-3xl md:text-4xl"
                          : "text-xl md:text-2xl"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/80">{item.dateRange}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="backdrop-blur-sm"
            data-testid="button-read-more-news"
          >
            READ MORE NEWS
          </Button>
        </div>
      </div>
    </div>
  );
}
