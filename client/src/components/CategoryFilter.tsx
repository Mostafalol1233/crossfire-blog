import { Button } from "@/components/ui/button";
import { useLanguage } from "./LanguageProvider";

export type Category = "all" | "news" | "reviews" | "tutorials" | "events";

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { t } = useLanguage();

  const categories: Category[] = [
    "all",
    "news",
    "reviews",
    "tutorials",
    "events",
  ];

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => {
            console.log(`Category changed to: ${category}`);
            onCategoryChange(category);
          }}
          className="whitespace-nowrap"
          data-testid={`button-category-${category}`}
        >
          {t(category)}
        </Button>
      ))}
    </div>
  );
}
