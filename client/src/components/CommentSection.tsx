import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "./LanguageProvider";

export interface Comment {
  id: string;
  name: string;
  content: string;
  date: string;
}

interface CommentSectionProps {
  comments: Comment[];
}

export function CommentSection({ comments }: CommentSectionProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    console.log("Comment submitted:", { name, comment });
    setName("");
    setComment("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold">
        {t("comments")} ({comments.length})
      </h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("addComment")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="input-comment-name"
          />
          <Textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            data-testid="input-comment-text"
          />
          <Button onClick={handleSubmit} data-testid="button-submit-comment">
            {t("submit")}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} data-testid={`comment-${comment.id}`}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback>
                    {comment.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {comment.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
