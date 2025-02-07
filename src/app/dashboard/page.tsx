'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { client } from '@/sanity/lib/client';
import Sidebar from '@/components/SideBar';

// Define TypeScript types
interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  fullName: string;
  total: number;
  date: string;
  paymentStatus: string;
}


async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"]{_id, name, price}`;
  return await client.fetch(query);
}

async function getOrders(): Promise<Order[]> {
  const query = `*[_type == "order"]{_id, fullName, total, date, paymentStatus}`;
  return await client.fetch(query);
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const productData = await getProducts();
      const orderData = await getOrders();

      setProducts(productData);
      setOrders(orderData);

      // Calculate total earnings
      const total = orderData.reduce((sum, order) => sum + order.total, 0);
      setTotalEarnings(total);

      // Calculate average order value
      setAverageOrderValue(orderData.length > 0 ? total / orderData.length : 0);

      // Get product price range
      if (productData.length > 0) {
        const prices = productData.map((p) => p.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar (Visible on large screens) */}
      <div className="w-64 lg:block hidden">
        <Sidebar />
      </div>

      {/* Main Content (Products Page) */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          {/* Sidebar Toggle (Visible on small screens) */}
          <div className="lg:hidden block">
            <Sidebar />
          </div>

          {/* Title */}
          <div className="flex justify-center w-full items-center">
            <h1 className="lg:text-3xl text-xl font-bold text-center text-gray-900 mb-6">
              Dashboard
            </h1>
          </div>
        </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overview Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>{products.length} (Price: ${minPrice} - ${maxPrice})</CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>{orders.length}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>${totalEarnings.toFixed(2)}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>${averageOrderValue.toFixed(2)}</CardContent>
          </Card>
        </div>

        {/* Latest Orders */}
        <div className="col-span-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {orders.slice(0, 5).map((order) => (
                  <li key={order._id} className="border-b p-3 flex justify-between">
                    <div>
                      <strong>{order.fullName}</strong> - ${order.total} 
                      <span className={`ml-3 px-2 py-1 text-sm rounded-lg ${
                        order.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
