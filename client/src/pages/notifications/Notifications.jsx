import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import axios from "axios";
import { format } from "date-fns";

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/quicksched/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/quicksched/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-[#f5f6f8] min-h-screen py-6 sm:py-10 mt-6">
        <div className="w-full px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            Notifications
          </h2>

          {Array.isArray(notifications) && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm uppercase">
                    {notif.post_type?.charAt(0) || "N"}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      <span className="font-medium text-gray-900">{notif.post_type}</span>:{" "}
                      {notif.message || "No message content."}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Scheduled:{" "}
                      <span className="font-medium">
                        {format(new Date(notif.schedule_publish_time), "MMMM d, yyyy 'at' h:mm a")}
                      </span>
                    </p>
                  </div>

                  <button
                    className="text-gray-300 hover:text-red-400 transition"
                    title="Delete notification"
                    onClick={() => setConfirmDelete(notif)}
                  >
                    <i className="fas fa-times text-base"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">No notifications available.</p>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl"
              onClick={() => setConfirmDelete(null)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this notification?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
