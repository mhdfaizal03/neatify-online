import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/products", icon: Package, label: "Products" },
    { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-full border-r border-gray-800 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600 p-1 rounded">N</span> Neatify Admin
        </h1>
      </div>
      
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-colors text-left text-red-400 hover:text-red-300">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
