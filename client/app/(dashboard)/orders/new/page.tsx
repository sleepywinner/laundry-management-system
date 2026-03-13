"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { createOrder } from "@/store/slices/orderSlice";
import toast from "react-hot-toast";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export default function NewOrderPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);

  const [items, setItems] = useState<OrderItem[]>([
    { name: "", quantity: 1, price: 0 },
  ]);
  const [formData, setFormData] = useState({
    pickupAddress: user?.address || "",
    deliveryAddress: user?.address || "",
    pickupDate: "",
    paymentMethod: "cash",
    notes: "",
  });

  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setItems(updatedItems);
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some((item) => !item.name || item.price <= 0)) {
      toast.error("Please fill in all item details!");
      return;
    }
    const result = await dispatch(createOrder({ ...formData, items } as any));
    if (createOrder.fulfilled.match(result)) {
      toast.success("Order placed successfully!");
      router.push("/dashboard");
    } else {
      toast.error("Failed to place order!");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👕</span>
          <h1 className="text-xl font-bold text-gray-800">LaundryApp</h1>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Place New Order 🧺
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Items Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Laundry Items
            </h3>

            {items.map((item, index) => (
              <div key={index} className="flex gap-3 mb-3 items-center">
                <input
                  type="text"
                  placeholder="Item name (e.g. Shirt)"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateItem(index, "quantity", Number(e.target.value))
                  }
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
                <input
                  type="number"
                  placeholder="Price ₹"
                  value={item.price}
                  min={0}
                  onChange={(e) =>
                    updateItem(index, "price", Number(e.target.value))
                  }
                  className="w-28 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:underline text-sm mt-2"
            >
              + Add another item
            </button>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-right font-bold text-gray-800 text-lg">
                Total: ₹{totalAmount}
              </p>
            </div>
          </div>

          {/* Pickup & Delivery */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">
              Pickup & Delivery
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Address
              </label>
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) =>
                  setFormData({ ...formData, pickupAddress: e.target.value })
                }
                placeholder="Enter pickup address"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryAddress: e.target.value })
                }
                placeholder="Enter delivery address"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) =>
                  setFormData({ ...formData, pickupDate: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value })
                }
                className={inputClass}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any special instructions..."
                rows={3}
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl px-4 py-4 font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Placing Order..." : "🧺 Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
