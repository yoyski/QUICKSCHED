// models/PostedNotification.js
import mongoose from "mongoose";

const PostedNotificationSchema = new mongoose.Schema({
  post_type: { type: String, required: true },
  schedule_publish_time: { type: Date, required: true },
  message: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("PostedNotification", PostedNotificationSchema);