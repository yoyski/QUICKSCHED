export const Home = () => {
  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-purple-300 shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-700">Scheduled Post</h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            Scheduled
          </span>
        </div>
        <div className="text-gray-600 text-sm mb-2">
          <span className="font-semibold text-gray-800">Scheduled for: </span>
          April 27, 2025 at 2:30 PM
        </div>
        <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          View Details
        </button>
      </div>
    </>
  );
};
