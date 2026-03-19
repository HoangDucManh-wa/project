import mongoose from "mongoose";
export const connect = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABASE);
    console.log("connect database successful");
  } catch (err) {
    console.log("connect database failed");
    console.log("error: " + err);
  }
};
