import { Router } from 'express';
import { addScheduledPost, getAllScheduledPosts, getScheduledPostById, updateScheduledPost, deleteScheduledPost, getScheduledPostByPostType } from '../controller/scheduleController.js';

const router = Router();

// CREATE - Add a new scheduled post
router.route('/schedule').post(addScheduledPost);//this is for backend this will never put in path, this will not view in the browser url

// READ - Get all scheduled posts
router.route('/schedule').get(getAllScheduledPosts);

// READ - Get one post by ID
router.route('/schedule/:id').get(getScheduledPostById);

// READ - Get all scheduled by post type
router.route('/schedule/type/:post_type').get(getScheduledPostByPostType);

// UPDATE - Update a post by ID
router.route('/schedule/:id').post(updateScheduledPost);

// DELETE - Delete a post by ID
router.route('/schedule/:id').delete(deleteScheduledPost);

export default router;