import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import Login from "../components/Signin-modal/Login";
import { useFavorites } from "../context/Favorites";
import { useItemContext } from "../context/Sellitems";
import { FaArrowLeft, FaHeart } from "react-icons/fa";

const Favorites = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getFavoriteProducts, loading: favLoading } = useFavorites();
  const itemCtx = useItemContext();

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const favoriteItems = getFavoriteProducts(itemCtx?.items || []);

  if (favLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar toggleModal={toggleModal} />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Loading favorites...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleModal={toggleModal} />
      <Login toggleModal={toggleModal} status={isModalOpen} />

      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#002f34]">
              My Favorites
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {favoriteItems.length}{" "}
              {favoriteItems.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Content */}
        {favoriteItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <FaHeart className="mx-auto h-20 w-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start adding items to your favorites to see them here!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/details", { state: { item } })}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 bg-gray-100">
                  <img
                    className="w-full h-full object-cover"
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
                  <div className="absolute top-2 right-2 bg-red-500 p-2 rounded-full">
                    <FaHeart className="text-white text-sm" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate mb-1">
                    {item.title}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
                    ₹ {item.price?.toLocaleString()}
                  </p>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="truncate">{item.location || "N/A"}</span>
                  </div>
                  {item.category && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
