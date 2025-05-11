import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const scheduledPostSchema = new mongoose.Schema(
  { 
    
    post_type: {
      type: String,
      enum: ['birthday', 'event', 'holiday', 'general'],
      default: 'general',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    schedule_publish_time: {
      type: Number,
      required: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    attached_media: [
      {
        media_fbid: {
          type: String,
        }
      }
    ],
    access_token: {
      type: String,
      default: process.env.ACCESS_TOKEN,
    },
    fb_post_id: {
      type: String,
    },
    fb_post_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ScheduledPost = mongoose.model('ScheduledPost', scheduledPostSchema);

export default ScheduledPost;