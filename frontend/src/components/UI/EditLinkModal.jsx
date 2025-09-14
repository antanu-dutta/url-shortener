import React, { useState, useEffect } from "react";
import NotificationToast from "./NotificationToast";
import toast from "react-hot-toast";

const EditLinkModal = ({ isOpen, onClose, onUpdate, currentLink, loading }) => {
  const [link, setLink] = useState({ url: "", shortCode: "" });
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    const res = await onUpdate(link.id, link);

    if (!res.success) {
      return setError(res.message);
    }
    toast.custom((t) => (
      <NotificationToast type="success" message={res.message} t={t} />
    ));
    setError(null);
    onClose(false);
  };

  useEffect(() => {
    if (isOpen) {
      setLink(currentLink || "");
    }
  }, [isOpen, currentLink]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 animate-fadeIn">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800">Edit Link</h2>
        <p className="mt-1 text-gray-500 text-sm">
          Update the link and save your changes.
        </p>

        {/* Input */}
        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">Link</label>
          <input
            type="url"
            value={link.url}
            onChange={(e) =>
              setLink((prev) => ({ ...prev, url: e.target.value }))
            }
            className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2 px-3 outline-none text-sm transition duration-150"
            placeholder="https://example.com"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">Short code</label>
          <input
            type="shortcode"
            value={link.shortCode}
            onChange={(e) =>
              setLink((prev) => ({ ...prev, shortCode: e.target.value }))
            }
            className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2 px-3 outline-none text-sm transition duration-150"
            placeholder="https://example.com"
          />
        </div>

        {error && <p className="text-sm my-3 text-red-800">{error}</p>}

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              setError(null);
              onClose(false);
            }}
            className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading && true}
            className="px-4 py-2 rounded bg-blue-600 disabled:bg-blue-300 cursor-pointer disabled:cursor-not-allowed text-white hover:bg-blue-700 transition"
          >
            {loading ? "Please Wait..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLinkModal;
