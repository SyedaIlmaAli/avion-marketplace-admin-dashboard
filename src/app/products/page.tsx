"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/type";
import { urlFor } from "@/sanity/lib/image";
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import Sidebar from "@/components/SideBar"; // Make sure the path is correct

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  }

  function handleEdit(product: Product) {
    setSelectedProduct(product);
    setEditedProduct({
      ...product,
      dimensions: {
        height: product.dimensions?.height || undefined,
        width: product.dimensions?.width || undefined,
        depth: product.dimensions?.depth || undefined,
      },
      image: product.image || { asset: { url: "" } }, // Ensure image has a default structure
    });
    setIsEditing(true);
  }

  async function handleUpdate() {
    if (!selectedProduct) return;
    const response = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedProduct._id, updates: editedProduct }),
    });
  
    const result = await response.json(); // Store the response
  
    if (response.ok) {
      alert(result.message || "Product updated successfully!"); // Use the result
      setIsEditing(false);
      fetchProducts(); // Refetch the products to reflect changes
    } else {
      alert(result.error || "Failed to update product."); // Use the error message if available
    }
  }  

  async function handleDelete(id: string) {
    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  
    const result = await response.json(); // Store the response
  
    if (response.ok) {
      alert(result.message || "Product deleted successfully!"); // Use the result
      fetchProducts(); // Refetch the products to reflect the deletion
    } else {
      alert(result.error || "Failed to delete product."); // Use the error message if available
    }
  }  

  return (
    <div className="flex">
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
          <div className="flex justify-center w-full">
            <h1 className="lg:text-3xl text-xl font-bold text-center text-gray-900 mb-6">
              Products
            </h1>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition-all duration-300"
            >
              {product.image?.asset ? (
                <Image
                  src={urlFor(product.image?.asset).url() || "/placeholder.png"} // Fallback image
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              ) : (
                <Image
                  src="/placeholder.png"
                  alt="Placeholder"
                  width={200}
                  height={200}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              )}

              <h2 className="text-xl font-semibold mt-4 truncate text-center text-gray-800">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">${product.price}</p>
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => handleEdit(product)}
                  size="sm"
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <PencilIcon className="w-5 h-5 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product._id)}
                  variant="destructive"
                  size="sm"
                  className="text-red-200 hover:bg-red-100"
                >
                  <TrashIcon className="w-5 h-5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-lg p-6">
            <DialogTitle>Edit Product</DialogTitle>
            <div className="space-y-4">
              {/* Product Name */}
              <Input
                value={editedProduct.name || ""}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Product Name"
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Product Description */}
              <Input
                value={editedProduct.description || ""}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Product Price */}
              <Input
                value={editedProduct.price?.toString() || ""}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                placeholder="Price"
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Product Tags */}
              <Input
                value={editedProduct.tags?.join(", ") || ""}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  }))
                }
                placeholder="Tags (comma separated)"
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Product Features */}
              <Input
                value={editedProduct.features?.join(", ") || ""}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    features: e.target.value
                      .split(",")
                      .map((feature) => feature.trim()),
                  }))
                }
                placeholder="Features (comma separated)"
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Product Dimensions */}
              <div className="flex space-x-4">
                <Input
                  value={editedProduct.dimensions?.height || ""}
                  onChange={(e) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        height: e.target.value || undefined, // This ensures height is either a string or undefined
                      },
                    }))
                  }
                  placeholder="Height"
                  className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Input
                  value={editedProduct.dimensions?.width || ""}
                  onChange={(e) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        width: e.target.value || undefined, // This ensures width is either a string or undefined
                      },
                    }))
                  }
                  placeholder="Width"
                  className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Input
                  value={editedProduct.dimensions?.depth || ""}
                  onChange={(e) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      dimensions: {
                        ...prev.dimensions,
                        depth: e.target.value || undefined, // This ensures depth is either a string or undefined
                      },
                    }))
                  }
                  placeholder="Depth"
                  className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Product Quantity */}
              <Input
                value={editedProduct.quantity?.toString() || ""}
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                placeholder="Quantity"
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Product Image URL */}
              <Input
                value={editedProduct.image?.asset?.url || ""} // Ensure URL is shown
                onChange={(e) =>
                  setEditedProduct((prev) => ({
                    ...prev,
                    image: { asset: { url: e.target.value } }, // Update image URL in the state
                  }))
                }
                placeholder="Image URL"
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Save Button */}
              <Button
                onClick={handleUpdate}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
