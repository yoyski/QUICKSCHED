import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import axios from "axios";
import { format } from "date-fns";

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // State to hold notifications

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/quicksched/notifications");  // Make API call
        setNotifications(res.data);  // Set fetched notifications in state
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();  // Trigger fetch
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 px-45 py-15 space-y-4">
        {Array.isArray(notifications) && notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="bg-white shadow-md rounded-xl px-4 py-3 w-full max-w-3xl flex items-center justify-between hover:shadow-lg transition duration-200"
            >
              <div className="flex flex-col">
                <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                  {notif.post_type}
                </span>
                <p className="text-gray-800 text-sm mt-1 line-clamp-2">
                  {notif.message || "No message content."}
                </p>
                <span className="text-xs text-gray-500 mt-1">
                  Scheduled:{" "}
                  <span className="text-purple-500 font-medium">
                    {format(new Date(notif.schedule_publish_time), "MMMM d, yyyy 'at' h:mm a")}
                  </span>
                </span>
              </div>

              <button className="text-gray-400 hover:text-red-500 text-xl transition duration-300 ml-4">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No notifications available.</p>
        )}
      </div>
    </>
  );
};
