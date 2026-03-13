import { Request, Response } from "express";
import Order from "../models/Order";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      items,
      pickupAddress,
      deliveryAddress,
      pickupDate,
      notes,
      paymentMethod,
    } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce(
      (acc: number, item: { price: number; quantity: number }) =>
        acc + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      customer: req.user._id,
      items,
      totalAmount,
      pickupAddress,
      deliveryAddress,
      pickupDate,
      notes,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
export const getAllOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get my orders (Customer)
// @route   GET /api/orders/my
// @access  Private (Customer)
export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer",
      "name email phone",
    );

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Staff/Admin)
export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    order.status = status;

    // If status is delivered, set delivery date
    if (status === "delivered") {
      order.deliveryDate = new Date();
    }

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
