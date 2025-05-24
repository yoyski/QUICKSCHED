// src/apiClient.js
const apiUrl = import.meta.env.VITE_API_URL;

// Get all scheduled posts
export async function fetchAllScheduledPosts() {
  const res = await fetch(`${apiUrl}/quicksched/schedule`);
  if (!res.ok) throw new Error('Failed to fetch scheduled posts');
  return res.json();
}

// Get all notifications
export async function fetchNotifications() {
  const res = await fetch(`${apiUrl}/quicksched/notifications`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

// Get a scheduled post by ID
export async function fetchScheduledPostById(id) {
  const res = await fetch(`${apiUrl}/quicksched/schedule/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch post with id ${id}`);
  return res.json();
}

// Get scheduled posts by post type
export async function fetchScheduledPostsByType(post_type) {
  const res = await fetch(`${apiUrl}/quicksched/schedule/type/${post_type}`);
  if (!res.ok) throw new Error(`Failed to fetch posts with type ${post_type}`);
  return res.json();
}

// Create a new scheduled post
export async function createScheduledPost(postData) {
  const res = await fetch(`${apiUrl}/quicksched/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  if (!res.ok) throw new Error('Failed to create scheduled post');
  return res.json();
}

// Update a scheduled post by ID
export async function updateScheduledPost(id, updatedData) {
  const res = await fetch(`${apiUrl}/quicksched/schedule/${id}`, {
    method: 'POST', // your backend uses POST for update instead of PUT
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error(`Failed to update post with id ${id}`);
  return res.json();
}

// Delete a scheduled post by ID
export async function deleteScheduledPost(id) {
  const res = await fetch(`${apiUrl}/quicksched/schedule/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete post with id ${id}`);
  return res.json();
}

// Delete a notification by ID
export async function deleteNotificationPost(id) {
  const res = await fetch(`${apiUrl}/quicksched/notifications/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete notification with id ${id}`);
  return res.json();
}
