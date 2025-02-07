"use client";

import Sidebar from '@/components/SideBar';  // Import Sidebar component
import React, { useEffect, useState } from 'react';

interface Order {
  _id: string;
  fullName: string;
  orderDate: string;
  status: string;
}

const Completed = () => {
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]); // Store completed orders
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all completed orders from localStorage
    const completedOrders: Order[] = Object.keys(localStorage)
      .filter(key => key.startsWith("dispatchedOrder_"))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}') as Order) // Type assertion
      .filter(order => order.status === 'Completed'); // Filter only completed orders

    if (completedOrders.length > 0) {
      setCompletedOrders(completedOrders);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <p className="text-center text-blue-500">Loading completed orders...</p>;
  }

  if (completedOrders.length === 0) {
    return <p className="text-center text-red-500">No completed orders found!</p>;
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
              Completed Orders
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {completedOrders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-md bg-white">
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold">{order.fullName}</h2>
                <p className="text-sm text-gray-500">
                  Order Date: {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <div className="mt-2 text-green-600 font-semibold">
                  {order.status === 'Completed' ? '✅ Completed' : '✅ Dispatched'}
                </div>
                <div className="text-sm text-gray-600">Order ID: {order._id}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Completed;
