import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Header } from "../../components/header";

export const Categories = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [confirmDeletePost, setConfirmDeletePost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/quicksched/schedule");
        setPosts(res.data);
        filterByCategory("general", res.data);
      } catch (err) {
        console.error("Failed to fetch scheduled posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filterByCategory = (category, allPosts = posts) => {
    setSelectedCategory(category);
    setFilteredPosts(allPosts.filter((post) => post.post_type === category));
  };

  const getPostTypeColor = (category) => {
    switch (category) {
      case "general":
        return "bg-yellow-200 text-yellow-800 border-yellow-300 hover:bg-yellow-300 hover:text-yellow-900";
      case "birthday":
        return "bg-red-200 text-red-800 border-red-300 hover:bg-red-300 hover:text-red-900";
      case "event":
        return "bg-blue-200 text-blue-800 border-blue-300 hover:bg-blue-300 hover:text-blue-900";
      case "holiday":
        return "bg-green-200 text-green-800 border-green-300 hover:bg-green-300 hover:text-green-900";
      default:
        return "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 hover:text-gray-900";
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
      {/* CATEGORY NAVIGATION */}
      <div className="w-full px-4 sm:px- md:px-8 mt-15">
        {/* Category buttons for medium and larger screens */}
        <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 md:flex`}>
          {["general", "birthday", "event", "holiday"].map((category) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-s sm:text-sm font-normal capitalize border transition duration-200 
                ${selectedCategory === category
                  ? getPostTypeColor(category)  // Dynamically apply the selected category styles
                  : "bg-white text-purple-600 border-purple-300 hover:bg-purple-100 hover:text-purple-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      )}

      {/* POSTS */}
      {!loading && (
        <div className="p-4 max-w-6xl mx-auto mt-10">
          {filteredPosts.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                No posts in this category yet.
              </h2>
              <p className="text-gray-600 mb-6">You can add a new post for this category.</p>
              <Link to="/create" className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                Create Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-lg transition"
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
                        className="text-indigo-600 hover:text-indigo-800 transition text-lg"
                      >
                        <i className="fa-solid fa-pen-to-square" />
                      </Link>
                      <button
                        onClick={() => setConfirmDeletePost(post)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800 transition text-lg"
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </div>

                  {post.images?.length > 0 && (
                    <div className="relative mb-4 cursor-pointer" onClick={() => openModal(post)}>
                      <img
                        src={post.images[0]}
                        alt="Post preview"
                        className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-xl border"
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
                    className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm"
                    onClick={() => openModal(post)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODAL */}
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
                    await axios.delete(`http://localhost:8000/quicksched/schedule/${confirmDeletePost._id}`);
                    const updatedPosts = posts.filter((post) => post._id !== confirmDeletePost._id);
                    setPosts(updatedPosts);
                    filterByCategory(selectedCategory, updatedPosts);
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
