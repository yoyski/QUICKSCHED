import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import axios from "axios";
import { format } from "date-fns";

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

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

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://localhost:8000/quicksched/notifications/${id}`)
        )
      );
      setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n._id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n._id));
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Header />
      <div className="bg-[#f5f6f8] min-h-screen py-6 sm:py-10 mt-6">
        <div className="w-full px-4 sm:px-6 md:px-8 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  className="text-sm text-purple-600 hover:underline"
                  onClick={toggleSelectAll}
                >
                  {selectedIds.length === notifications.length ? "Unselect All" : "Select All"}
                </button>
                {selectedIds.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md shadow-sm"
                  >
                    Delete Selected
                  </button>
                )}
              </div>
            )}
          </div>

          {Array.isArray(notifications) && notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className="relative flex items-start gap-4 p-4 rounded-xl bg-white hover:bg-gray-50 transition shadow-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-2"
                    checked={selectedIds.includes(notif._id)}
                    onChange={() => toggleSelect(notif._id)}
                  />

                  {/* Colored letter badge */}
                  {(() => {
                    const letter = notif.post_type?.charAt(0)?.toUpperCase() || "N";
                    let bgColor = "bg-gray-200";
                    let textColor = "text-gray-800";

                    if (letter === "G") {
                      bgColor = "bg-yellow-100";
                      textColor = "text-yellow-600";
                    } else if (letter === "B") {
                      bgColor = "bg-red-100";
                      textColor = "text-red-600";
                    } else if (letter === "E") {
                      bgColor = "bg-blue-100";
                      textColor = "text-blue-600";
                    } else if (letter === "H") {
                      bgColor = "bg-green-100";
                      textColor = "text-green-600";
                    }

                    return (
                      <div
                        className={`w-10 h-10 flex-shrink-0 rounded-full ${bgColor} ${textColor} flex items-center justify-center text-sm font-bold uppercase`}
                      >
                        {letter}
                      </div>
                    );
                  })()}

                  <div className="flex-1">
                    <div className="text-sm text-gray-800">
                      {notif.message?.length > 150 ? (
                        <>
                          {expandedIds.includes(notif._id)
                            ? notif.message
                            : `${notif.message.slice(0, 150)}...`}
                          <button
                            onClick={() => toggleExpand(notif._id)}
                            className="ml-1 text-purple-600 hover:underline text-xs font-medium"
                          >
                            {expandedIds.includes(notif._id) ? "See Less" : "See More"}
                          </button>
                        </>
                      ) : (
                        notif.message || "No message content."
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Scheduled:{" "}
                      <span className="font-medium">
                        {format(new Date(notif.schedule_publish_time), "MMMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  </div>

                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                    onClick={() => setConfirmDelete(notif)}
                  >
                    <i className="fas fa-times text-sm"></i>
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
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl"
              onClick={() => setConfirmDelete(null)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delete this notification?
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
