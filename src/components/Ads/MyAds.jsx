import React, { useEffect, useState, useRef } from "react";
import { userAuth } from "../../context/Auth/Auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { fireStore } from "../../services/Firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Navbar } from "../Navbar/Navbar";
import { FaArrowLeft, FaEye, FaHeart, FaEllipsisV } from "react-icons/fa";
import { useItemContext } from "../../context/Sellitems";

const MyAds = () => {
  const { user } = userAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const itemCtx = useItemContext();

  useEffect(() => {
    const fetchUserAds = async () => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const q = query(
          collection(fireStore, "Products"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const userAds = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(userAds);
      } catch (error) {
        console.error("Error fetching user ads:", error);
        Swal.fire("Error", "Failed to load your ads.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) fetchUserAds();
  }, [user?.uid]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeDropdown]);

  const handleMarkAsSold = async (adId, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? "sold" : "active";

    try {
      //update db
      await updateDoc(doc(fireStore, "Products", adId), {
        isSold: newStatus,
      });
      //update local state
      setAds((prev) =>
        prev.map((ad) => (ad.id === adId ? { ...ad, isSold: newStatus } : ad))
      );
      //update global context
      if (itemCtx?.setItems) {
        itemCtx.setItems((prev) =>
          prev.map((item) =>
            item.id === adId ? { ...item, isSold: newStatus } : item
          )
        );
      }

      Swal.fire({
        icon: "success",
        title: `Marked as ${actionText}!`,
        text: `Your ad has been marked as ${actionText}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating ad status:", error);
      Swal.fire("Error", "Failed to update ad status.", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This ad will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(fireStore, "Products", id));
        setAds((prev) => prev.filter((ad) => ad.id !== id));
        if (itemCtx?.setItems) {
          itemCtx.setItems((prev) => prev.filter((item) => item.id !== id));
        }

        Swal.fire("Deleted!", "Your ad has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting ad:", error);
        Swal.fire("Error", "Failed to delete ad.", "error");
      }
    }
    setActiveDropdown(null);
  };

  const handleEdit = (ad) => {
    navigate("/edit", { state: { ad } });
    setActiveDropdown(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Not set";

    // Handle Firestore Timestamp
    let date;
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      })
      .toUpperCase();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Loading your ads...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#002f34]">
            My Ads
          </h1>
        </div>

        {ads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No ads yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't posted any ads yet. Start selling today!
            </p>
            <button
              onClick={() => navigate("/sell")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Post Your First Ad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      item.imageUrl ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={item.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${
                        item.isSold ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {item.isSold ? "SOLD" : "ACTIVE"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  {/* Title and Price */}
                  <h2 className="text-lg font-bold text-[#002f34] mb-1 truncate">
                    {item.title}
                  </h2>
                  <p className="text-2xl font-bold text-blue-600 mb-3">
                    ₹ {item.price?.toLocaleString()}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b">
                    <span className="flex items-center gap-1">
                      <FaEye className="text-gray-500" />
                      <span className="font-medium">{item.views || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart className="text-red-500" />
                      <span className="font-medium">{item.likes || 0}</span>
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-600 mb-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold">Posted:</span>
                      <span>{formatDate(item.createAt || item.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Expires:</span>
                      <span>{formatDate(item.expiryDate)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      className={`w-full text-xs py-2 rounded-lg border font-semibold transition-colors ${
                        item.isSold
                          ? "border-green-600 text-green-600 hover:bg-green-50"
                          : "border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={() => handleMarkAsSold(item.id, item.isSold)}
                    >
                      {item.isSold ? "Mark as Active" : "Mark as Sold"}
                    </button>
                    <button className="w-full text-xs py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-semibold">
                      Sell faster now
                    </button>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div className="px-4 pb-4">
                  <div
                    className="relative"
                    ref={activeDropdown === index ? dropdownRef : null}
                  >
                    <button
                      className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === index ? null : index
                        )
                      }
                      aria-label="More options"
                      aria-expanded={activeDropdown === index}
                    >
                      <FaEllipsisV />
                      <span className="text-sm font-medium">More Options</span>
                    </button>
                    {activeDropdown === index && (
                      <div
                        className="absolute bottom-full left-0 right-0 mb-2 bg-white shadow-lg border rounded-lg overflow-hidden z-50"
                        role="menu"
                      >
                        <button
                          onClick={() => handleEdit(item)}
                          className="block px-4 py-3 w-full text-left hover:bg-gray-50 text-sm font-medium transition-colors"
                          role="menuitem"
                        >
                          Edit Ad
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="block px-4 py-3 w-full text-left hover:bg-red-50 text-red-600 text-sm font-medium transition-colors border-t"
                          role="menuitem"
                        >
                          Delete Ad
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAds;
