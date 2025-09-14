import React from "react";
import toast from "react-hot-toast";
import NotificationToast from "./NotificationToast";

const DeleteModal = ({ isOpen, onClose, onDelete, currentLink, loading }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    const res = await onDelete(currentLink.id);
    console.log(res);
    if (!res.success) {
      onClose(false);
      return toast.custom((t) => (
        <NotificationToast type="error" message={res.message} t={t} />
      ));
    }
    toast.custom((t) => (
      <NotificationToast type="success" message={res.message} t={t} />
    ));
    onClose(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 animate-fadeIn">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800">
          Delete Confirmation
        </h2>
        <p className="mt-2 text-gray-600">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-600 text-white disabled:bg-red-300 disabled:cursor-not-allowed hover:bg-red-700 transition"
          >
            {loading ? "Please Wait..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
