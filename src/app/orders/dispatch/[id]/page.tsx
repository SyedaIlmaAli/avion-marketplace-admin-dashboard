"use client"

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";

// Fetch the order data from the server side
async function getOrder(orderId: string) {
  const query = `*[_type == "order" && _id == $orderId][0] {
    _id, fullName, orderDate
  }`;
  return await client.fetch(query, { orderId });
}

interface Order {
  _id: string;
  fullName: string;
  orderDate: string;
}

interface DispatchPageProps {
  order: Order | null;
}

function DispatchPageClient({ order }: DispatchPageProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && order) {
      // Store the dispatched order in localStorage when the page is rendered on the client
      localStorage.setItem(`dispatchedOrder_${order._id}`, JSON.stringify(order));
    }
  }, [order]);

  if (!order) {
    return <p className="text-center text-red-500">Order not found!</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Dispatched</h1>
      <p className="text-lg font-semibold">{order.fullName}</p>
      <p className="text-gray-500">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
      <p className="mt-4 text-green-600 font-semibold">✅ This order has been dispatched successfully.</p>
    </div>
  );
}

// Server-side function to fetch the order details
export default function DispatchPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOrder() {
      const fetchedOrder = await getOrder(params.id);
      setOrder(fetchedOrder);
      setLoading(false);
    }
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return <p className="text-center text-blue-500">Loading order...</p>;
  }

  return <DispatchPageClient order={order} />;
}
