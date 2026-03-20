import mongoose from "mongoose";
export const connect = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABASE);
  } catch (err) {
    console.error("Connect database failed: " + err);
    process.exit(1);
  }
};
