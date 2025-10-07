import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaMapMarkerAlt } from "react-icons/fa";
import { useFavorites } from "../../context/Favorites";
import { userAuth } from "../../context/Auth/Auth";
import Swal from "sweetalert2";

const Card = ({ items }) => {
  const navigate = useNavigate();
  const { user } = userAuth();
  const { isFavorite, toggleFavorites } = useFavorites();

  const handleCardClick = (item) => {
    navigate("/details", { state: { item } });
  };

  const handleFavoriteClick = async (e, itemId) => {
    e.stopPropagation();
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to favorites",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await toggleFavorites(itemId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update favorites",
      });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

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
    });
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[40vh] text-center">
        <svg
          className="w-20 h-20 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-lg text-gray-600">No items available</p>
        <p className="text-sm text-gray-500 mt-2">
          Check back later for new listings!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCardClick(item)}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
        >
          {/* Image Section */}
          <div className="relative h-40 sm:h-48 bg-gray-100 overflow-hidden">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={
                item.imageUrl ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={item.title}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />

            {/* Favorite Button */}
            <button
              onClick={(e) => handleFavoriteClick(e, item.id)}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 z-10"
              aria-label={
                isFavorite(item.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              {isFavorite(item.id) ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-600 text-lg hover:text-red-500" />
              )}
            </button>

            {/* Featured Badge */}
            {item.featured && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                ⭐ FEATURED
              </div>
            )}

            {/* Sold Badge */}
            {item.isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-lg">
                  SOLD
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-3 sm:p-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>

            <p className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
              ₹ {item.price?.toLocaleString()}
            </p>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1 truncate flex-1">
                <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                <span className="truncate">
                  {item.location || "Location N/A"}
                </span>
              </div>
              <span className="flex-shrink-0 ml-2 text-gray-500">
                {formatDate(item.createdAt || item.createAt)}
              </span>
            </div>

            {item.category && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
