import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    about: "About",
    contact: "Contact",
    categories: "Categories",
    all: "All",
    news: "News",
    reviews: "Reviews",
    tutorials: "Tutorials",
    events: "Events",
    search: "Search articles...",
    readMore: "Read More",
    recentPosts: "Recent Posts",
    popularTags: "Popular Tags",
    mostViewed: "Most Viewed",
    bimoraPicks: "Bimora's Picks",
    readingTime: "min read",
    views: "views",
    latest: "Latest",
    popular: "Popular",
    featured: "Featured",
    relatedArticles: "Related Articles",
    comments: "Comments",
    addComment: "Add a comment",
    submit: "Submit",
    admin: "Admin Dashboard",
    logout: "Logout",
    login: "Login",
    copyright: "© 2025 Bimora Blog Pro — All Rights Reserved",
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    contact: "اتصل بنا",
    categories: "التصنيفات",
    all: "الكل",
    news: "أخبار",
    reviews: "مراجعات",
    tutorials: "دروس",
    events: "فعاليات",
    search: "ابحث عن المقالات...",
    readMore: "اقرأ المزيد",
    recentPosts: "آخر المقالات",
    popularTags: "الوسوم الشائعة",
    mostViewed: "الأكثر مشاهدة",
    bimoraPicks: "اختيارات بيمورا",
    readingTime: "دقيقة قراءة",
    views: "مشاهدة",
    latest: "الأحدث",
    popular: "الأكثر شعبية",
    featured: "مميز",
    relatedArticles: "مقالات ذات صلة",
    comments: "التعليقات",
    addComment: "أضف تعليقاً",
    submit: "إرسال",
    admin: "لوحة الإدارة",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    copyright: "© 2025 Bimora Blog Pro — جميع الحقوق محفوظة",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", language);
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
