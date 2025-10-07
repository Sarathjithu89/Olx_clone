import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import Login from "../Signin-modal/Login";

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};

  const [openModal, setModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggleModal = () => setModal(!openModal);

  // Format date helper
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    let date;
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle missing item data
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar toggleModal={toggleModal} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Item not found
            </h3>
            <p className="text-gray-600 mb-6">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleModal={toggleModal} />
      <Login toggleModal={toggleModal} status={openModal} />

      <div className="p-4 sm:p-6 md:px-12 lg:px-24 xl:px-32 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
          <span className="font-medium">Back</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Image */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-96 md:h-[500px] bg-gray-100 flex items-center justify-center">
                {!imageError ? (
                  <img
                    className="object-contain w-full h-full"
                    src={item?.imageUrl}
                    alt={item?.title}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <svg
                      className="mx-auto h-24 w-24 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>Image not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Card - Mobile View */}
            <div className="lg:hidden mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  ₹ {item?.price?.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaTag />
                  <span>{item?.category}</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {item?.title}
              </h1>

              {item?.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{item.location}</span>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {item?.description}
                </p>
              </div>

              {/* Category-specific fields */}
              {item?.categoryFields &&
                Object.keys(item.categoryFields).length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(item.categoryFields).map(
                        ([key, value]) => (
                          <div key={key}>
                            <p className="text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="font-medium text-gray-900">{value}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Seller Information */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Seller Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUser className="text-gray-500" />
                    <span className="font-medium">
                      {item?.userName || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>
                      Posted on {formatDate(item?.createdAt || item?.createAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <FaPhone />
                  Show Phone Number
                </button>
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2">
                  <FaEnvelope />
                  Chat with Seller
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details (Desktop Only) */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  ₹ {item?.price?.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaTag />
                  <span>{item?.category}</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {item?.title}
              </h1>

              {item?.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{item.location}</span>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {item?.description}
                </p>
              </div>

              {/* Category-specific fields */}
              {item?.categoryFields &&
                Object.keys(item.categoryFields).length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(item.categoryFields).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <p className="text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="font-medium text-gray-900">{value}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Seller Information */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Seller Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUser className="text-gray-500" />
                    <span className="font-medium">
                      {item?.userName || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-gray-500" />
                    <span>
                      Posted on {formatDate(item?.createdAt || item?.createAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <FaPhone />
                  Show Phone Number
                </button>
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2">
                  <FaEnvelope />
                  Chat with Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
