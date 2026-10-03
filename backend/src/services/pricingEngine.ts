import { ICartItem } from "../models/Cart";
import { ICoupon } from "../models/Coupon";

export interface IPricingCalculation {
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  freeShippingApplied: boolean;
  freeShippingThreshold: number;
  amountRemainingForFreeShipping: number;
}

const FREE_SHIPPING_THRESHOLD = 999; // ₹999 for free delivery across India
const STANDARD_SHIPPING_FEE = 99; // ₹99 standard shipping

export class PricingEngine {
  public static calculateCartTotals(
    items: Array<{ unitPrice: number; quantity: number }>,
    coupon?: ICoupon | null,
    isFirstOrder = false
  ): IPricingCalculation {
    // 1. Calculate subtotal strictly server-side
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // 2. Calculate coupon discount if applicable
    let discount = 0;
    let couponCode: string | undefined = undefined;
    let freeShippingCoupon = false;

    if (coupon && coupon.isActive) {
      const now = new Date();
      const isDateValid = now >= new Date(coupon.startDate) && now <= new Date(coupon.endDate);
      const isUsageValid = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
      const isMinCartValid = subtotal >= coupon.minCartValue;
      const isFirstOrderValid = !coupon.firstOrderOnly || isFirstOrder;

      if (isDateValid && isUsageValid && isMinCartValid && isFirstOrderValid) {
        couponCode = coupon.code;
        if (coupon.discountType === "percentage") {
          const rawDiscount = (subtotal * coupon.discountValue) / 100;
          discount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
        } else if (coupon.discountType === "fixed") {
          discount = Math.min(coupon.discountValue, subtotal);
        }

        if (coupon.freeShipping) {
          freeShippingCoupon = true;
        }
      }
    }

    discount = Math.round(discount * 100) / 100;

    // 3. Shipping fee calculation
    let shippingFee = 0;
    const discountedTotal = Math.max(0, subtotal - discount);

    if (items.length > 0) {
      if (freeShippingCoupon || discountedTotal >= FREE_SHIPPING_THRESHOLD) {
        shippingFee = 0;
      } else {
        shippingFee = STANDARD_SHIPPING_FEE;
      }
    }

    const freeShippingApplied = shippingFee === 0 && items.length > 0;
    const amountRemainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedTotal);

    // 4. Tax (in India, personal care products have 18% GST already built into retail MRP/selling price)
    // We document the GST component for legal invoice transparency
    const tax = Math.round((discountedTotal * 0.18 / 1.18) * 100) / 100;

    // 5. Grand total
    const grandTotal = Math.round((discountedTotal + shippingFee) * 100) / 100;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount,
      couponCode,
      shippingFee,
      tax,
      grandTotal,
      freeShippingApplied,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountRemainingForFreeShipping,
    };
  }
}
