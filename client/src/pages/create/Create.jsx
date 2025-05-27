import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import CategoriesPostType from "../../components/categoriesPostType";
import ScheduleDate from "../../components/scheduleDate";
import { UnsavedChangesWarning } from "../../components/unsavedChangesWarning";
import { AdminContext } from "../../App";

// API functions
import {
  fetchScheduledPostById,
  createScheduledPost,
  updateScheduledPost,
} from "../../apiClient";

export const Create = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useContext(AdminContext);

  const [selectedCategory, setSelectedCategory] = useState("general");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [isValidSchedule, setIsValidSchedule] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [schedulePost, setSchedulePost] = useState({
    post_type: "general",
    message: "",
    schedule_publish_time: null,
  });

  useEffect(() => {
    document.body.style.overflow = isAdmin ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAdmin]);

  useEffect(() => {
    if (id && isAdmin) {
      const fetchPost = async () => {
        try {
          const post = await fetchScheduledPostById(id);
          setSchedulePost({
            post_type: post.post_type,
            message: post.message,
            schedule_publish_time: post.schedule_publish_time,
          });
          setSelectedCategory(post.post_type);
          setScheduleDate(new Date(post.schedule_publish_time));
          if (post.images) {
            setSelectedFiles(post.images);
          }
        } catch (err) {
          console.error("Failed to fetch post:", err);
        }
      };
      fetchPost();
    }
  }, [id, isAdmin]);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 10));
      }, 200);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedulePost((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSelectedCategory(value);
    setSchedulePost((prev) => ({ ...prev, post_type: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValidSchedule || !schedulePost.message.trim()) return;

    setLoading(true);
    try {
      let uploadedImageUrls = [];

      const newFiles = selectedFiles.filter((file) => file instanceof File);
      const existingUrls = selectedFiles.filter(
        (file) => typeof file === "string"
      );

      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "quicksched_cloudinary");
          data.append("cloud_name", "daxtqkkj5");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/daxtqkkj5/image/upload",
            {
              method: "POST",
              body: data,
            }
          );
          const json = await res.json();
          return json.url;
        });
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const postData = {
        post_type: schedulePost.post_type,
        message: schedulePost.message,
        schedule_publish_time: schedulePost.schedule_publish_time,
        images: [...existingUrls, ...uploadedImageUrls],
      };

      let res;
      if (id) {
        res = await updateScheduledPost(id, postData);
      } else {
        res = await createScheduledPost(postData);
      }

      console.log("Upload response:", res);
      navigate("/");
    } catch (error) {
      console.error("Error creating/updating scheduled post:", error);
    } finally {
      setProgress(100);
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file instanceof File) URL.revokeObjectURL(file);
      });
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (scheduleDate) {
      const selected = new Date(scheduleDate);
      const now = new Date();
      const diffMinutes = (selected - now) / (1000 * 60);
      setIsValidSchedule(diffMinutes >= 10);
      setSchedulePost((prev) => ({
        ...prev,
        schedule_publish_time: selected.getTime(),
      }));
    } else {
      setIsValidSchedule(false);
    }
  }, [scheduleDate]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 flex justify-center">
      <div
        className={`w-full max-w-lg bg-white rounded-lg shadow-md p-3 flex flex-col space-y-4 mt-4 relative overflow-hidden ${
          loading ? "pointer-events-none" : ""
        }`}
      >
        {/* Loading Progress Bar */}
        {progress > 0 && (
          <div className="absolute top-0 left-0 w-full bg-gray-200 rounded-t-md overflow-hidden h-1 z-50">
            <div
              className="bg-purple-600 h-1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Dim overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 z-40 flex items-center justify-center">
            <div className="text-purple-700 font-semibold animate-pulse">
              Scheduling...
            </div>
          </div>
        )}

        {isAdmin ? (
          <>
            <div className="flex items-center gap-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 flex items-center justify-center rounded-full transition"
              >
                <i className="fa-solid fa-camera" />
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="flex-1">
                <CategoriesPostType
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </div>

            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="What's on your mind?"
              value={schedulePost.message}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <ScheduleDate
              onChange={setScheduleDate}
              defaultValue={scheduleDate}
            />

            {selectedFiles.length > 0 && (
              <div className="flex space-x-3 overflow-x-auto pt-1 pb-1">
                {selectedFiles.map((file, index) => {
                  const imageUrl =
                    file instanceof File ? URL.createObjectURL(file) : file;
                  return (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border"
                    >
                      <img
                        src={imageUrl}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:text-red-600 shadow"
                        aria-label="Remove image"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex space-x-4 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-purple-600 hover:bg-purple-600 text-white rounded-md py-2"
              >
                Back
              </button>
              <button
                type="submit"
                onClick={onSubmit}
                disabled={
                  loading || !isValidSchedule || !schedulePost.message.trim()
                }
                className={`flex-1 rounded-md py-2 text-white ${
                  loading || !isValidSchedule || !schedulePost.message.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {id ? "Update" : "Schedule"}
              </button>
            </div>
          </>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Access Denied
              </h2>
              <p className="mb-6 text-gray-600">
                Please switch to Admin Mode to schedule posts.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
