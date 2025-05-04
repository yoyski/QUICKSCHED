import { Header } from "../../components/header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmDeletePost, setConfirmDeletePost] = useState(null); // 🔥 NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/quicksched/schedule");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch scheduled posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getPostTypeColor = (postType) => {
    switch (postType) {
      case "general":
        return "bg-yellow-200 text-yellow-800";
      case "birthday":
        return "bg-red-200 text-red-800";
      case "event":
        return "bg-blue-200 text-blue-800";
      case "holiday":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  return (
    <>
      <Header />

      {/* LOADING ANIMATION */}
      {loading && (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <div className="p-4 max-w-5xl mx-auto px-12 sm:px-16 mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-gray-200 hover:border-indigo-400 transition-all shadow-md hover:shadow-xl rounded-2xl p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getPostTypeColor(
                      post.post_type
                    )}`}
                  >
                    {post.post_type}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/create/${post._id}`}
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-800 transition sm:text-2xl text-lg"
                    >
                      <i className="fa-solid fa-pen-to-square" />
                    </Link>
                    <button
                      onClick={() => setConfirmDeletePost(post)} // 🔥 Open confirm modal
                      title="Delete"
                      className="text-red-600 hover:text-red-800 transition sm:text-2xl text-lg"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>

                {post.images?.length > 0 && (
                  <div
                    className="relative mb-4 cursor-pointer"
                    onClick={() => openModal(post)}
                  >
                    <img
                      src={post.images[0]}
                      alt="Post preview"
                      className="w-full h-32 sm:h-48 object-cover rounded-xl border border-gray-100"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white text-xl font-semibold">
                        +{post.images.length - 1}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{post.message}</p>

                <p className="text-xs text-center text-gray-500 mt-auto">
                  🕒 Scheduled: {format(new Date(post.schedule_publish_time), "PPP p")}
                </p>

                <button
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                  onClick={() => openModal(post)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE VIEW MODAL */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={closeModal}
              title="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold capitalize">{selectedPost.post_type}</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPost.message}</p>
              {selectedPost.images?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedPost.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Post image ${idx + 1}`}
                      className="rounded-lg object-cover h-60 w-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
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
                    await axios.delete(`http://localhost:8000/quicksched/schedule/${confirmDeletePost._id}`);
                    setPosts((prev) => prev.filter((post) => post._id !== confirmDeletePost._id));
                    setConfirmDeletePost(null);
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
