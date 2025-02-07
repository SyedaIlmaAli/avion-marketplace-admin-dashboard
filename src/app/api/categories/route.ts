import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `*[_type == "category"]{ _id, name }`;
    const categories = await client.fetch(query);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("📩 Incoming POST request...");

    const { name } = await req.json();
    console.log("Received data:", name);

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newCategory = await client.create({
      _type: "category",
      name,
      slug: { current: name.toLowerCase().replace(/\s+/g, "-") },
    });

    console.log("✅ Created category:", newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("🚨 Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
