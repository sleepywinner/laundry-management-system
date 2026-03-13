"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { getMyOrders } from "@/store/slices/orderSlice";
import { logout } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    dispatch(getMyOrders());
  }, [user, dispatch, router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      picked_up: "bg-blue-100 text-blue-800",
      washing: "bg-purple-100 text-purple-800",
      drying: "bg-orange-100 text-orange-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👕</span>
          <h1 className="text-xl font-bold text-gray-800">LaundryApp</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, {user?.name}! 👋</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {orders.length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm">Active Orders</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {orders.filter((o) => o.status !== "delivered").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm">Completed Orders</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {orders.filter((o) => o.status === "delivered").length}
            </p>
          </div>
        </div>

        {/* New Order Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
          <button
            onClick={() => router.push("/orders/new")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Order
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🧺</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No orders yet!
            </h3>
            <p className="text-gray-500 mb-6">
              Place your first laundry order today!
            </p>
            <button
              onClick={() => router.push("/orders/new")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Place First Order
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {order.items.length} items • ₹{order.totalAmount}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Pickup: {new Date(order.pickupDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
