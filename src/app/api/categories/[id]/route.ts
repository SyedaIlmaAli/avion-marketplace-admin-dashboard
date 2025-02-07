import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("📩 Incoming PATCH request for ID:", params.id);

    const { name } = await req.json();
    console.log("Received updated name:", name);

    if (!params.id || !name) {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }

    const updatedCategory = await client.patch(params.id).set({ name }).commit();

    console.log("✅ Updated category:", updatedCategory);

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("🚨 Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log("📩 Incoming DELETE request for ID:", params.id);

    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await client.delete(params.id);

    console.log("✅ Deleted category:", params.id);

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("🚨 Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
