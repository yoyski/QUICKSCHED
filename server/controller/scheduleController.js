import ScheduledPost from "../model/schedule.model.js";
import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

const pageId = process.env.FB_PAGE_ID;
const pageAccessToken = process.env.FB_ACCESS_TOKEN;

const cleanupAndPost = async () => {
  try {
    const allPosts = await ScheduledPost.find();

    for (const post of allPosts) {
      const { fb_post_id, _id, schedule_publish_time } = post;
      if (!fb_post_id || !schedule_publish_time) continue;

      const currentTime = new Date();
      const scheduledTime = new Date(schedule_publish_time);

      // Check if the current time is exactly the same as the scheduled time (within the minute)
      if (
        currentTime.getMinutes() === scheduledTime.getMinutes() &&
        currentTime.getHours() === scheduledTime.getHours() &&
        currentTime.getDate() === scheduledTime.getDate() &&
        currentTime.getMonth() === scheduledTime.getMonth() &&
        currentTime.getFullYear() === scheduledTime.getFullYear()
      ) {
        try {
          // Call the Facebook API to check if the post is published
          const fbResponse = await axios.get(
            `https://graph.facebook.com/v22.0/${fb_post_id}?fields=is_published&access_token=${pageAccessToken}`
          );

          // If the post is published, delete it from the database
          if (fbResponse.data.is_published === true) {
            await ScheduledPost.findByIdAndDelete(_id);
            console.log(`Deleted published post at scheduled time: ${_id}`);
          }
        } catch (fbError) {
          console.error(
            `Error checking FB post ${fb_post_id}:`,
            fbError?.response?.data || fbError.message
          );
        }
      }
    }
  } catch (error) {
    console.error("Cleanup failed:", error.message);
  }
};

// Run the cron job every second
cron.schedule("* * * * * *", cleanupAndPost);


export const addScheduledPost = async (req, res) => {
  const { post_type, message, schedule_publish_time, images } = req.body;

  try {
    // Step 1: Upload images and get media_fbid
    const uploadMultipleImages = async (imageUrls) => {
      const mediaFbids = [];
      for (const url of imageUrls) {
        const response = await axios.post(
          `https://graph.facebook.com/v22.0/${pageId}/photos`,
          {
            url: url,
            published: false,
            access_token: pageAccessToken,
          }
        );
        mediaFbids.push({ media_fbid: response.data.id });
      }
      return mediaFbids;
    };

    const attachedMedia = await uploadMultipleImages(images);

    // Step 2: Schedule the actual post
    const scheduledUnixTime = Math.floor(new Date(schedule_publish_time).getTime() / 1000);
    const fbResponse = await axios.post(`https://graph.facebook.com/v22.0/${pageId}/feed`, {
      message,
      attached_media: attachedMedia,
      published: false,
      scheduled_publish_time: scheduledUnixTime,
      access_token: pageAccessToken,
    });

    const fb_post_id = fbResponse.data.id;

    // Step 3: Save to DB with fb_post_id
    const schedulePost = new ScheduledPost({
      post_type,
      message,
      schedule_publish_time: new Date(schedule_publish_time),
      images,
      fb_post_id,
    });

    const savedScheduledPost = await schedulePost.save();

    res.status(201).json({
      message: "Post scheduled on Facebook",
      savedScheduledPost,
    });
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    res.status(500).json({
      message: "Failed to schedule post",
      error: errMsg,
    });
  }
}; // add a storing deleted data to database store it in postedNotification model make sure the millisecond is always 00 so it will be deleted just clean or change the code later to make sure even not 00 or just change the cron job to every millisecond

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