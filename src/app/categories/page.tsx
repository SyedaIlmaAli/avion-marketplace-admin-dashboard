"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/SideBar";

interface Category {
  _id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleCreateCategory() {
    if (!newCategory.trim()) return toast.error("Category name is required!");
  
    setLoading(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });
  
    if (res.ok) {
      toast.success("Category added successfully!");
      setNewCategory("");
      fetchCategories();
      router.refresh(); // Use the router here
    } else {
      toast.error("Failed to add category.");
    }
    setLoading(false);
  }  

  async function handleEditCategory() {
    if (!editingCategory?.name.trim())
      return toast.error("Category name is required!");

    setLoading(true);
    const res = await fetch(`/api/categories/${editingCategory._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingCategory.name }),
    });

    if (res.ok) {
      toast.success("Category updated successfully!");
      fetchCategories();
      setEditingCategory(null);
    } else {
      toast.error("Failed to update category.");
    }
    setLoading(false);
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
  
    setLoading(true);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
  
    const responseData = await res.json(); // Log API response
    console.log("Delete Response:", responseData);
  
    if (res.ok) {
      toast.success("Category deleted successfully!");
      fetchCategories();
    } else {
      toast.error(responseData?.message || "Failed to delete category.");
    }
    setLoading(false);
  }
  

  return (
    <div className="flex h-screen">
      {/* Sidebar (Visible on large screens) */}
      <div className="w-64 lg:block hidden">
        <Sidebar />
      </div>

      {/* Main Content (Products Page) */}
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          {/* Sidebar Toggle (Visible on small screens) */}
          <div className="lg:hidden block">
            <Sidebar />
          </div>

          {/* Title */}
          <div className="flex justify-center w-full items-center">
            <h1 className="lg:text-3xl text-xl font-bold text-center text-gray-900 mb-6">
              Manage Categories
            </h1>
          </div>
        </div>

        {/* Create Category Input */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg shadow-sm"
          />
          <Button
            onClick={handleCreateCategory}
            disabled={loading}
            className="px-6"
          >
            {loading ? "Adding..." : "Create"}
          </Button>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category._id}
              className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center"
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-lg font-medium text-gray-700">
                {category.name}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCategory(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit Category Modal */}
        {editingCategory && (
          <Dialog
            open={!!editingCategory}
            onOpenChange={() => setEditingCategory(null)}
          >
            <DialogContent className="p-6 bg-white rounded-lg shadow-lg">
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Edit Category
              </DialogTitle>
              <Input
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                className="px-4 py-2 border rounded-lg shadow-sm"
              />
              <DialogFooter className="mt-4">
                <Button
                  onClick={handleEditCategory}
                  disabled={loading}
                  className="px-6"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
