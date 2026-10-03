import { Order } from "../models/Order";

/**
 * A customer's order is a "first order" when no earlier order of theirs has
 * been paid. Guests with no identifying info are treated as first-time
 * (the check is re-run with their email at checkout, so this can't be abused
 * to claim the discount on a repeat purchase).
 */
export async function isFirstOrder(params: { userId?: any; email?: string }): Promise<boolean> {
  const or: any[] = [];
  if (params.userId) or.push({ user: params.userId });
  if (params.email) or.push({ customerEmail: params.email.toLowerCase().trim() });
  if (or.length === 0) return true;

  const prior = await Order.countDocuments({ $or: or, paymentStatus: "paid" });
  return prior === 0;
}
