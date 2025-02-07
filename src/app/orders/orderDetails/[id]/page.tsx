import { client } from "@/sanity/lib/client";
import Link from "next/link";

interface CartProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  cartProducts: CartProduct[];
  subTotal: number;
  discountApplied: number;
  total: number;
  orderDate: string;
}

async function getOrderDetails(orderId: string): Promise<Order | null> {
  const query = `*[_type == "order" && _id == $orderId][0]`;
  return await client.fetch(query, { orderId });
}

export default async function OrderDetails({ params }: { params: { id: string } }) {
  const order = await getOrderDetails(params.id);

  if (!order) {
    return <p className="text-center text-red-500">Order not found!</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p><strong>Name:</strong> {order.fullName}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
      <p><strong>Address:</strong> {order.address}, {order.city}, {order.country} - {order.postalCode}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

      {/* Products Ordered */}
      <div className="mt-4">
        <h2 className="font-semibold">Products:</h2>
        <ul>
          {order.cartProducts.map((product, index) => (
            <li key={index} className="flex justify-between border-b py-2">
              <div>
                <p><strong>{product.name}</strong></p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
              <p>{product.quantity} x ${product.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Totals */}
      <div className="mt-4 text-right">
        <p><strong>Subtotal:</strong> ${order.subTotal.toFixed(2)}</p>
        <p><strong>Discount Applied:</strong> ${order.discountApplied.toFixed(2)}</p>
        <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
      </div>

      {/* Dispatch Button */}
      <div className="mt-6 text-center">
        <Link href={`/orders/dispatch/${order._id}`} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Dispatch Order
        </Link>
      </div>
    </div>
  );
}
