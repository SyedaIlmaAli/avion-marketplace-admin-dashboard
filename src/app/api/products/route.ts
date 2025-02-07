// zen table 250
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  image: { asset: { url: string } };
  price: number; // Change from string to number
  quantity: number; // Change from string to number
  tags?: string[];
  description?: string;
  features?: string[];
  dimensions?: {
    height: string;
    width: string;
    depth: string;
  };
  category?: { name: string };
}

// Fetch all products
export async function GET() {
  try {
    const query = `*[_type == "product"]{
      _id, name, slug, image, price, quantity, tags, description, features, dimensions, category->{name}
    }`;
    const products: Product[] = await client.fetch(query);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Create a new product
export async function POST(req: Request) {
  try {
    const productData = await req.json();

    // Validate required fields
    if (
      !productData.name ||
      !productData.price ||
      !productData.dimensions ||
      !productData.category
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure slug is correctly formatted
    const slug = productData.slug?.current
      ? { _type: "slug", current: productData.slug.current }
      : {
          _type: "slug",
          current: productData.name.toLowerCase().replace(/\s+/g, "-"),
        };

    // Ensure category is a reference
    const category = { _type: "reference", _ref: productData.category._id };

    // Ensure tags and features are arrays
    const tags = Array.isArray(productData.tags) ? productData.tags : [];
    const features = Array.isArray(productData.features)
      ? productData.features
      : [];

    // Create product in Sanity
    // Convert price and quantity to numbers
    const newProduct = await client.create({
      _type: "product",
      name: productData.name,
      slug,
      image: productData.image,
      price: Number(productData.price), // Convert to number
      quantity: Number(productData.quantity ?? 0), // Convert to number
      tags,
      description: productData.description ?? "",
      features,
      dimensions: productData.dimensions,
      category,
    });

    console.log("Received product data:", productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error },
      { status: 500 }
    );
  }
}

// PATCH: Update product
export async function PATCH(req: Request) {
  try {
    const { id, updates } = await req.json();

    // Ensure id and updates are provided
    if (!id || !updates) {
      return NextResponse.json(
        { error: "Missing required fields: id or updates" },
        { status: 400 }
      );
    }

    // Update the product in Sanity
    const updatedProduct = await client.patch(id).set(updates).commit();
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error during PATCH request:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Ensure id is provided
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Delete the product from Sanity
    await client.delete(id);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error during DELETE request:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error },
      { status: 500 }
    );
  }
}
