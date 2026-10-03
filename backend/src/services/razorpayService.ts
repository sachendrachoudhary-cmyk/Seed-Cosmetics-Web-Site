import crypto from "crypto";
import Razorpay from "razorpay";

export interface ICreateRazorpayOrderOptions {
  amount: number; // in INR
  receipt: string;
  notes?: Record<string, string>;
}

export class RazorpayService {
  private static instance: Razorpay | null = null;

  private static getKeyId(): string {
    return process.env.RAZORPAY_KEY_ID || "rzp_test_mockKey123";
  }

  private static getKeySecret(): string {
    return process.env.RAZORPAY_KEY_SECRET || "mockSecret456";
  }

  private static getWebhookSecret(): string {
    return process.env.RAZORPAY_WEBHOOK_SECRET || "mockWebhookSecret789";
  }

  public static isMockMode(): boolean {
    // Never allow simulated payments in production, even if keys are missing.
    if (process.env.NODE_ENV === "production") return false;
    const key = this.getKeyId();
    return !key || key.includes("mock") || key === "rzp_test_SeedCosmeticsKey123";
  }

  private static getClient(): Razorpay {
    if (!this.instance) {
      this.instance = new Razorpay({
        key_id: this.getKeyId(),
        key_secret: this.getKeySecret(),
      });
    }
    return this.instance;
  }

  public static async createOrder(options: ICreateRazorpayOrderOptions) {
    const amountInPaise = Math.round(options.amount * 100);

    if (this.isMockMode()) {
      const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        id: mockOrderId,
        entity: "order",
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: "INR",
        receipt: options.receipt,
        status: "created",
        attempts: 0,
        notes: options.notes || {},
        created_at: Math.floor(Date.now() / 1000),
        isMock: true,
      };
    }

    const client = this.getClient();
    const order = await client.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: options.receipt,
      notes: options.notes,
    });

    return {
      ...order,
      isMock: false,
    };
  }

  public static verifyPaymentSignature(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): boolean {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;

    // Support mock verification in test/mock mode
    if (this.isMockMode() && razorpayOrderId.startsWith("order_mock_")) {
      return razorpaySignature === "mock_signature_success" || razorpaySignature.length > 10;
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.getKeySecret())
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "utf8");
    const received = Buffer.from(razorpaySignature || "", "utf8");
    if (expected.length !== received.length) return false;
    return crypto.timingSafeEqual(expected, received);
  }

  public static verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (this.isMockMode() && signature === "mock_webhook_signature") {
      return true;
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.getWebhookSecret())
      .update(rawBody)
      .digest("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf8"),
        Buffer.from(signature, "utf8")
      );
    } catch {
      return false;
    }
  }
}
