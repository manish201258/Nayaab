"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, X, Clock, Eye, Share2, User, Globe, Hash, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt must be less than 500 characters"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string(),
  status: z.enum(["Draft", "Published", "Archived"]),
  featured: z.boolean().default(false),
  featuredImage: z.string().optional(),
  authorName: z.string().min(1, "Author name is required"),
  authorBio: z.string().optional(),
  authorAvatar: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  publishDate: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  onCancel: () => void;
  initialData?: Partial<BlogFormData>;
}

export function BlogForm({ onCancel, initialData }: BlogFormProps) {
  const [featuredImage, setFeaturedImage] = useState<string | null>(initialData?.featuredImage || null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(initialData?.authorAvatar || null);
  const [authorAvatarFile, setAuthorAvatarFile] = useState<File | null>(null);
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      tags: "",
      status: "Draft",
      featured: false,
      authorName: "Nayaab Team",
      authorBio: "Antique Collection Expert",
      facebookUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      publishDate: new Date().toISOString().split("T")[0],
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData?.featuredImage) setFeaturedImage(initialData.featuredImage);
    if (initialData?.authorAvatar) setAuthorAvatar(initialData.authorAvatar);
  }, [initialData]);

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const onSubmit = async (data: BlogFormData) => {
    const formData = new FormData();
    // Generate slug from title
    const slug = slugify(data.title);
    
    formData.append("title", data.title);
    formData.append("slug", slug); // Auto-generated slug
    formData.append("excerpt", data.excerpt);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("tags", data.tags);
    formData.append("status", data.status);
    formData.append("featured", data.featured.toString());
    formData.append("authorName", data.authorName);
    formData.append("authorBio", data.authorBio || "");
    formData.append("facebookUrl", data.facebookUrl || "");
    formData.append("twitterUrl", data.twitterUrl || "");
    formData.append("instagramUrl", data.instagramUrl || "");
    formData.append("publishDate", data.publishDate || new Date().toISOString());

    if (featuredImageFile) {
      formData.append("featuredImage", featuredImageFile);
    } else if (featuredImage && !featuredImage.startsWith("blob:")) {
      formData.append("featuredImage", featuredImage);
    }
    if (authorAvatarFile) {
      formData.append("authorAvatar", authorAvatarFile);
    } else if (authorAvatar && !authorAvatar.startsWith("blob:")) {
      formData.append("authorAvatar", authorAvatar);
    }

    try {
      let response;
      if (initialData && (initialData as any)._id) {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/blogs/${(initialData as any)._id}`, {
          method: "PUT",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/blogs`, {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      }
      const result = await response.json();
      if (response.ok) {
        toast({
          title: initialData ? "Blog updated successfully!" : "Blog created successfully!",
          description: result.message || "Your blog post has been saved to the database.",
        });
        onCancel();
      } else {
        toast({
          title: "Error",
          description: result.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "featured" | "author") => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "featured") {
        setFeaturedImageFile(file);
        setFeaturedImage(URL.createObjectURL(file));
      } else {
        setAuthorAvatarFile(file);
        setAuthorAvatar(URL.createObjectURL(file));
      }
    }
  };

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? "Edit Blog Post" : "Create New Blog Post"}</span>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter blog title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write your blog content here..." rows={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Featured Image */}
                  <Card className="p-4">
                    <CardTitle className="text-sm flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4" /> Featured Image
                    </CardTitle>
                    <CardContent className="p-0 space-y-2">
                      {featuredImage && (
                        <div className="relative">
                          <img src={featuredImage} alt="Featured" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setFeaturedImage(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={featuredInputRef}
                        onChange={(e) => handleImageUpload(e, "featured")}
                        style={{ display: "none" }}
                        id="featured-image"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => featuredInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload Image
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Author Information */}
                  <Card className="p-4">
                    <CardTitle className="text-sm flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" /> Author
                    </CardTitle>
                    <CardContent className="p-0 space-y-2">
                      <FormField
                        control={form.control}
                        name="authorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Author name..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="authorBio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief bio..." rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {authorAvatar && (
                        <div className="relative">
                          <img src={authorAvatar} alt="Author" className="w-full h-24 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setAuthorAvatar(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        ref={authorInputRef}
                        onChange={(e) => handleImageUpload(e, "author")}
                        style={{ display: "none" }}
                        id="author-avatar"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => authorInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload Avatar
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4" /> Classification
                  </CardTitle>
                  <CardContent className="p-0 space-y-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="antique">Antique</SelectItem>
                              <SelectItem value="art">Art</SelectItem>
                              <SelectItem value="collection">Collection</SelectItem>
                              <SelectItem value="luxury">Luxury</SelectItem>
                              <SelectItem value="rare">Rare</SelectItem>
                              <SelectItem value="vintage">Vintage</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="culture">Culture</SelectItem>
                              <SelectItem value="expertise">Expertise</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., luxury, antique..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2 mb-2">
                    <Share2 className="h-4 w-4" /> Social
                  </CardTitle>
                  <CardContent className="p-0 space-y-2">
                    <FormField
                      control={form.control}
                      name="facebookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitterUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instagramUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Publish Settings */}
              <Card className="p-4 mt-6">
                <CardTitle className="text-sm flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" /> Publish
                </CardTitle>
                <CardContent className="p-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <p className="text-sm text-gray-500">Highlight on homepage</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" /> {initialData ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}