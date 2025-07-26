import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Package, Search, TrendingUp, X, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) // Updated to use populated user.name
  );

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleUpdate = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setIsUpdateModalOpen(true);
    setUpdateError(null);
  };

  const submitUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/orders/${selectedOrder._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }), // Note: backend expects { status }, not { orderStatus }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order status");
      }

      // Refresh orders after update
      await fetchOrders();
      setIsUpdateModalOpen(false);
    } catch (err: any) {
      setUpdateError(err.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gradient-to-b from-[#f7f5ef] to-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
            <p className="text-muted-foreground">Monitor and manage all customer orders in one place.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchOrders} className="text-[#B8956A] hover:text-[#B8956A]/80">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.orderStatus === "processing").length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{
                  orders.reduce((sum, o) => {
                    if (o.orderStatus === 'delivered') return sum + o.totalAmount;
                    if (o.orderStatus === 'cancelled' && o.wasDeliveredBeforeCancel) return sum - o.totalAmount;
                    return sum;
                  }, 0).toFixed(2)
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 border-[#B8956A]/30 focus:border-[#B8956A] transition-colors"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm animate-pulse">Loading orders...</div>
            ) : error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground text-sm">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="py-3 px-4">{order.user?.name || "Guest"}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 rounded-full ${
                              order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : order.orderStatus === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">₹{order.totalAmount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleView(order)}
                                    className="text-[#B8956A] hover:text-[#B8956A]/80 transition-colors"
                                  >
                                    <Eye className="h-4 w-4 mr-1" /> View
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View detailed order info</TooltipContent>
                              </Tooltip>
                              {order.orderStatus !== "cancelled" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleUpdate(order)}
                                      className="text-[#B8956A] hover:text-[#B8956A]/80 transition-colors"
                                    >
                                      <Package className="h-4 w-4 mr-1" /> Update
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Update order status</TooltipContent>
                                </Tooltip>
                              )}
                            </TooltipProvider>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2 bg-[#B8956A] hover:bg-[#B8956A]/90 text-white transition-colors duration-300" onClick={() => setShowReportModal(true)}>
                <TrendingUp className="h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-[#B8956A] border-[#B8956A] hover:bg-[#B8956A]/10 transition-colors duration-300" onClick={() => navigate('/admin/analytics')}>
                <Eye className="h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* View Modal (More Detailed) */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white shadow-md rounded-lg transition-all duration-300 overflow-y-auto max-h-[80vh]">
            <DialogClose className="absolute right-4 top-4"><X className="h-4 w-4" /></DialogClose>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Order Details: #{selectedOrder?._id.slice(-6).toUpperCase()}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6 p-6">
                <section>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.user?.name || "Guest"}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || "N/A"}</p>
                </section>
                <Separator />
                <section>
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> <Badge className="ml-2">{selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}</Badge></p>
                  <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toFixed(2)}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod.charAt(0).toUpperCase() + selectedOrder.paymentMethod.slice(1)}</p>
                  <p><strong>Payment Status:</strong> <Badge className="ml-2">{selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}</Badge></p>
                </section>
                <Separator />
                <section>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p><strong>Full Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
                  <p><strong>Street:</strong> {selectedOrder.shippingAddress.street}</p>
                  <p><strong>City:</strong> {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
                  <p><strong>Country:</strong> {selectedOrder.shippingAddress.country}</p>
                  <p><strong>Tag:</strong> {selectedOrder.shippingAddress.tag}</p>
                </section>
                <Separator />
                <section>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  {selectedOrder.items.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <li key={idx} className="border-b py-2">
                          <div className="flex justify-between">
                            <span>{item.name} (Qty: {item.qty})</span>
                            <span>₹{(item.price * item.qty).toFixed(2)}</span>
                          </div>
                          {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mt-2 rounded" />}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items in this order.</p>
                  )}
                </section>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Modal (Enhanced with Confirmation and Details) */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white shadow-md rounded-lg transition-all duration-300">
            <DialogClose className="absolute right-4 top-4"><X className="h-4 w-4" /></DialogClose>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Update Order: #{selectedOrder?._id.slice(-6).toUpperCase()}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4 p-4">
                <div>
                  <p><strong>Current Status:</strong> {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Changing status will update the order permanently.</p>
                </div>
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status" className="border-[#B8956A]/30">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {updateError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{updateError}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  onClick={submitUpdate} 
                  disabled={updateLoading || newStatus === selectedOrder.orderStatus} 
                  className="w-full bg-[#B8956A] hover:bg-[#B8956A]/90 text-white transition-colors duration-300"
                >
                  {updateLoading ? "Updating..." : "Confirm and Save"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Report Modal */}
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogContent className="sm:max-w-[600px] bg-white shadow-xl rounded-2xl p-8 border border-[#B8956A]/20 animate-fade-in-up">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#B8956A] mb-2">Order Report</DialogTitle>
              <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowReportModal(false)}><X className="h-5 w-5" /></DialogClose>
            </DialogHeader>
            <section className="mb-4">
              <p className="text-gray-700 text-lg mb-2">Download a detailed report of all orders, revenue, and customer activity.</p>
              <div className="bg-[#f7f5ef] rounded-xl p-6 shadow-inner">
                <h3 className="text-lg font-semibold mb-2">Summary (Demo)</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Total Orders: {orders.length}</li>
                  <li>Delivered Orders: {orders.filter(o => o.orderStatus === 'delivered').length}</li>
                  <li>Revenue: ₹{orders.filter(o => o.orderStatus === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}</li>
                  <li>Cancelled Orders: {orders.filter(o => o.orderStatus === 'cancelled').length}</li>
                </ul>
              </div>
            </section>
            <Button className="bg-[#B8956A] text-white w-full mt-4 hover:bg-[#A0845A] transition">Download PDF</Button>
          </DialogContent>
        </Dialog>
        {/* Analytics Modal */}
        <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
          <DialogContent className="sm:max-w-[700px] bg-white shadow-xl rounded-2xl p-8 border border-[#B8956A]/20 animate-fade-in-up">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#B8956A] mb-2">Order Analytics</DialogTitle>
              <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowAnalyticsModal(false)}><X className="h-5 w-5" /></DialogClose>
            </DialogHeader>
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f7f5ef] rounded-xl p-6 shadow-inner">
                  <h3 className="text-lg font-semibold mb-2">Order Status Breakdown</h3>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Processing: {orders.filter(o => o.orderStatus === 'processing').length}</li>
                    <li>Shipped: {orders.filter(o => o.orderStatus === 'shipped').length}</li>
                    <li>Delivered: {orders.filter(o => o.orderStatus === 'delivered').length}</li>
                    <li>Cancelled: {orders.filter(o => o.orderStatus === 'cancelled').length}</li>
                  </ul>
                </div>
                <div className="bg-[#f7f5ef] rounded-xl p-6 shadow-inner">
                  <h3 className="text-lg font-semibold mb-2">Revenue Trend (Demo)</h3>
                  <div className="h-32 flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
                </div>
              </div>
              <div className="bg-[#f7f5ef] rounded-xl p-6 shadow-inner mt-4">
                <h3 className="text-lg font-semibold mb-2">Top Customers (Demo)</h3>
                <div className="h-24 flex items-center justify-center text-gray-400">[Top Customers Table Placeholder]</div>
              </div>
            </section>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
