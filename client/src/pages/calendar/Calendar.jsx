import { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Header } from "../../components/header";
import { Link } from "react-router-dom";

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

export const CalendarPage = () => {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeletePost, setConfirmDeletePost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/quicksched/schedule");
        setPosts(res.data);
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
    if (event.type === "event") {
      const relatedEvents = posts
        .filter((post) => post.post_type === "event")
        .map((e) => ({
          ...e,
          title: e.message,
        }));
      setSelectedEvent(relatedEvents);
    } else {
      const singleEvent = {
        ...event,
        title: event.title,
      };
      setSelectedEvent([singleEvent]);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const formatScheduleTime = (date) => {
    return moment(date).format("LLL");
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-4 mt-10">
        <h2 className="text-2xl font-semibold mb-4">📅 Calendar View</h2>

        <div className="flex justify-between items-center mb-4">
          <div className="space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={() => setView("month")}
            >
              Month View
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              onClick={() => setView("week")}
            >
              Week View
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              onClick={() => setView("day")}
            >
              Day View
            </button>
          </div>
        </div>

        <div className="h-[700px] bg-white p-4 rounded-xl shadow border border-gray-200">
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
          />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              &#10005;
            </button>
            <div className="p-6">
              {Array.isArray(selectedEvent) && selectedEvent.length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedEvent[0]?.type
                      ? `All ${selectedEvent[0].type.charAt(0).toUpperCase() + selectedEvent[0].type.slice(1)} Posts`
                      : "Event List"}
                  </h3>
                  <ul>
                    {selectedEvent.map((event, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center mb-4 p-2 rounded-lg"
                        style={{
                          backgroundColor: calendarColors[event.type] || "#E5E7EB",
                        }}
                      >
                        <div>
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-sm text-gray-500">
                            Scheduled: {formatScheduleTime(event.schedule_publish_time)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/create/${event.id}`}
                            title="Edit"
                            className="text-indigo-600 hover:text-indigo-800 transition sm:text-2xl text-lg"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                          </Link>
                          <button
                            onClick={() => setConfirmDeletePost(event)}
                            title="Delete"
                            className="text-red-600 hover:text-red-800 transition sm:text-2xl text-lg"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No events found</p>
              )}
            </div>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={handleCloseModal}
            >
              Back to Calendar
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {confirmDeletePost && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl"
              onClick={() => setConfirmDeletePost(null)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeletePost(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `http://localhost:8000/quicksched/schedule/${
                        confirmDeletePost._id || confirmDeletePost.id
                      }`
                    );

                    // Remove the post from frontend state without refreshing
                    setPosts((prevPosts) =>
                      prevPosts.filter(
                        (post) =>
                          post._id !== confirmDeletePost._id &&
                          post._id !== confirmDeletePost.id
                      )
                    );

                    setConfirmDeletePost(null);
                    setModalOpen(false); // Close event modal if needed
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
