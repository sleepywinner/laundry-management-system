import mongoose, { Document, Schema } from "mongoose";

// Interface - defines what an Order looks like in TypeScript
export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  items: IOrderItem[];
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
  pickupDate: Date;
  deliveryDate: Date;
  notes: string;
  createdAt: Date;
}

// Interface for individual laundry items
export interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Schema for individual laundry items
const OrderItemSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
});

// Main Order Schema
const OrderSchema: Schema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "picked_up", "washing", "drying", "ready", "delivered"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    pickupAddress: {
      type: String,
      required: [true, "Pickup address is required"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "Delivery address is required"],
    },
    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    deliveryDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOrder>("Order", OrderSchema);
