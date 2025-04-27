export const UnsavedChangesWarning = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50">
      <div className="bg-white w-80 p-6 rounded-2xl shadow-xl text-center">
        <p className="text-purple-700 text-sm mb-4">
          You have unsaved changes. Are you sure you want to leave?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            type="button"
            className=" cursor-pointer flex-1 py-2 bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className=" cursor-pointer flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};
