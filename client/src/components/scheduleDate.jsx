import { useState } from "react";

const padZero = (num) => num.toString().padStart(2, '0');

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

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysInMonth = new Date(now.getFullYear(), month + 1, 0).getDate();

  const handleDone = () => {
    const fullHour = amPm === "PM" ? (hour % 12) + 12 : hour % 12;
    const date = new Date(now.getFullYear(), month, day, fullHour, minute, second);
    setSelectedDate(date);
    setShowPicker(false);
    onChange && onChange(date);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-full transition mb-4"
      >
        {selectedDate
          ? selectedDate.toLocaleString()
          : "Choose Date & Time"}
      </button>

      {showPicker && (
        <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="bg-gray-700 p-2 rounded"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>

            <select
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              className="bg-gray-700 p-2 rounded"
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <select
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              className="bg-gray-700 p-2 rounded"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{padZero(h)}</option>
              ))}
            </select>

            <select
              value={minute}
              onChange={(e) => setMinute(parseInt(e.target.value))}
              className="bg-gray-700 p-2 rounded"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{padZero(m)}</option>
              ))}
            </select>

            <select
              value={second}
              onChange={(e) => setSecond(parseInt(e.target.value))}
              className="bg-gray-700 p-2 rounded"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((s) => (
                <option key={s} value={s}>{padZero(s)}</option>
              ))}
            </select>

            <select
              value={amPm}
              onChange={(e) => setAmPm(e.target.value)}
              className="bg-gray-700 p-2 rounded"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-full transition"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleDate;
