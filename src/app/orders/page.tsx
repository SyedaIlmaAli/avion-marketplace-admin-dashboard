"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/SideBar";
import Link from "next/link";

interface Order {
  _id: string;
  fullName: string;
  orderDate: string;
  total: number;
}

async function getOrders(): Promise<Order[]> {
  const query = `*[_type == "order"] | order(orderDate desc) {
    _id, fullName, orderDate, total
  }`;
  return await client.fetch(query);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dispatchedOrder, setDispatchedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const orderData = await getOrders();
      setOrders(orderData);

      // Fetch dispatched order from localStorage (only on the client side)
      if (typeof window !== "undefined") {
        const storedOrder = localStorage.getItem("dispatchedOrder");
        if (storedOrder) {
          setDispatchedOrder(JSON.parse(storedOrder));
        }
      }
    }
    fetchOrders();
  }, []);

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
    All Orders
  </h1>
</div>
        </div>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="mb-4">
              <CardHeader>
                <CardTitle>
                  {order.fullName} - {new Date(order.orderDate).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>

                {/* Order Details Link */}
                <Link href={`/orders/orderDetails/${order._id}`} className="text-blue-500 hover:underline mr-4">
                  View Details
                </Link>

                {/* Dispatch Button */}
                <Link href={`/orders/dispatch/${order._id}`} className="text-green-600 hover:underline">
                  Dispatch
                </Link>
              </CardContent>
            </Card>
          ))
        )}

        {dispatchedOrder && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Recently Dispatched Order</h2>
            <div className="bg-green-100 p-4 rounded mt-4">
              <p className="font-semibold">Name: {dispatchedOrder.fullName}</p>
              <p>Order Date: {new Date(dispatchedOrder.orderDate).toLocaleDateString()}</p>
              <p className="mt-2 text-green-600 font-semibold">✅ This order has been dispatched successfully.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
