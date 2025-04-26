import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoriesPostType from "../../components/categoriesPostType";
import ScheduleDate from "../../components/scheduleDate";
import axios from "axios";

export const Create = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("general");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [isValidSchedule, setIsValidSchedule] = useState(false);

  const [schedulePost, setSchedulePost] = useState({
    post_type: "general",
    message: "",
    schedule_publish_time: null,
  });

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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isValidSchedule || !schedulePost.message.trim()) {
      console.warn("Invalid schedule or empty message.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/quicksched/schedule",
        {
          post_type: schedulePost.post_type,
          message: schedulePost.message,
          schedule_publish_time: schedulePost.schedule_publish_time,
        }
      );

      console.log("Upload response:", res.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating scheduled post:", error);
    }
  };

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

  return (
    <div className="h-screen flex flex-col justify-between bg-[#eef2f5] px-4 pt-6 pb-24 max-w-sm mx-auto text-gray-800">
      <form
        onSubmit={onSubmit}
        className="bg-blue-500 rounded-3xl shadow-xl p-4 flex flex-col space-y-4"
      >
        {/* Category Selection */}
        <CategoriesPostType
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Message Input */}
        <textarea
          id="message"
          name="message"
          rows="3"
          placeholder="Write your message..."
          value={schedulePost.message}
          onChange={handleChange}
          className="bg-[#f9fafb] border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Schedule Date Picker */}
        <ScheduleDate onChange={setScheduleDate} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValidSchedule}
          className={`w-full font-semibold py-3 rounded-full transition text-white ${
            isValidSchedule
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isValidSchedule ? "Schedule Post" : "Invalid Schedule"}
        </button>
      </form>

      {/* Back Link */}
      <Link
        to="/"
        className="mt-4 text-center text-sm text-purple-500 hover:underline"
      >
        Back
      </Link>
    </div>
  );
};
