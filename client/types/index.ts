// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  phone?: string;
  address?: string;
  token: string;
}

// Order Item Types
export interface OrderItem {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
}

// Order Types
export interface Order {
  _id: string;
  customer: User | string;
  items: OrderItem[];
  status:
    | "pending"
    | "picked_up"
    | "washing"
    | "drying"
    | "ready"
    | "delivered";
  totalAmount: number;
  paymentStatus: "unpaid" | "paid";
  paymentMethod: "cash" | "online";
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
