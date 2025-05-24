import { useEffect, useState, useContext } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Header } from "../../components/header";
import { Link } from "react-router-dom";
import {
  fetchAllScheduledPosts,
  deleteScheduledPost,
} from "../../apiClient"; // Adjust path if needed
import { AdminContext } from "../../App"; // Import AdminContext

const localizer = momentLocalizer(moment);

const calendarColors = {
  general: "#FDE68A",
  birthday: "#FCA5A5",
  event: "#BFDBFE",
  holiday: "#6EE7B7",
};

const getEventStyle = (event) => {
  const color = calendarColors[event.type] || "#E5E7EB";
  return {
    style: {
      backgroundColor: color,
      color: "#1F2937",
      borderRadius: "6px",
      border: "1px solid #D1D5DB",
      padding: "4px",
    },
  };
};

const CustomToolbar = ({ date, view, setView, setButtonLoading }) => {
  const formattedDate = moment(date).format("MMMM D, YYYY");

  const handleViewChange = (newView) => {
    setButtonLoading(true);
    setView(newView);
    setTimeout(() => setButtonLoading(false), 500);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
      <h2 className="text-xl sm:text-2xl font-semibold">{formattedDate}</h2>
      <div className="flex flex-row justify-center md:justify-start space-x-2">
        <button
          className={`px-4 py-2 rounded-md transition cursor-pointer ${
            view === "month" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleViewChange("month")}
        >
          Month
        </button>
        <button
          className={`px-4 py-2 rounded-md transition cursor-pointer ${
            view === "week" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleViewChange("week")}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 rounded-md transition cursor-pointer ${
            view === "day" ? "bg-purple-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleViewChange("day")}
        >
          Day
        </button>
      </div>
    </div>
  );
};

export const CalendarPage = () => {
  const { isAdmin } = useContext(AdminContext); // get admin state here

  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeletePost, setConfirmDeletePost] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchAllScheduledPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const events = posts.map((post) => ({
    title: post.message,
    start: new Date(post.schedule_publish_time),
    end: new Date(post.schedule_publish_time),
    allDay: true,
    type: post.post_type,
    id: post._id,
    schedule_publish_time: post.schedule_publish_time,
  }));

  const handleEventClick = (event) => {
    setSelectedEventType(event.type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEventType(null);
  };

  const formatScheduleTime = (date) => {
    return moment(date).format("LLL");
  };

  const filteredPostsByType = selectedEventType
    ? posts.filter((post) => post.post_type === selectedEventType)
    : [];

  return (
    <>
      <Header />

      {buttonLoading && (
        <div className="h-1 bg-purple-500 animate-pulse transition-all duration-300" />
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-600 text-center sm:text-left">
          📅 Calendar View
        </h2>
        <div className="h-[500px] sm:h-[600px] md:h-[700px] bg-white p-2 sm:p-4 rounded-xl shadow border border-gray-200 overflow-hidden">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            views={["month", "week", "day"]}
            popup
            eventPropGetter={getEventStyle}
            onSelectEvent={handleEventClick}
            onView={setView}
            components={{
              toolbar: (props) => (
                <CustomToolbar
                  view={view}
                  setView={setView}
                  setButtonLoading={setButtonLoading}
                  {...props}
                />
              ),
            }}
          />
        </div>
      </div>

      {modalOpen && selectedEventType && (
        <div className="fixed inset-0 bg-white/30 flex justify-center items-center z-50 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96 md:w-[500px] lg:w-[600px] shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={handleCloseModal}
            >
              &#10005;
            </button>
            <div className="p-6">
              {filteredPostsByType.length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold mb-4 text-purple-600">
                    {selectedEventType.charAt(0).toUpperCase() +
                      selectedEventType.slice(1)}{" "}
                    List
                  </h3>
                  <div className="max-h-[300px] overflow-y-auto">
                    <ul>
                      {filteredPostsByType.map((event) => (
                        <li
                          key={event._id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-2 rounded-lg space-y-2 sm:space-y-0"
                          style={{
                            backgroundColor:
                              calendarColors[event.post_type] || "#E5E7EB",
                          }}
                        >
                          <div>
                            <p className="font-semibold">{event.message}</p>
                            <p className="text-sm text-gray-500">
                              Scheduled: {formatScheduleTime(event.schedule_publish_time)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {/* Conditionally render edit link */}
                            {isAdmin ? (
                              <Link
                                to={`/create/${event._id}`}
                                title="Edit"
                                className="text-indigo-600 hover:text-indigo-800 transition text-lg sm:text-xl"
                              >
                                <i className="fa-solid fa-pen-to-square" />
                              </Link>
                            ) : (
                              <button
                                disabled
                                title="Edit (Admin only)"
                                className="text-gray-300 cursor-not-allowed text-lg sm:text-xl"
                              >
                                <i className="fa-solid fa-pen-to-square" />
                              </button>
                            )}

                            {/* Conditionally render delete button */}
                            {isAdmin ? (
                              <button
                                onClick={() => setConfirmDeletePost(event)}
                                title="Delete"
                                className="text-red-600 hover:text-red-800 transition text-lg sm:text-xl"
                              >
                                <i className="fa-solid fa-trash" />
                              </button>
                            ) : (
                              <button
                                disabled
                                title="Delete (Admin only)"
                                className="text-gray-300 cursor-not-allowed text-lg sm:text-xl"
                              >
                                <i className="fa-solid fa-trash" />
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p>No events found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {confirmDeletePost && isAdmin && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl cursor-pointer"
              onClick={() => setConfirmDeletePost(null)}
              aria-label="Close delete confirmation"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setConfirmDeletePost(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteScheduledPost(confirmDeletePost._id);
                    setPosts((prevPosts) =>
                      prevPosts.filter((post) => post._id !== confirmDeletePost._id)
                    );
                    setConfirmDeletePost(null);
                    setModalOpen(false);
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
