import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: String,
});
export const Club = mongoose.model("Club", schema);
