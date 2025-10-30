import { Link } from "wouter";
import { useLanguage } from "./LanguageProvider";
import { SiGithub, SiX, SiLinkedin } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t("home"), path: "/" },
    { label: t("about"), path: "/about" },
    { label: t("contact"), path: "/contact" },
  ];

  const categories = [
    { label: t("news"), path: "/category/news" },
    { label: t("reviews"), path: "/category/reviews" },
    { label: t("tutorials"), path: "/category/tutorials" },
    { label: t("events"), path: "/category/events" },
  ];

  return (
    <footer className="border-t bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent mb-4">
              Bimora
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your source for modern web development knowledge and tech insights.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4">
              {t("categories")}
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.path}>
                  <Link
                    href={cat.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-category-${cat.label.toLowerCase()}`}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get the latest articles delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email"
                className="h-9"
                data-testid="input-newsletter-email"
              />
              <Button size="sm" data-testid="button-newsletter-submit">
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            {t("copyright")}
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-social-github"
            >
              <SiGithub className="h-5 w-5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-social-x"
            >
              <SiX className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-social-linkedin"
            >
              <SiLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
