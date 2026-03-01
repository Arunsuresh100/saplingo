import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import { allProducts } from './data/productData.js'; // This now correctly imports the simple list
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();
// Use await here to ensure DB connection before proceeding
await connectDB();

const importData = async () => {
  try {
    // Clear out old data to prevent duplicates
    await Order.deleteMany();
    await Product.deleteMany();

    const sampleProducts = allProducts.map((product) => {
      // We no longer need to worry about image imports.
      // We just remove the old 'id' field so MongoDB can create its own '_id'.
      const { id, ...rest } = product;
      return { 
        ...rest, 
        countInStock: 20, // Add a default stock for each product
      }; 
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error}`.red.inverse);
    process.exit(1);
  }
};

// This logic checks if you run 'node seeder.js -d'
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}