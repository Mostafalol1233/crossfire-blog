import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Eye,
  MessageSquare,
  FileText,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Upload,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    summary: "",
    image: "",
    category: "Tutorials",
    tags: "",
    author: "Bimora Team",
    featured: false,
    readingTime: 5,
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    type: "upcoming" as "upcoming" | "trending",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: stats } = useQuery<{
    totalPosts: number;
    totalComments: number;
    totalViews: number;
    recentPosts: any[];
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: posts } = useQuery<any[]>({
    queryKey: ["/api/posts"],
  });

  const { data: events } = useQuery<any[]>({
    queryKey: ["/api/events"],
  });

  const createPostMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/posts", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsCreating(false);
      setPostForm({
        title: "",
        content: "",
        summary: "",
        image: "",
        category: "Tutorials",
        tags: "",
        author: "Bimora Team",
        featured: false,
        readingTime: 5,
      });
      toast({ title: "Post created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create post", variant: "destructive" });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/posts/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setEditingPost(null);
      toast({ title: "Post updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update post", variant: "destructive" });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/posts/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Post deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete post", variant: "destructive" });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/events", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setEventForm({ title: "", date: "", type: "upcoming" });
      toast({ title: "Event created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create event", variant: "destructive" });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/events/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete event", variant: "destructive" });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedImageUrl(data.url);
      setImageFile(null);
      toast({ title: "Image uploaded successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to upload image", variant: "destructive" });
    },
  });

  const handleImageUpload = () => {
    if (imageFile) {
      uploadImageMutation.mutate(imageFile);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(uploadedImageUrl);
    setCopied(true);
    toast({ title: "URL copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreatePost = () => {
    createPostMutation.mutate({
      ...postForm,
      tags: postForm.tags.split(",").map((t) => t.trim()),
    });
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;
    updatePostMutation.mutate({
      id: editingPost.id,
      data: {
        ...postForm,
        tags: postForm.tags.split(",").map((t) => t.trim()),
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Comments
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalComments || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Posts</h2>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-post">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? "Edit Post" : "Create New Post"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Title"
                      value={postForm.title}
                      onChange={(e) =>
                        setPostForm({ ...postForm, title: e.target.value })
                      }
                      data-testid="input-post-title"
                    />
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Content (Markdown supported - **bold**, *italic*, # Heading, etc.)"
                        value={postForm.content}
                        onChange={(e) =>
                          setPostForm({ ...postForm, content: e.target.value })
                        }
                        rows={10}
                        data-testid="input-post-content"
                      />
                      <p className="text-xs text-muted-foreground">
                        Markdown formatting: **bold**, *italic*, # Heading, - List, [link](url). Emojis and special characters are supported in content.
                      </p>
                    </div>
                    <Textarea
                      placeholder="Summary (optional)"
                      value={postForm.summary}
                      onChange={(e) =>
                        setPostForm({ ...postForm, summary: e.target.value })
                      }
                      rows={3}
                      data-testid="input-post-summary"
                    />
                    <Input
                      placeholder="Image URL"
                      value={postForm.image}
                      onChange={(e) =>
                        setPostForm({ ...postForm, image: e.target.value })
                      }
                      data-testid="input-post-image"
                    />
                    <select
                      value={postForm.category}
                      onChange={(e) =>
                        setPostForm({ ...postForm, category: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-md border border-input bg-background"
                      data-testid="select-post-category"
                    >
                      <option>Tutorials</option>
                      <option>News</option>
                      <option>Reviews</option>
                      <option>Events</option>
                    </select>
                    <Input
                      placeholder="Tags (comma separated)"
                      value={postForm.tags}
                      onChange={(e) =>
                        setPostForm({ ...postForm, tags: e.target.value })
                      }
                      data-testid="input-post-tags"
                    />
                    <Input
                      placeholder="Author"
                      value={postForm.author}
                      onChange={(e) =>
                        setPostForm({ ...postForm, author: e.target.value })
                      }
                      data-testid="input-post-author"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={postForm.featured}
                        onChange={(e) =>
                          setPostForm({
                            ...postForm,
                            featured: e.target.checked,
                          })
                        }
                        data-testid="checkbox-post-featured"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                    <Button
                      onClick={
                        editingPost ? handleUpdatePost : handleCreatePost
                      }
                      className="w-full"
                      data-testid="button-submit-post"
                    >
                      {editingPost ? "Update Post" : "Create Post"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {posts?.map((post: any) => (
                <Card key={post.id} data-testid={`post-card-${post.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{post.title}</h3>
                          {post.featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {post.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{post.category}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingPost(post);
                            setPostForm({
                              title: post.title,
                              content: post.content,
                              summary: post.summary,
                              image: post.image,
                              category: post.category,
                              tags: post.tags.join(", "),
                              author: post.author,
                              featured: post.featured,
                              readingTime: post.readingTime,
                            });
                            setIsCreating(true);
                          }}
                          data-testid={`button-edit-${post.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Image Upload</h2>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Upload to Catbox.moe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setUploadedImageUrl("");
                      }
                    }}
                    data-testid="input-image-upload"
                  />
                  {imageFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>
                
                <Button
                  onClick={handleImageUpload}
                  disabled={!imageFile || uploadImageMutation.isPending}
                  className="w-full"
                  data-testid="button-upload-image"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadImageMutation.isPending ? "Uploading..." : "Upload Image"}
                </Button>

                {uploadedImageUrl && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Image URL:</p>
                    <div className="flex gap-2">
                      <Input
                        value={uploadedImageUrl}
                        readOnly
                        data-testid="input-uploaded-url"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyUrl}
                        data-testid="button-copy-url"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use this URL in your posts for images hosted on catbox.moe
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold mb-4">Events Ribbon</h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Add New Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Event title"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  data-testid="input-event-title"
                />
                <Input
                  placeholder="Date"
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  data-testid="input-event-date"
                />
                <select
                  value={eventForm.type}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      type: e.target.value as "upcoming" | "trending",
                    })
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-background"
                  data-testid="select-event-type"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="trending">Trending</option>
                </select>
                <Button
                  onClick={() => createEventMutation.mutate(eventForm)}
                  className="w-full"
                  data-testid="button-create-event"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {events?.map((event: any) => (
                <Card key={event.id} data-testid={`event-card-${event.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.date} • {event.type}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEventMutation.mutate(event.id)}
                        data-testid={`button-delete-event-${event.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
