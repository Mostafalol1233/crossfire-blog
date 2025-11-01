import { useLanguage } from "@/components/LanguageProvider";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          {t("about")} Bemora Gaming
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Welcome to Bemora Gaming, your premier source for CrossFire news,
            character guides, weapon reviews, and gaming updates.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-4">
            Our Mission
          </h2>
          <p className="leading-relaxed">
            We're dedicated to providing comprehensive CrossFire gaming content 
            that helps players stay updated with the latest news, master new 
            characters, and improve their gameplay. From beginner guides to 
            advanced strategies, we cover it all.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-4">
            What We Cover
          </h2>
          <ul className="space-y-2 ml-6 list-disc">
            <li>CrossFire game news and updates</li>
            <li>Character guides and mercenary profiles</li>
            <li>Weapon reviews and gameplay tips</li>
            <li>Community events and tournaments</li>
            <li>Game modes and strategy guides</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-4">
            Join Our Community
          </h2>
          <p className="leading-relaxed">
            Connect with fellow CrossFire players, share your gaming experiences, 
            and stay updated with the latest game updates. Follow us on social
            media and subscribe to our newsletter for regular updates.
          </p>
        </div>
      </div>
    </div>
  );
}
