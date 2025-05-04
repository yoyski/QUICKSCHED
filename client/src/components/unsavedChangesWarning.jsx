export const UnsavedChangesWarning = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full text-center relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl"
          onClick={onCancel}
        >
          <i className="fa-solid fa-xmark" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          You have unsaved changes
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to leave without saving?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            type="button"
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};
