import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog"
import { UserEditDialog } from "@/components/admin/UserEditDialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { 
  Plus, Search, Edit, Trash2, Eye, Filter, UserPlus, 
  Mail, Phone, Calendar, MapPin, Shield, Ban 
} from "lucide-react"

const backendUrl = import.meta.env.VITE_API_BASE_URL;

export default function Users() {
  const { toast } = useToast()
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      const res = await fetch(`${backendUrl}/admin/users?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      toast({ title: "Failed to load users", variant: "destructive" })
    }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [token, searchTerm, statusFilter, roleFilter])

  // Stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => !u.isBlocked).length
  const admins = users.filter(u => u.isAdmin).length
  const newThisMonth = users.filter(u => {
    const join = new Date(u.createdAt)
    const now = new Date()
    return join.getMonth() === now.getMonth() && join.getFullYear() === now.getFullYear()
  }).length

  // Actions
  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  const handleSaveUser = async (updatedUser: any) => {
    try {
      const res = await fetch(`${backendUrl}/admin/users/${updatedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role === 'admin' ? 'admin' : 'customer',
          phone: updatedUser.phone,
          address: updatedUser.address,
          preferredEra: updatedUser.preferredEra,
          // add other fields if needed
        })
      })
      if (!res.ok) throw new Error()
      toast({ title: "User updated" })
      setEditDialogOpen(false)
      fetchUsers()
    } catch {
      toast({ title: "Failed to update user", variant: "destructive" })
    }
  }

  const handleBlockUser = async (user: any) => {
    try {
      const res = await fetch(`${backendUrl}/admin/users/${user._id}/block`, {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      toast({ title: `User ${data.user.isBlocked ? 'blocked' : 'unblocked'}` })
      fetchUsers()
    } catch {
      toast({ title: "Failed to block/unblock user", variant: "destructive" })
    }
  }

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const res = await fetch(`${backendUrl}/admin/users/${userToDelete._id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error()
        toast({ title: "User deleted", variant: "destructive" })
        setUserToDelete(null)
        setDeleteDialogOpen(false)
        fetchUsers()
      } catch {
        toast({ title: "Failed to delete user", variant: "destructive" })
      }
    }
  }

  // Filtering (client-side for now, but can be server-side)
  const filteredUsers = users // already filtered by backend

  // Segregate admins and customers
  const adminUsers = filteredUsers.filter(u => u.isAdmin);
  const customerUsers = filteredUsers.filter(u => !u.isAdmin);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage customer accounts and administrators</p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Shield className="h-4 w-4 text-admin-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-admin-success">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Users
              </CardTitle>
              <Shield className="h-4 w-4 text-admin-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-admin-success">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New This Month
              </CardTitle>
              <UserPlus className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newThisMonth}</div>
              <p className="text-xs text-admin-success">+23% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Admins
              </CardTitle>
              <Shield className="h-4 w-4 text-admin-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admins}</div>
              <p className="text-xs text-muted-foreground">No change</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
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

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            {currentUser && (
              <div className="text-xs text-muted-foreground mt-1">Your ID: <span className="font-mono text-primary">{currentUser.id}</span></div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading users...</div>
            ) : (
              <>
                {/* Admins Section */}
                {adminUsers.length > 0 && (
                  <>
                    <div className="font-semibold text-lg mb-2 mt-2 text-admin-accent">Admins</div>
                    <div className="space-y-4 mb-6">
                      {adminUsers.map((user) => (
                        <div key={user._id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${currentUser && user._id === currentUser.id ? 'bg-yellow-50 border-yellow-400' : ''}`}>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                              <AvatarFallback>{user.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{user.name}</h3>
                                <Badge variant="default">admin</Badge>
                                <Badge variant={!user.isBlocked ? "default" : "secondary"}>{!user.isBlocked ? "active" : "inactive"}</Badge>
                                {currentUser && user._id === currentUser.id && (
                                  <span className="ml-2 px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 text-xs font-semibold">You</span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </span>
                                {user.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {user.phone}
                                  </span>
                                )}
                                {user.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {user.location}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
                                <span>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</span>
                              </div>
                              {currentUser && user._id === currentUser.id && (
                                <div className="text-xs text-muted-foreground mt-1">Your ID: <span className="font-mono text-primary">{user._id}</span></div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)} title="View user details"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Edit user"><Edit className="h-4 w-4" /></Button>
                            {/* Prevent self block/delete */}
                            {currentUser && user._id === currentUser.id ? (
                              <>
                                <Button variant="ghost" size="icon" disabled title="You cannot block yourself" className="opacity-50 cursor-not-allowed"><Ban className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" disabled title="You cannot delete yourself" className="opacity-50 cursor-not-allowed text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleBlockUser(user)} title={!user.isBlocked ? "Block user" : "Unblock user"} className={user.isBlocked ? "text-yellow-600 hover:text-yellow-700" : ""}><Ban className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)} title="Delete user" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {/* Users Section */}
                {customerUsers.length > 0 && (
                  <>
                    <div className="font-semibold text-lg mb-2 mt-4 text-admin-accent">Customers</div>
                    <div className="space-y-4">
                      {customerUsers.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                              <AvatarFallback>{user.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{user.name}</h3>
                                <Badge variant="secondary">customer</Badge>
                                <Badge variant={!user.isBlocked ? "default" : "secondary"}>{!user.isBlocked ? "active" : "inactive"}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </span>
                                {user.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {user.phone}
                                  </span>
                                )}
                                {user.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {user.location}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
                                <span>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</span>
                                {user.orders !== undefined && (
                                  <span>{user.orders} orders</span>
                                )}
                                {user.spent !== undefined && (
                                  <span>${user.spent} spent</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)} title="View user details"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Edit user"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleBlockUser(user)} title={!user.isBlocked ? "Block user" : "Unblock user"} className={user.isBlocked ? "text-yellow-600 hover:text-yellow-700" : ""}><Ban className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)} title="Delete user" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {!loading && filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No users found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <UserDetailsDialog
          user={selectedUser}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />

        <UserEditDialog
          user={selectedUser ? {
            ...selectedUser,
            role: selectedUser.isAdmin ? 'admin' : 'customer',
          } : null}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveUser}
          isSelf={selectedUser && currentUser && selectedUser._id === currentUser.id}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}