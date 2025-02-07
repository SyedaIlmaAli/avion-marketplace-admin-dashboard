"use client";

import Loader from '@/components/Loader';
import Sidebar from '@/components/SideBar';  // Import Sidebar component
import React, { useEffect, useState } from 'react';

interface Order {
  _id: string;
  fullName: string;
  orderDate: string;
  status: string;
}

const Dispatched = () => {
  const [orders, setOrders] = useState<Order[]>([]); // Store all dispatched orders
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all dispatched orders from localStorage
    const dispatchedOrders = Object.keys(localStorage)
      .filter(key => key.startsWith("dispatchedOrder_"))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'));
    
    if (dispatchedOrders.length > 0) {
      setOrders(dispatchedOrders);
    }
    
    setLoading(false);
  }, []);

  const handleMarkAsCompleted = (orderId: string) => {
    // Update the order status in localStorage
    const updatedOrders = orders.map((order) => {
      if (order._id === orderId) {
        return { ...order, status: 'Completed' }; // Add a status key for completion
      }
      return order;
    });

    // Update localStorage with new status
    updatedOrders.forEach((order) => {
      localStorage.setItem(`dispatchedOrder_${order._id}`, JSON.stringify(order));
    });

    // Update state to reflect the changes
    setOrders(updatedOrders);
  };

  if (loading) {
    return <Loader/>
  }

  if (orders.length === 0) {
    return <p className="text-center text-red-500">No dispatched orders found!</p>;
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
  <h1 className="lg:text-3xl text-xl font-bold  text-gray-900 mb-6">
    All Dispatched Orders
  </h1>
</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between h-full">
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-semibold">{order.fullName}</h2>
                <p className="text-sm text-gray-500">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <div className="mt-2 text-green-600 font-semibold">
                  {order.status === 'Completed' ? '✅ Completed' : '✅ Dispatched'}
                </div>
                <div className="text-sm text-gray-600">Order ID: {order._id}</div>
              </div>

              {/* Completed Button */}
              {order.status !== 'Completed' && (
                <button
                  onClick={() => handleMarkAsCompleted(order._id)}
                  className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dispatched;
