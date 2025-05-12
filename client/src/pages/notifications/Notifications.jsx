import { Header } from "../../components/header";

export const Notifications = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-xl rounded-lg p-6 w-80 max-w-xs">
          <div className="flex justify-between items-start">
            <span className="text-sm text-purple-600 font-semibold">
              General
            </span>
            <button className="text-purple-600 hover:text-purple-800 text-lg transition duration-300">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
          <p className="text-gray-700 mt-3 text-sm">
            Scheduled:{" "}
            <span className="text-purple-600">May 15, 2025 at 10:00 AM</span>
          </p>
        </div>
      </div>
    </>
  );
};
