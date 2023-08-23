import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  secure_url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

export const Image = mongoose.model("Image", ImageSchema);
