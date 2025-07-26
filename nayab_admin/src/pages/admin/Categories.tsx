import React, { useEffect, useState } from "react";
import CategoriesForm from "@/components/admin/CategoriesForm";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/AdminLayout";

const backendUrl = import.meta.env.VITE_API_BASE_URL;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useAuth();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/categories`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      });
      setCategories(res.data.categories || []);
    } catch (err) {
      setError("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${backendUrl}/admin/categories/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true
      });
      setSuccess("Category deleted");
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
        <CategoriesForm
          editingCategory={editingCategory}
          onSuccess={() => {
            setEditingCategory(null);
            fetchCategories();
          }}
          onCancel={() => setEditingCategory(null)}
          token={token}
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="overflow-x-auto mt-8">
          <table className="w-full border rounded-lg shadow-sm bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Subcategories</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="p-3 border font-semibold text-[#B8956A]">{cat.name}</td>
                  <td className="p-3 border text-gray-700">{cat.subcategories.join(", ")}</td>
                  <td className="p-3 border">
                    <button
                      className="text-blue-600 hover:underline mr-3"
                      onClick={() => setEditingCategory(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(cat._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-8">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
