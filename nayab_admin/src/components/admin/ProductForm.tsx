import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Upload, Save, X, Plus, Trash2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/context/AuthContext";
import axios from "axios"

// Add productSchema and ProductFormData/type definitions back
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.union([z.string(), z.number()]).transform(val => val.toString()).refine(val => val.length > 0, { message: "Price is required" }),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  brand: z.string(),
  sku: z.string().min(1, "SKU is required"),
  stock: z.union([z.string(), z.number()]).transform(val => val.toString()).refine(val => val.length > 0, { message: "Stock quantity is required" }),
  featured: z.boolean().default(false),
  status: z.enum(["Active", "Inactive"])
});
type ProductFormData = z.infer<typeof productSchema>;
interface ProductFormProps {
  onCancel: () => void;
  initialData?: Partial<ProductFormData>;
}

export function ProductForm({ onCancel, initialData }: ProductFormProps) {
  const [productImages, setProductImages] = useState<string[]>([])
  const [productImageFiles, setProductImageFiles] = useState<File[]>([])
  const { toast } = useToast()
  const { token } = useAuth();

  // Dynamic categories and subcategories
  const [categories, setCategories] = useState<{ name: string, subcategories: string[] }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialData?.subcategory || "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(res.data.categories || []);
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch categories.", variant: "destructive" });
      }
    };
    if (token) fetchCategories();
  }, [token, toast]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: initialData && initialData.price !== undefined ? String(initialData.price) : "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      brand: "",
      sku: "",
      stock: initialData && initialData.stock !== undefined ? String(initialData.stock) : "",
      featured: false,
      status: "Active",
      ...initialData
    }
  })

  // If editing, show existing images
  useEffect(() => {
    if (initialData && (initialData as any).images) {
      setProductImages((initialData as any).images.map((img: string) =>
        img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}${img}`
      ));
    }
  }, [initialData]);

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.price !== initialData?.price) formData.append("price", data.price);
    formData.append("category", data.category);
    if (data.subcategory) formData.append("subcategory", data.subcategory);
    formData.append("brand", data.brand);
    formData.append("sku", data.sku);
    if (data.stock !== initialData?.stock) formData.append("stock", data.stock);
    formData.append("featured", String(data.featured));
    formData.append("status", data.status);
    productImageFiles.forEach((file) => {
      formData.append("images", file);
    });
    try {
      let response;
      if (initialData && (initialData as any)._id) {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products/${(initialData as any)._id}`, {
          method: "PUT",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products`, {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      }
      const result = await response.json();
      if (response.ok) {
        toast({
          title: initialData ? "Product updated successfully!" : "Product created successfully!",
          description: result.message || "Your product has been saved to the database.",
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setProductImageFiles(prev => [...prev, ...newFiles]);
      const newImages = newFiles.map(file => URL.createObjectURL(file));
      setProductImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setProductImageFiles(prev => prev.filter((_, i) => i !== index));
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
            <span>{initialData ? "Edit Product" : "Create New Product"}</span>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter product name..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Detailed product description..." 
                                rows={6}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <FormControl>
                                <Input placeholder="Brand name..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="SKU-12345..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Images */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Images</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {productImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {productImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={image} 
                                alt={`Product ${index + 1}`} 
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="product-images"
                        />
                        <label htmlFor="product-images">
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Images
                            </span>
                          </Button>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Pricing & Inventory */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Pricing & Inventory</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Category & Subcategory */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Category</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedCategory(value);
                                setSelectedSubcategory("");
                                form.setValue("subcategory", "");
                              }}
                              value={selectedCategory}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.name} value={cat.name}>
                                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Subcategory dropdown, only show if category has subcategories */}
                      {selectedCategory && (categories.find(c => c.name === selectedCategory)?.subcategories.length ?? 0) > 0 && (
                        <FormField
                          control={form.control}
                          name="subcategory"
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>Subcategory</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedSubcategory(value);
                                }}
                                value={selectedSubcategory}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select subcategory" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {(categories.find(c => c.name === selectedCategory)?.subcategories || []).map((subcat) => (
                                    <SelectItem key={subcat} value={subcat}>
                                      {subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>

                  {/* Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Product</FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Display on homepage
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {initialData ? "Update Product" : "Save Product"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}