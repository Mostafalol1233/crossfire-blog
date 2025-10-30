import { useLanguage } from "@/components/LanguageProvider";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          {t("about")} Bimora Blog Pro
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Welcome to Bimora Blog Pro, your premier source for insights on
            modern web development, technology trends, and programming
            tutorials.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-4">
            Our Mission
          </h2>
          <p className="leading-relaxed">
            We're dedicated to providing high-quality content that helps
            developers stay current with the latest technologies and best
            practices. From beginner-friendly tutorials to advanced techniques,
            we cover it all.
          </p>

          <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-4">
            What We Cover
          </h2>
          <ul className="space-y-2 ml-6 list-disc">
            <li>React, TypeScript, and modern JavaScript frameworks</li>
            <li>Web development best practices and patterns</li>
            <li>Technology news and industry trends</li>
            <li>Tool reviews and comparisons</li>
            <li>Upcoming tech events and conferences</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-4">
            Join Our Community
          </h2>
          <p className="leading-relaxed">
            Connect with fellow developers, share your insights, and stay
            updated with the latest in web development. Follow us on social
            media and subscribe to our newsletter for regular updates.
          </p>
        </div>
      </div>
    </div>
  );
}
