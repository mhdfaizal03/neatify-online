import React from "react";
import { Users, DollarSign, Package, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Revenue", value: "$12,426", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-100" },
    { title: "Active Orders", value: "24", icon: Package, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "Total Customers", value: "892", icon: Users, color: "text-purple-500", bg: "bg-purple-100" },
    { title: "Growth Rate", value: "+12.5%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-100" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          Analytics charts will be integrated here...
        </div>
      </div>
    </div>
  );
}
