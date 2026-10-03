import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { Product } from "./models/Product";
import { seedDatabase } from "./seed";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await connectDB();

    // Auto-seed if database has 0 products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("[Bootstrap] Database is empty. Running Seed Cosmetics catalogue seeder...");
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌱 SEED COSMETICS API ENGINE`);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🌿 Care Begins Here. | Market: India (INR ₹)`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error("[Bootstrap] Critical failure during server boot:", err);
    process.exit(1);
  }
}

bootstrap();
