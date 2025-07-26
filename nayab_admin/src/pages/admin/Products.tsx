import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { ProductForm } from "@/components/admin/ProductForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, Filter, Package, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext"

const backendUrl = import.meta.env.VITE_API_BASE_URL;
const getImageUrl = (img: string) => img && img.startsWith('http') ? img : `${backendUrl}${img}`;

export default function Products() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const { token } = useAuth();

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${backendUrl}/admin/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const data = await res.json()
      setProducts(data.products || [])
    } catch (err) {
      setError("Failed to load products.")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleCloseForm = (shouldReload = false) => {
    setShowForm(false)
    setEditingProduct(null)
    if (shouldReload) fetchProducts()
  }

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${backendUrl}/admin/products/${productId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await res.json();
      if (res.ok) {
        fetchProducts();
      } else {
        setError(result.message || "Failed to delete product.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to delete product.");
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <AdminLayout>
        <div className="p-6">
          <ProductForm 
            onCancel={() => handleCloseForm(true)}
            initialData={editingProduct}
          />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {/* Total Products */}
        <div className="text-right text-sm text-muted-foreground font-medium">
          Total Products: {products.length}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Package className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="decorative">Decorative</SelectItem>
                  <SelectItem value="lighting">Lighting</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Product Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <Card><CardContent className="py-12 text-center">Loading products...</CardContent></Card>
          ) : error ? (
            <Card><CardContent className="py-12 text-center text-destructive">{error}</CardContent></Card>
          ) : paginatedProducts.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
              onClick={e => {
                // Prevent card click if clicking on an action button
                if ((e.target as HTMLElement).closest('button')) return;
                setViewProduct(product);
                setShowViewDialog(true);
              }}
            >
              <div className="relative">
                <img
                  src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : "/api/placeholder/200/200"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.featured && (
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Featured
                  </Badge>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={e => {
                        e.stopPropagation();
                        setViewProduct(product);
                        setShowViewDialog(true);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={e => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(product._id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ${product.price}
                    </span>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {product.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>SKU:</span>
                      <span className="font-mono">{product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stock:</span>
                      <span className={product.stock === 0 ? "text-destructive" : ""}>
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="capitalize">{product.category}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && !loading && !error && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button size="icon" variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft /></Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i+1} variant={currentPage === i+1 ? "default" : "outline"} size="icon" onClick={() => setCurrentPage(i+1)}>{i+1}</Button>
            ))}
            <Button size="icon" variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight /></Button>
          </div>
        )}

        {(!loading && !error && filteredProducts.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Product Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
          {viewProduct && (
            <>
              <DialogHeader className="p-0 flex flex-row items-center justify-between">
                <DialogTitle className="text-2xl font-bold mb-2">{viewProduct.name}</DialogTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={() => {
                    setShowViewDialog(false);
                    setEditingProduct(viewProduct);
                    setShowForm(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </DialogHeader>
              <img
                src={viewProduct.images && viewProduct.images.length > 0 ? getImageUrl(viewProduct.images[0]) : "/placeholder.png"}
                alt={viewProduct.name}
                className="w-full h-64 object-cover rounded-t-lg mb-4"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {viewProduct.featured && <Badge className="text-xs" variant="secondary">Featured</Badge>}
                  <Badge variant="secondary" className="text-xs">{viewProduct.category}</Badge>
                  <Badge variant={viewProduct.status === "active" ? "default" : "secondary"}>{viewProduct.status}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {viewProduct.createdAt ? new Date(viewProduct.createdAt).toLocaleString() : ""}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-1">Description</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{viewProduct.description}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-1">Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div><span className="font-semibold text-gray-700">Price:</span> ${viewProduct.price}</div>
                    <div><span className="font-semibold text-gray-700">Stock:</span> {viewProduct.stock} units</div>
                    <div><span className="font-semibold text-gray-700">SKU:</span> {viewProduct.sku}</div>
                    <div><span className="font-semibold text-gray-700">Category:</span> {viewProduct.category}</div>
                  </div>
                </div>
                {viewProduct.features && viewProduct.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-1">Features</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {viewProduct.features.map((f: string, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}