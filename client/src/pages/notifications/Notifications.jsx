import { Header } from "../../components/header";
import { useEffect, useState, useContext } from "react";
import { format } from "date-fns";
import { fetchNotifications, deleteNotificationPost } from "../../apiClient";
import { AdminContext } from "../../App"; // Adjust if needed

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteNotification, setConfirmDeleteNotification] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { isAdmin } = useContext(AdminContext);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n._id));
    }
    setSelectAll(!selectAll);
  };

  const isSelected = (id) => selectedIds.includes(id);

  return (
    <>
      <Header />

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
            <div
              className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            />
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            />
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.45s" }}
            />
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <div className="px-4 sm:px-6 lg:px-20 xl:px-40 mt-20">
          {notifications.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                No notifications yet.
              </h2>
              <p className="text-gray-600 mb-6">
                Notifications will appear here when available.
              </p>
            </div>
          ) : (
            <>
              {/* Title + Actions */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                <div className="flex items-center gap-4">
                  {notifications.length > 0 && (
                    <button
                      onClick={toggleSelectAll}
                      disabled={!isAdmin}
                      className={`text-sm font-medium hover:underline ${
                        isAdmin
                          ? "text-purple-600 cursor-pointer"
                          : "text-gray-400 cursor-not-allowed hover:underline:none"
                      }`}
                      title={isAdmin ? undefined : "Admin mode required to select all"}
                      tabIndex={isAdmin ? 0 : -1}
                    >
                      {selectAll ? "Unselect All" : "Select All"}
                    </button>
                  )}

                  {isAdmin && selectedIds.length > 0 && (
                    <button
                      onClick={() => setConfirmDeleteNotification({ multiple: true })}
                      className="text-sm font-medium text-red-600 hover:underline"
                      title="Delete selected notifications"
                    >
                      <i className="fa-regular fa-trash-can mr-1" />
                      Delete Selected
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {notifications.map((notif) => {
                  let bgColor = "bg-gray-100 text-gray-800";
                  const letter = notif.post_type?.charAt(0).toUpperCase() || "N";
                  if (letter === "G") {
                    bgColor = "bg-yellow-100 text-yellow-800";
                  } else if (letter === "B") {
                    bgColor = "bg-red-100 text-red-800";
                  } else if (letter === "E") {
                    bgColor = "bg-blue-100 text-blue-800";
                  } else if (letter === "H") {
                    bgColor = "bg-green-100 text-green-800";
                  }

                  return (
                    <div
                      key={notif._id}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start justify-between max-h-32"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        {isAdmin && (
                          <input
                            type="checkbox"
                            checked={isSelected(notif._id)}
                            onChange={() => {
                              setSelectedIds((prev) =>
                                isSelected(notif._id)
                                  ? prev.filter((id) => id !== notif._id)
                                  : [...prev, notif._id]
                              );
                            }}
                            className="accent-purple-600 w-4 h-4"
                          />
                        )}

                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${bgColor}`}
                        >
                          {letter}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-800 truncate whitespace-nowrap overflow-hidden w-72 sm:w-96 md:w-[30rem] lg:w-[40rem]">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            🕒{" "}
                            {format(
                              new Date(notif.schedule_publish_time),
                              "MMM d, yyyy · h:mm a"
                            )}
                          </p>

                          {/* New line added */}
                          <p className="text-xs text-gray-600 mt-1 italic">
                            Your scheduled post is already posted on Facebook.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isAdmin) {
                            setConfirmDeleteNotification(notif);
                          } else {
                            alert("You need to be in Admin Mode to delete notifications.");
                          }
                        }}
                        title="Delete"
                        className={`text-lg ${
                          isAdmin
                            ? "text-gray-500 hover:text-red-600 cursor-pointer"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isAdmin}
                      >
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteNotification && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl"
              onClick={() => setConfirmDeleteNotification(null)}
              title="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {confirmDeleteNotification?.multiple
                ? "Are you sure you want to delete all selected notifications?"
                : "Are you sure you want to delete this notification?"}
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteNotification(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    if (confirmDeleteNotification?.multiple) {
                      // Bulk delete
                      await Promise.all(
                        selectedIds.map((id) => deleteNotificationPost(id))
                      );
                      setNotifications((prev) =>
                        prev.filter((n) => !selectedIds.includes(n._id))
                      );
                      setSelectedIds([]);
                    } else {
                      // Single delete
                      await deleteNotificationPost(confirmDeleteNotification._id);
                      setNotifications((prev) =>
                        prev.filter((n) => n._id !== confirmDeleteNotification._id)
                      );
                      setSelectedIds((prev) =>
                        prev.filter((id) => id !== confirmDeleteNotification._id)
                      );
                    }

                    setConfirmDeleteNotification(null);
                  } catch (err) {
                    console.error("Delete failed:", err);
                  }
                }}
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
