import { useState, useEffect } from "react";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreatingNews, setIsCreatingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketReplyContent, setTicketReplyContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

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
    image: "",
  });

  const [newsForm, setNewsForm] = useState({
    title: "",
    dateRange: "",
    image: "",
    category: "News",
    content: "",
    author: "Bimora Team",
    featured: false,
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

  const { data: newsItems } = useQuery<any[]>({
    queryKey: ["/api/news"],
  });

  const { data: tickets } = useQuery<any[]>({
    queryKey: ["/api/tickets"],
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
      setEventForm({ title: "", date: "", type: "upcoming", image: "" });
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

  const createNewsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/news", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsCreatingNews(false);
      setNewsForm({
        title: "",
        dateRange: "",
        image: "",
        category: "News",
        content: "",
        author: "Bimora Team",
        featured: false,
      });
      toast({ title: "News item created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create news item", variant: "destructive" });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/news/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setEditingNews(null);
      toast({ title: "News item updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update news item", variant: "destructive" });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/news/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "News item deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete news item", variant: "destructive" });
    },
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/api/tickets/${id}`, "PATCH", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({ title: "Ticket status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update ticket status", variant: "destructive" });
    },
  });

  const addTicketReplyMutation = useMutation({
    mutationFn: ({ ticketId, content }: { ticketId: string; content: string }) =>
      apiRequest(`/api/tickets/${ticketId}/replies`, "POST", {
        authorName: "Admin",
        content,
        isAdmin: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({ title: "Reply added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add reply", variant: "destructive" });
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/tickets/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({ title: "Ticket deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete ticket", variant: "destructive" });
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

  const handleCreateNews = () => {
    createNewsMutation.mutate(newsForm);
  };

  const handleUpdateNews = () => {
    if (!editingNews) return;
    updateNewsMutation.mutate({
      id: editingNews.id,
      data: newsForm,
    });
  };

  const handlePostDialogChange = (open: boolean) => {
    setIsCreating(open);
    if (!open) {
      setEditingPost(null);
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
    }
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
              <Dialog open={isCreating} onOpenChange={handlePostDialogChange}>
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
                      <div data-testid="input-post-content">
                        <ReactQuill
                          theme="snow"
                          value={postForm.content}
                          onChange={(value) =>
                            setPostForm({ ...postForm, content: value })
                          }
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link', 'blockquote', 'code-block'],
                              ['clean']
                            ],
                          }}
                          placeholder="Write your content here... Format text easily with the toolbar above"
                          style={{ minHeight: '300px' }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use the toolbar to format your text. Copy and paste formatted content to preserve its styling.
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
                <Input
                  placeholder="Image URL (optional)"
                  value={eventForm.image}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, image: e.target.value })
                  }
                  data-testid="input-event-image"
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

        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">News Management</h2>
            <Dialog open={isCreatingNews} onOpenChange={setIsCreatingNews}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-news">
                  <Plus className="h-4 w-4 mr-2" />
                  New News
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNews ? "Edit News Item" : "Create New News Item"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={newsForm.title}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, title: e.target.value })
                    }
                    data-testid="input-news-title"
                  />
                  <Input
                    placeholder="Date Range (e.g., Oct 15 - Nov 4)"
                    value={newsForm.dateRange}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, dateRange: e.target.value })
                    }
                    data-testid="input-news-daterange"
                  />
                  <Input
                    placeholder="Image URL"
                    value={newsForm.image}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, image: e.target.value })
                    }
                    data-testid="input-news-image"
                  />
                  <select
                    value={newsForm.category}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, category: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-md border border-input bg-background"
                    data-testid="select-news-category"
                  >
                    <option value="News">News</option>
                    <option value="Events">Events</option>
                    <option value="Reviews">Reviews</option>
                    <option value="Tutorials">Tutorials</option>
                  </select>
                  <div className="space-y-2">
                    <div data-testid="input-news-content">
                      <ReactQuill
                        theme="snow"
                        value={newsForm.content}
                        onChange={(value) =>
                          setNewsForm({ ...newsForm, content: value })
                        }
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link', 'blockquote', 'code-block'],
                            ['clean']
                          ],
                        }}
                        placeholder="Write your content here... Format text easily with the toolbar above"
                        style={{ minHeight: '300px' }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Use the toolbar to format your text. Copy and paste formatted content to preserve its styling.
                    </p>
                  </div>
                  <Input
                    placeholder="Author"
                    value={newsForm.author}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, author: e.target.value })
                    }
                    data-testid="input-news-author"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newsForm.featured}
                      onChange={(e) =>
                        setNewsForm({
                          ...newsForm,
                          featured: e.target.checked,
                        })
                      }
                      data-testid="checkbox-news-featured"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                  <Button
                    onClick={
                      editingNews ? handleUpdateNews : handleCreateNews
                    }
                    className="w-full"
                    data-testid="button-submit-news"
                  >
                    {editingNews ? "Update News" : "Create News"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems?.map((news: any) => (
              <Card key={news.id} data-testid={`news-card-${news.id}`}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{news.title}</h3>
                          {news.featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {news.dateRange}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                      </div>
                    </div>
                    {news.image && (
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingNews(news);
                          setNewsForm({
                            title: news.title,
                            dateRange: news.dateRange,
                            image: news.image,
                            category: news.category,
                            content: news.content,
                            author: news.author,
                            featured: news.featured,
                          });
                          setIsCreatingNews(true);
                        }}
                        data-testid={`button-edit-news-${news.id}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNewsMutation.mutate(news.id)}
                        data-testid={`button-delete-news-${news.id}`}
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

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Support Tickets</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-medium">All Tickets ({tickets?.length || 0})</h3>
              {tickets?.map((ticket: any) => (
                <Card
                  key={ticket.id}
                  className={`cursor-pointer hover-elevate ${
                    selectedTicket?.id === ticket.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                  data-testid={`admin-ticket-${ticket.id}`}
                >
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm line-clamp-2" data-testid={`text-admin-ticket-title-${ticket.id}`}>{ticket.title}</h4>
                        <Badge className={
                          ticket.status === "open" ? "bg-blue-500" :
                          ticket.status === "in-progress" ? "bg-yellow-500" :
                          ticket.status === "resolved" ? "bg-green-500" : "bg-gray-500"
                        } data-testid={`badge-admin-status-${ticket.id}`}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" data-testid={`badge-admin-priority-${ticket.id}`}>{ticket.priority}</Badge>
                        <Badge variant="outline" data-testid={`badge-admin-category-${ticket.id}`}>{ticket.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid={`text-admin-ticket-meta-${ticket.id}`}>
                        {ticket.userName} • {ticket.createdAt}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedTicket ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="mb-2" data-testid={`text-admin-ticket-detail-title-${selectedTicket.id}`}>{selectedTicket.title}</CardTitle>
                        <div className="flex gap-2 flex-wrap mb-4">
                          <Badge className={
                            selectedTicket.status === "open" ? "bg-blue-500" :
                            selectedTicket.status === "in-progress" ? "bg-yellow-500" :
                            selectedTicket.status === "resolved" ? "bg-green-500" : "bg-gray-500"
                          } data-testid={`badge-admin-detail-status-${selectedTicket.id}`}>
                            {selectedTicket.status}
                          </Badge>
                          <Badge variant="outline" data-testid={`badge-admin-detail-priority-${selectedTicket.id}`}>{selectedTicket.priority}</Badge>
                          <Badge variant="outline" data-testid={`badge-admin-detail-category-${selectedTicket.id}`}>{selectedTicket.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={selectedTicket.status}
                          onChange={(e) => {
                            updateTicketStatusMutation.mutate({
                              id: selectedTicket.id,
                              status: e.target.value,
                            });
                          }}
                          data-testid={`select-ticket-status-${selectedTicket.id}`}
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTicketMutation.mutate(selectedTicket.id)}
                          data-testid={`button-delete-ticket-${selectedTicket.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">User Details</h4>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <p data-testid={`text-admin-user-name-${selectedTicket.id}`}><strong>Name:</strong> {selectedTicket.userName}</p>
                        <p data-testid={`text-admin-user-email-${selectedTicket.id}`}><strong>Email:</strong> {selectedTicket.userEmail}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap" data-testid={`text-admin-ticket-description-${selectedTicket.id}`}>
                        {selectedTicket.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Admin Reply</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your admin reply..."
                          value={ticketReplyContent}
                          onChange={(e) => setTicketReplyContent(e.target.value)}
                          rows={4}
                          data-testid={`textarea-admin-reply-${selectedTicket.id}`}
                        />
                        <Button
                          onClick={() => {
                            if (!ticketReplyContent.trim()) return;
                            addTicketReplyMutation.mutate({
                              ticketId: selectedTicket.id,
                              content: ticketReplyContent,
                            });
                            setTicketReplyContent("");
                          }}
                          disabled={!ticketReplyContent.trim()}
                          data-testid={`button-send-admin-reply-${selectedTicket.id}`}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Select a ticket to view and manage</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
