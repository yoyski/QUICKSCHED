import { useState } from "react";

const padZero = (num) => num.toString().padStart(2, "0");

const ScheduleDate = ({ onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(now.getHours() % 12 || 12);
  const [minute, setMinute] = useState(now.getMinutes());
  const [second, setSecond] = useState(now.getSeconds());
  const [amPm, setAmPm] = useState(now.getHours() >= 12 ? "PM" : "AM");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();

  const handleDone = () => {
    const fullHour = amPm === "PM" ? (hour % 12) + 12 : hour % 12;
    const date = new Date(
      now.getFullYear(),
      month,
      day,
      fullHour,
      minute,
      second
    );
    setSelectedDate(date);
    setShowPicker(false);
    onChange && onChange(date);
  };

  return (
    <div className="w-full relative">
      <button
        type="button"
        onClick={() => setShowPicker(true)}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-full transition mb-4 cursor-pointer"
      >
        {selectedDate ? selectedDate.toLocaleString() : "Choose Date & Time"}
      </button>

      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-2xl p-6 w-80 space-y-6 shadow-2xl text-gray-800">
            <h2 className="text-lg font-bold text-purple-600 text-center">
              Pick a Date & Time
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="bg-purple-100 p-2 rounded focus:outline-none"
              >
                {months.map((m, i) => (
                  <option key={i} value={i}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={day}
                onChange={(e) => setDay(parseInt(e.target.value))}
                className="bg-purple-100 p-2 rounded focus:outline-none"
              >
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value))}
                className="bg-purple-100 p-2 rounded focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {padZero(h)}
                  </option>
                ))}
              </select>

              <select
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value))}
                className="bg-purple-100 p-2 rounded focus:outline-none"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {padZero(m)}
                  </option>
                ))}
              </select>

              <select
                value={second}
                onChange={(e) => setSecond(parseInt(e.target.value))}
                className="bg-purple-100 p-2 rounded focus:outline-none"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((s) => (
                  <option key={s} value={s}>
                    {padZero(s)}
                  </option>
                ))}
              </select>

              <select
                value={amPm}
                onChange={(e) => setAmPm(e.target.value)}
                className="bg-purple-100 p-2 rounded focus:outline-none"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDone}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleDate;
