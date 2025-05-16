import ScheduledPost from "../model/schedule.model.js";
import PostedNotification from "../model/postedNotification.js";
import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

const pageId = process.env.FB_PAGE_ID;
const pageAccessToken = process.env.FB_ACCESS_TOKEN;

export const checkAndDeletePublishedPosts = async () => {
  try {
    const posts = await ScheduledPost.find({});
    if (posts.length === 0) return;

    for (const post of posts) {
      try {
        const response = await axios.get(
          `https://graph.facebook.com/v22.0/${post.fb_post_id}`,
          {
            params: {
              fields: "is_published",
              access_token: pageAccessToken,
            },
          }
        );

        const { is_published } = response.data;

        if (is_published) {
          const postNotification = new PostedNotification({
            post_type: post.post_type,
            message: post.message,
            schedule_publish_time: post.schedule_publish_time,
          });

          await postNotification.save();
          await ScheduledPost.findByIdAndDelete(post._id);

          console.log(`✅ Post published and removed: ${post._id}`);
        }
      } catch (error) {
        console.error(
          `❌ Error checking fb_post_id ${post.fb_post_id}:`,
          error.response?.data || error.message
        );
      }
    }
  } catch (err) {
    console.error(
      "❌ Global error in checkAndDeletePublishedPosts:",
      err.message
    );
  }
};

// Cron: every minute
cron.schedule("* * * * *", () => {
  checkAndDeletePublishedPosts();
});

// Function to schedule the post on Facebook and save it to the database
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
    const scheduledUnixTime = Math.floor(
      new Date(schedule_publish_time).getTime() / 1000
    );
    const fbResponse = await axios.post(
      `https://graph.facebook.com/v22.0/${pageId}/feed`,
      {
        message,
        attached_media: attachedMedia,
        published: false,
        scheduled_publish_time: scheduledUnixTime,
        access_token: pageAccessToken,
      }
    );

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
};

// add a storing deleted data to database store it in postedNotification model make sure the millisecond is always 00 so it will be deleted just clean or change the code later to make sure even not 00 or just change the cron job to every millisecond

export const getAllScheduledPosts = async (req, res) => {
  try {
    const scheduledPosts = await ScheduledPost.find().sort({
      schedule_publish_time: -1,
    });
    res.status(200).json(scheduledPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await PostedNotification.find().sort({
      schedule_publish_time: -1,
    });
    res.status(200).json(notifications);
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
