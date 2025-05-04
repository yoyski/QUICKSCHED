import ScheduledPost from "../model/schedule.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load .env before using process.env

export const addScheduledPost = async (req, res) => {
  const { post_type, message, schedule_publish_time, attached_media, images } =
    req.body;

  try {
    //Save to DB
    const schedulePost = new ScheduledPost({
      post_type,
      message,
      schedule_publish_time: new Date(schedule_publish_time),
      images,
    });

    const savedScheduledPost = await schedulePost.save();

    res
      .status(201)
      .json({ message: "Post scheduled on Facebook", savedScheduledPost });
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    res.status(500).json({ message: "Failed to schedule post", error: errMsg });
  }
};

export const getAllScheduledPosts = async (req, res) => {
  try {
    const scheduledPosts = await ScheduledPost.find();
    res.status(200).json(scheduledPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheduledPostById = async (req, res) => {
  try {
    const scheduledPost = await ScheduledPost.findById(req.params.id);
    if (!scheduledPost) {
      return res.status(404).json({ message: "Scheduled post not found" });
    }
    res.status(200).json(scheduledPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getScheduledPostByPostType = async (req, res) => {
  const { post_type } = req.params; // Extract post_type from request parameters

  try {
    const scheduledPost = await ScheduledPost.find({ post_type }); // Find scheduled posts by post_type
    res.status(200).json(scheduledPost); // Send the found scheduled posts as a response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Send error response if query fails
  }
};

export const updateScheduledPost = async (req, res) => {
  const { message, schedule_publish_time, attached_media, post_type, images } =
    req.body;

  try {
    const schedulePost = await ScheduledPost.findByIdAndUpdate(
      req.params.id,
      { message, schedule_publish_time, attached_media, post_type, images },
      { new: true }
    );
    if (!schedulePost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(schedulePost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteScheduledPost = async (req, res) => {
  try {
    const deletedScheduledPost = await ScheduledPost.findByIdAndDelete(
      req.params.id
    ); // Find and delete the user by ID
    if (!deletedScheduledPost) {
      return res.status(404).json({ message: "User not found" }); // If user not found, send a 404 response
    }
    res.json({ message: "User deleted successfully" }); // Send success response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Send error response if deletion fails
  }
};
