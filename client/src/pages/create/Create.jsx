import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoriesPostType from "../../components/categoriesPostType";
import ScheduleDate from "../../components/scheduleDate";
import { UnsavedChangesWarning } from "../../components/unsavedChangesWarning";

// Import your API client functions
import {
  fetchScheduledPostById,
  createScheduledPost,
  updateScheduledPost,
} from "../../apiClient";

export const Create = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("general");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [isValidSchedule, setIsValidSchedule] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showWarningLabel, setShowWarningLabel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [schedulePost, setSchedulePost] = useState({
    post_type: "general",
    message: "",
    schedule_publish_time: null,
  });

  // Fetch existing post if editing (id present)
  useEffect(() => {
    if (id) {
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
  }, [id]);

  // Progress bar animation while loading
  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedulePost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSelectedCategory(value);
    setSchedulePost((prev) => ({
      ...prev,
      post_type: value,
    }));
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

    if (!isValidSchedule || !schedulePost.message.trim()) {
      console.warn("Invalid schedule or empty message.");
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrls = [];

      // Separate new files from existing URLs
      const newFiles = selectedFiles.filter((file) => file instanceof File);
      const existingUrls = selectedFiles.filter(
        (file) => typeof file === "string"
      );

      // Upload new files to Cloudinary
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "quicksched_cloudinary");
          data.append("cloud_name", "daxtqkkj5");

          const cloudinaryRes = await fetch(
            "https://api.cloudinary.com/v1_1/daxtqkkj5/image/upload",
            {
              method: "POST",
              body: data,
            }
          );
          const json = await cloudinaryRes.json();
          return json.url;
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // Prepare post data to send to backend
      const postData = {
        post_type: schedulePost.post_type,
        message: schedulePost.message,
        schedule_publish_time: schedulePost.schedule_publish_time,
        images: [...existingUrls, ...uploadedImageUrls],
      };

      let res;
      if (id) {
        // Update existing post
        res = await updateScheduledPost(id, postData);
      } else {
        // Create new post
        res = await createScheduledPost(postData);
      }

      console.log("Upload response:", res);
      navigate("/");
    } catch (error) {
      console.error("Error creating scheduled post:", error);
    } finally {
      setProgress(100);
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    // Cleanup object URLs for new files when component unmounts or selectedFiles changes
    return () => {
      selectedFiles.forEach((file) => {
        if (file instanceof File) URL.revokeObjectURL(file);
      });
    };
  }, [selectedFiles]);

  // Validate scheduleDate and update schedulePost accordingly
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
    if (schedulePost.message.trim() !== "" || selectedFiles.length > 0) {
      setShowWarningLabel(true);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 flex justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-3 flex flex-col space-y-4 mt-4">
        {loading && (
          <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center">
            <div className="flex space-x-2">
              <div
                className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <div
                className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.45s" }}
              ></div>
            </div>
          </div>
        )}

        {showWarningLabel && (
          <UnsavedChangesWarning
            onCancel={() => setShowWarningLabel(false)}
            onConfirm={() => navigate("/")}
          />
        )}

        <div className="flex items-center gap-3">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full flex items-center justify-center transition"
            title="Upload images"
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
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
        />

        <ScheduleDate onChange={setScheduleDate} defaultValue={scheduleDate} />

        {selectedFiles.length > 0 && (
          <div className="flex space-x-3 overflow-x-auto pt-1 pb-1">
            {selectedFiles.map((file, index) => {
              const imageUrl =
                file instanceof File ? URL.createObjectURL(file) : file;
              return (
                <div
                  key={index}
                  className="relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden shadow-md border border-gray-200"
                >
                  <img
                    src={imageUrl}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-red-600 transition"
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
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white rounded-md py-2 transition"
          >
            Back
          </button>

          <button
            type="submit"
            onClick={onSubmit}
            disabled={loading || !isValidSchedule || !schedulePost.message.trim()}
            className={`flex-1 rounded-md py-2 text-white ${
              loading || !isValidSchedule || !schedulePost.message.trim()
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } transition`}
          >
            {loading ? "Saving..." : id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
