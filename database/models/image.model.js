import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

export const Image = mongoose.model("Image", ImageSchema);
