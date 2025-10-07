import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import Login from "../components/Signin-modal/Login";
import { getDataFromFireStore } from "../services/Firebase";
import { useItemContext } from "../context/Sellitems";
import Card from "../components/Cards/Card";

export const Homepage = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemCtx = useItemContext();
  const toggleModal = () => setIsModelOpen((prev) => !prev);

  useEffect(() => {
    const getItems = async () => {
      // Don't fetch if items already exist in context
      if (itemCtx?.items && itemCtx.items.length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getDataFromFireStore();
        itemCtx?.setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar toggleModal={toggleModal} />

      {/* Login Modal */}
      <Login toggleModal={toggleModal} status={isModelOpen} />

      {/* Main Content Container */}
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 pt-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-semibold text-gray-700">
                Loading products...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
              <svg
                className="mx-auto h-16 w-16 text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        ) : itemCtx?.items && itemCtx.items.length === 0 ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md">
              <svg
                className="mx-auto h-20 w-20 text-gray-400 mb-4"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products available
              </h3>
              <p className="text-gray-600">
                Check back later for new listings!
              </p>
            </div>
          </div>
        ) : (
          <Card items={(itemCtx?.items || []).filter((item) => !item.isSold)} />
        )}
      </main>
    </div>
  );
};
