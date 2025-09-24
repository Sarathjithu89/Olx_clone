import React, { useEffect, useState } from "react";
import { userAuth } from "../../context/Auth/Auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { fireStore } from "../../services/Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Navbar } from "../Navbar/Navbar";
import { FaArrowLeft, FaEye, FaHeart, FaEllipsisV } from "react-icons/fa";

const MyAds = () => {
  const { user } = userAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openModal, setModal] = useState(false);

  const toggleModal = () => setModal(!openModal);

  useEffect(() => {
    if (user) fetchUserAds();
  }, [user]);

  const fetchUserAds = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This ad will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(fireStore, "Products", id));
        setAds((prev) => prev.filter((ad) => ad.id !== id));
        Swal.fire("Deleted!", "Your ad has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting ad:", error);
        Swal.fire("Error", "Failed to delete ad.", "error");
      }
    }
  };

  const handleEdit = (ad) => {
    navigate("/edit", { state: { ad } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-lg font-semibold">Loading your ads...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar toggleModal={toggleModal} />
      <div className="p-4 sm:p-10 min-h-screen bg-white">
        <div className="mb-6">
          <FaArrowLeft
            onClick={() => navigate(-1)}
            className="text-black text-xl cursor-pointer"
          />
        </div>
        <h1 className="text-2xl font-bold text-[#002f34] mb-4">My Ads</h1>

        {ads.length === 0 ? (
          <p className="text-gray-600">You haven't posted any ads yet.</p>
        ) : (
          <div className="space-y-4">
            {ads.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col lg:flex-row justify-between lg:items-center border border-gray-200 rounded-md bg-gray-50 shadow-sm p-4 gap-4"
              >
                <div className="text-sm text-gray-600 lg:w-[100px]">
                  <p>FROM: {item.startDate || "JUL 9, 25"}</p>
                  <p>TO: {item.endDate || "AUG 8, 25"}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-grow">
                  <img
                    className="h-20 w-20 object-contain rounded"
                    src={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.title}
                  />
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-[#002f34]">
                      {item.title}
                    </h2>
                    <p className="text-md font-semibold">₹ {item.price}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaEye /> Views: {item.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart /> Likes: {item.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-2 relative">
                  <button className="bg-blue-600 text-white text-xs px-4 py-1 rounded">
                    ACTIVE
                  </button>
                  <p className="text-xs text-gray-600 border p-2 bg-gray-100 rounded max-w-[200px]">
                    This ad is currently live
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button className="text-xs px-3 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50">
                      Mark as sold
                    </button>
                    <button className="text-xs px-3 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50">
                      Sell faster now
                    </button>
                  </div>

                  <div className="relative mt-1">
                    <button
                      className="text-gray-700"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === index ? null : index
                        )
                      }
                    >
                      <FaEllipsisV />
                    </button>
                    {activeDropdown === index && (
                      <div className="absolute right-0 mt-2 bg-white shadow-md border rounded-md text-sm z-50 w-32">
                        <button
                          onClick={() => handleEdit(item)}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
                        >
                          Remove
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
