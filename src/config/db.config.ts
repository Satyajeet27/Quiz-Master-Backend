import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Database connected");
  } catch (error) {
    console.log("Error in connecting Database", error);
    process.exit(1);
  }
};

export default connectDB;
