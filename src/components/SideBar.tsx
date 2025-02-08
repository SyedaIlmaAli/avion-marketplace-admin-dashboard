"use client";

import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Home,
  Package,
  Truck,
  CheckCircle,
  ShoppingCart,
  LogOutIcon,
  PlusCircle,
  FolderOpen, // Added icon for Categories
} from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "./ui/sheet";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
    { name: "Orders", href: "/orders", icon: <ShoppingCart size={20} /> },
    { name: "Dispatched", href: "/dispatched", icon: <Truck size={20} /> },
    { name: "Completed", href: "/completed", icon: <CheckCircle size={20} /> },
    { name: "Products", href: "/products", icon: <Package size={20} /> },
    { name: "Add Product", href: "/add-product", icon: <PlusCircle size={20} /> },
    { name: "Categories", href: "/categories", icon: <FolderOpen size={20} /> }, // Added Categories
  ];

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="lg:block hidden">
        <div className="h-screen w-64 bg-gray-900 text-white p-5 flex flex-col">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          </Link>
          <nav className="flex flex-col gap-3 flex-grow">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-700 ${
                    active === item.name ? "bg-gray-700" : ""
                  }`}
                  onClick={() => setActive(item.name)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <LogoutLink  className="p-3 bg-red-600 rounded-lg flex items-center justify-center gap-3 hover:bg-red-700">
              <LogOutIcon />
              <p>Log out</p>
            </LogoutLink>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <div className="block lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <RxHamburgerMenu className="text-black cursor-pointer" size={24} />
          </SheetTrigger>
          <SheetContent>
            <div>
              <Link href={"/"}>
                <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
              </Link>
              <nav className="flex flex-col gap-3 flex-grow">
                {menuItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-700 ${
                        active === item.name ? "bg-gray-700" : ""
                      }`}
                      onClick={() => setActive(item.name)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <LogoutLink className="p-3 bg-red-600 rounded-lg flex items-center justify-center gap-3 hover:bg-red-700">
                  <LogOutIcon />
                  <p>Log out</p>
                </LogoutLink>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild></SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Sidebar;
