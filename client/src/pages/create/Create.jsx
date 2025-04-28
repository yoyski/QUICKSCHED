import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoriesPostType from "../../components/categoriesPostType";
import ScheduleDate from "../../components/scheduleDate";
import { UnsavedChangesWarning } from "../../components/unsavedChangesWarning";

import axios from "axios";

export const Create = () => {
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

      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "quicksched_cloudinary");
          data.append("cloud_name", "daxtqkkj5");

          const cloudinaryRes = await axios.post(
            "https://api.cloudinary.com/v1_1/daxtqkkj5/image/upload",
            data
          );

          return cloudinaryRes.data.url;
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
        console.log("Uploaded image URLs:", uploadedImageUrls);
      }

      const postData = {
        post_type: schedulePost.post_type,
        message: schedulePost.message,
        schedule_publish_time: schedulePost.schedule_publish_time,
        images: uploadedImageUrls,
      };

      const res = await axios.post(
        "http://localhost:8000/quicksched/schedule",
        postData
      );

      console.log("Upload response:", res.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating scheduled post:", error);
    } finally {
      setProgress(100);
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (scheduleDate) {
      const selected = new Date(scheduleDate);
      const now = new Date();
      const diffMinutes = (selected - now) / (1000 * 60);

      setIsValidSchedule(diffMinutes >= 30);
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
    <div className="h-screen flex flex-col justify-between bg-[#eef2f5] px-4 pt-6 pb-24 max-w-sm mx-auto text-gray-800">
      {/* Top Loading Bar */}
      {loading && (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center">
          {/* Bouncing Dots Loader */}
          <div className="flex space-x-2">
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
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

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-3xl shadow-xl p-6 flex flex-col space-y-6"
      >
        {/* Upload Image and Category Section */}
        <div className="flex gap-2 items-center">
          <label className="w-12 h-12 flex items-center justify-center cursor-pointer bg-purple-600 hover:bg-purple-700 text-white rounded-full">
            <i className="fa-solid fa-upload"></i>
            <input
              type="file"
              multiple
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
          rows="4"
          placeholder="Write your message..."
          value={schedulePost.message}
          onChange={handleChange}
          className="bg-[#f9fafb] border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 w-full"
        />

        <ScheduleDate onChange={setScheduleDate} />

        {selectedFiles.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pt-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-purple-300 shadow-md"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="Selected"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 text-red-500 hover:text-red-600 w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 text-center font-semibold py-3 rounded-full text-purple-600 border border-purple-300 hover:bg-purple-50 transition cursor-pointer"
          >
            ← Back
          </button>

          <button
            type="submit"
            disabled={!isValidSchedule}
            className={`flex-1 font-semibold py-3 rounded-full text-white transition-all ${
              isValidSchedule
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isValidSchedule ? "Schedule Post" : "Invalid Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
};
