import React, { useState } from "react";
import Container from "../UI/Container";
import { FilePenLine, Trash } from "lucide-react";
import DeleteModal from "../UI/DeleteModal";
import EditLinkModal from "../UI/EditLinkModal";
import { urlSchema } from "../../validation/url.validation";
import { useUrl } from "../../context/UrlContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NotificationToast from "../UI/NotificationToast";

const UrlLayout = () => {
  const [formData, setFormData] = useState({ url: "", shortCode: "" });
  const { createUrl, urls, getUrls, updateUrl, deleteUrl, loading } = useUrl();
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState({ url: "", shortCode: "" });

  const handleCreateLink = async (e) => {
    e.preventDefault();

    const { data, error } = urlSchema.safeParse(formData);
    if (error) {
      return setError(error?.issues?.[0].message);
    }
    setError(null);
    console.log(data);
    const res = await createUrl(data);
    console.log(res);
  };

  const handleUpdate = async (id, newLink) => {
    const res = await updateUrl(id, newLink);
    return res;
  };

  const handleDelete = async (id) => {
    const res = await deleteUrl(id);
    return res;
  };

  const fetchUrls = async () => {
    await getUrls();
  };

  return (
    <div>
      <Container className={`flex items-center justify-center`}>
        <div className="w-6xl mx-auto min-h-[500px] mt-20 p-8 bg-white shadow-primary rounded grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="tracking-wider text-lg font-semibold mb-5">
              Create Shortlinks
            </h2>
            <form className="space-y-6" onSubmit={handleCreateLink}>
              <div>
                <label
                  htmlFor="url"
                  className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
                >
                  Url
                </label>
                <input
                  id="url"
                  type="text"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="Enter your long URL"
                  className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2 px-3 outline-none text-sm transition duration-150"
                />
              </div>

              <div>
                <label
                  htmlFor="shortcode"
                  className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
                >
                  Short code
                </label>
                <input
                  id="shortcode"
                  type="text"
                  value={formData.shortCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortCode: e.target.value,
                    }))
                  }
                  placeholder="Custom short code (optional)"
                  className="border border-gray-300 w-full bg-gray-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 rounded py-2 px-3 outline-none text-sm transition duration-150"
                />
              </div>
              {error && <p className="text-sm mb-3 text-red-800">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-200"
              >
                Shorten
              </button>
            </form>
          </div>
          {/* form */}

          {/* shortened links */}
          <div>
            <h2 className="tracking-wider text-lg font-semibold mb-5">
              Shortened Links
            </h2>
            <ul className="flex flex-col gap-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {urls && urls.length === 0 ? (
                <div className="flex flex-col items-center justify-center  text-gray-500 py-10">
                  <p className=" font-medium">No links found</p>
                  <p className="">Start by creating your first short link ✨</p>
                </div>
              ) : (
                urls.map((link) => (
                  <li
                    key={link._id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* URL info */}
                    <div className="flex flex-col max-w-[70%]">
                      <a
                        href={`${link.redirectUrl}/api/v1/url/redirect/${link.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium truncate hover:underline"
                      >
                        {`${link.redirectUrl}/${link.shortCode}`}
                      </a>
                      <span className="text-xs text-gray-500 truncate">
                        {link.originalUrl}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        className="flex items-center justify-center w-9 h-9 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all duration-200"
                        onClick={() => {
                          setUpdateModalOpen(true);
                          setCurrentLink({
                            id: link._id,
                            url: link.originalUrl,
                            shortCode: link.shortCode,
                          });
                        }}
                      >
                        <FilePenLine size={18} />
                      </button>
                      <button
                        className="flex items-center justify-center w-9 h-9 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-200"
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setCurrentLink({ id: link._id });
                        }}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </Container>
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={(action) => setDeleteModalOpen(action)}
        onDelete={handleDelete}
        loading={loading}
        currentLink={currentLink}
      />
      <EditLinkModal
        isOpen={updateModalOpen}
        loading={loading}
        onClose={(action) => setUpdateModalOpen(action)}
        onUpdate={handleUpdate}
        currentLink={currentLink}
      />
    </div>
  );
};

export default UrlLayout;
