import React from "react";
import { Link } from "react-router-dom";
import Favorite from "../../assets/favorite.svg";

const Card = ({ items }) => {
  const getImageUrl = (item) => {
    // Handle new format (array of images)
    if (
      item.imageUrls &&
      Array.isArray(item.imageUrls) &&
      item.imageUrls.length > 0
    ) {
      return item.imageUrls[0];
    }
    // Handle old format (single image)
    if (item.imageUrl) {
      return item.imageUrl;
    }
    // Fallback placeholder
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  return (
    <div className="px-4 sm:px-10 md:px-16 lg:px-24 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-[#002f34] mb-6">
        Fresh recommendations
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-gray-500 mb-2">No items found</p>
          <p className="text-sm text-gray-400">
            Start by posting your first ad!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              to="/details"
              state={{ item }}
              key={item.id}
              className="group"
            >
              <div className="relative w-full h-80 rounded-md bg-white border border-gray-200 shadow-sm hover:shadow-md transition duration-200 cursor-pointer overflow-hidden">
                {/* Favorite Button */}
                <div className="absolute top-3 right-3 z-10 flex justify-center items-center p-2 bg-white border border-gray-200 rounded-full hover:shadow-md transition-transform hover:scale-110">
                  <img className="w-5" src={Favorite} alt="favorite" />
                </div>

                {/* Image */}
                <div className="w-full h-44 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-200">
                  <img
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    src={getImageUrl(item)}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col h-36">
                  <h2 className="font-bold text-lg text-[#002f34] truncate">
                    ₹{" "}
                    {item.price
                      ? Number(item.price).toLocaleString("en-IN")
                      : "0"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {item.category}
                  </p>
                  <p className="text-sm text-gray-800 mt-1 line-clamp-2 flex-1">
                    {item.title}
                  </p>
                  {item.location && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      📍 {item.location}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
