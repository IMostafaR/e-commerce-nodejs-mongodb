import mongoose from "mongoose";

export const ImageSchema = new mongoose.Schema({
  secure_url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});
