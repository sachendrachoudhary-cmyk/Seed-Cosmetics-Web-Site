import { PricingEngine } from "../src/services/pricingEngine";

describe("PricingEngine Unit Tests", () => {
  test("calculates subtotal correctly for multiple cart items", () => {
    const items = [
      { unitPrice: 899, quantity: 2 }, // 1798
      { unitPrice: 549, quantity: 1 }, // 549
    ];

    const result = PricingEngine.calculateCartTotals(items);
    expect(result.subtotal).toBe(2347);
  });

  test("applies free shipping when subtotal >= ₹999", () => {
    const items = [{ unitPrice: 1000, quantity: 1 }];
    const result = PricingEngine.calculateCartTotals(items);

    expect(result.shippingFee).toBe(0);
    expect(result.freeShippingApplied).toBe(true);
    expect(result.grandTotal).toBe(1000);
  });

  test("charges standard ₹99 shipping when subtotal < ₹999", () => {
    const items = [{ unitPrice: 549, quantity: 1 }];
    const result = PricingEngine.calculateCartTotals(items);

    expect(result.shippingFee).toBe(99);
    expect(result.freeShippingApplied).toBe(false);
    expect(result.grandTotal).toBe(648);
    expect(result.amountRemainingForFreeShipping).toBe(450);
  });

  test("applies percentage coupon with maximum discount cap", () => {
    const items = [{ unitPrice: 2000, quantity: 1 }];
    const coupon: any = {
      code: "WELCOME10",
      isActive: true,
      discountType: "percentage",
      discountValue: 10, // 10% of 2000 = 200
      minCartValue: 500,
      maxDiscount: 150, // Capped at 150
      startDate: new Date(Date.now() - 10000),
      endDate: new Date(Date.now() + 100000),
      usedCount: 0,
      usageLimit: 100,
    };

    const result = PricingEngine.calculateCartTotals(items, coupon);
    expect(result.discount).toBe(150); // Capped
    expect(result.grandTotal).toBe(1850); // 2000 - 150 + 0 shipping
  });

  test("rejects coupon when subtotal does not meet minCartValue", () => {
    const items = [{ unitPrice: 300, quantity: 1 }];
    const coupon: any = {
      code: "SEED200",
      isActive: true,
      discountType: "fixed",
      discountValue: 200,
      minCartValue: 1000,
      startDate: new Date(Date.now() - 10000),
      endDate: new Date(Date.now() + 100000),
      usedCount: 0,
    };

    const result = PricingEngine.calculateCartTotals(items, coupon);
    expect(result.discount).toBe(0);
    expect(result.couponCode).toBeUndefined();
  });
});
