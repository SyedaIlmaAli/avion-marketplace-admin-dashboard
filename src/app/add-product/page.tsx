"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/SideBar";

export default function AddProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    price: 0, // Change from "" to 0
    description: "",
    dimensions: { width: "", height: "", depth: "" },
    category: "",
    quantity: 0, // Change from "" to 0
    features: [""],
    tags: [""],
    image: null as File | null,
  });
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        console.log("Fetched Categories:", data); // Log the fetched categories
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setProduct({ ...product, image: file });
  }

  function handleFeatureChange(index: number, value: string) {
    const newFeatures = [...product.features];
    newFeatures[index] = value;
    setProduct({ ...product, features: newFeatures });
  }

  function addFeature() {
    setProduct({ ...product, features: [...product.features, ""] });
  }

  function handleTagChange(index: number, value: string) {
    const newTags = [...product.tags];
    newTags[index] = value;
    setProduct({ ...product, tags: newTags });
  }

  function addTag() {
    setProduct({ ...product, tags: [...product.tags, ""] });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!product.image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", product.image);

    const imageResponse = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const imageData = await imageResponse.json();

    if (!imageResponse.ok || !imageData.asset) {
      alert("Failed to upload image.");
      return;
    }

    const productData = {
      ...product,
      image: {
        asset: {
          _type: "reference",
          _ref: imageData.asset._id,
        },
      },
      category: {
        _type: "reference",
        _ref: product.category, // This should be the category ID, not the name
      },
    };

    console.log("Product Data:", productData); // Log the final product data

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    console.log("Response from API:", data);

    if (response.ok) {
      router.push("/products");
    } else {
      alert(`Failed to add product: ${data.error || "Unknown error"}`);
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
          <div className="flex justify-center w-full items-center">
            <h1 className="lg:text-3xl text-xl font-bold text-center text-gray-900 mb-6">
              Add New Product
            </h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="name"
            placeholder="Enter product name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
            className="mt-2"
          />
          <Input
            id="price"
            type="number"
            placeholder="Enter product price"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
          />

          <Textarea
            id="description"
            placeholder="Enter product description"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            className="mt-2"
          />
          <div className="grid grid-cols-3 gap-6">
            <Input
              id="width"
              placeholder="Width"
              value={product.dimensions.width}
              onChange={(e) =>
                setProduct({
                  ...product,
                  dimensions: {
                    ...product.dimensions,
                    width: e.target.value,
                  },
                })
              }
              className="mt-2"
            />
            <Input
              id="height"
              placeholder="Height"
              value={product.dimensions.height}
              onChange={(e) =>
                setProduct({
                  ...product,
                  dimensions: {
                    ...product.dimensions,
                    height: e.target.value,
                  },
                })
              }
              className="mt-2"
            />
            <Input
              id="depth"
              placeholder="Depth"
              value={product.dimensions.depth}
              onChange={(e) =>
                setProduct({
                  ...product,
                  dimensions: {
                    ...product.dimensions,
                    depth: e.target.value,
                  },
                })
              }
              className="mt-2"
            />
          </div>
          <select
            id="category"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            className="mt-2 w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Input
            id="quantity"
            type="number"
            placeholder="Enter quantity"
            value={product.quantity}
            onChange={(e) =>
              setProduct({ ...product, quantity: Number(e.target.value) })
            }
          />
          {product.features.map((feature, index) => (
            <Input
              key={index}
              placeholder="Feature"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="mt-2"
            />
          ))}
          <Button type="button" onClick={addFeature} className="mt-2">
            Add Feature
          </Button>
          {product.tags.map((tag, index) => (
            <Input
              key={index}
              placeholder="Tag"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              className="mt-2"
            />
          ))}
          <Button type="button" onClick={addTag} className="mt-2">
            Add Tag
          </Button>
          <Input
            id="image"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-2"
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 mt-6"
          >
            Add Product
          </Button>
        </form>
      </div>
    </div>
  );
}
