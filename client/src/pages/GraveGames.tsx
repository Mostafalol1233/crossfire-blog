import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function GraveGames() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-destructive via-primary to-destructive bg-clip-text text-transparent">
            GRAVE GAMES
          </h1>
          <p className="text-lg text-muted-foreground">
            The Spider's Web Awaits
          </p>
        </div>

        <div className="mb-8">
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-8">
            <img
              src="/assets/news-gravegames.jpg"
              alt="Grave Games - The Spider's Web"
              className="absolute inset-0 w-full h-full object-cover"
              data-testid="img-grave-games-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                The Spider's Web
              </h2>
              <p className="text-white/90 text-lg">
                October 1 - 31, 2025
              </p>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Event Information</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Enter the Spider's Web this Halloween season! Complete thrilling challenges, 
                  earn exclusive rewards, and prove your skills in this limited-time event.
                </p>
                
                <p>
                  Navigate through the treacherous web of challenges designed to test even 
                  the most experienced mercenaries. Each completed challenge brings you 
                  closer to unlocking rare weapons, character skins, and special Halloween-themed items.
                </p>

                <div className="bg-muted/50 rounded-lg p-6 mt-6">
                  <h4 className="text-lg font-semibold mb-3 text-foreground">Event Features</h4>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Complete daily and weekly challenges</li>
                    <li>Earn exclusive Halloween-themed rewards</li>
                    <li>Unlock special character skins and weapon camos</li>
                    <li>Track your progress through the event portal</li>
                    <li>Compete with other mercenaries on the leaderboard</li>
                  </ul>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mt-6">
                  <h4 className="text-lg font-semibold mb-3 text-foreground">
                    Limited Time Only
                  </h4>
                  <p className="text-sm">
                    This event runs from October 1st through October 31st. Don't miss your 
                    chance to collect these exclusive Halloween items before the web disappears!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <a
              href="https://www.z8games.com/login.html?returnurl=https://crossfire.z8games.com/event/gravegames_progress"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-login-progress"
            >
              <Button
                size="lg"
                className="gap-2"
                data-testid="button-login-check-progress"
              >
                <ExternalLink className="h-5 w-5" />
                Login to Check Your Progress
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
