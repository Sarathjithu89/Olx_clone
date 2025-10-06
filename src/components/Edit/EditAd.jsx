import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { fireStore } from "../../services/Firebase";
import Swal from "sweetalert2";
import { FiUploadCloud } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { Navbar } from "../Navbar/Navbar";

const EditAd = () => {
  const [openModal, setModal] = useState(false);
  const toggleModal = () => setModal(!openModal);
  const { state } = useLocation();
  const navigate = useNavigate();
  const ad = state?.ad;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (ad) {
      setForm({
        title: ad.title || "",
        description: ad.description || "",
        category: ad.category || "",
        price: ad.price || "",
        imageUrl: ad.imageUrl || "",
      });
    }
  }, [ad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adRef = doc(fireStore, "Products", ad.id);
      await updateDoc(adRef, form);
      await Swal.fire("Success", "Ad updated successfully!", "success");
      navigate("/ads");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update ad.", "error");
    }
  };

  if (!ad) {
    return <div className="p-4 text-center">No ad data to edit.</div>;
  }

  return (
    <>
      <Navbar toggleModal={toggleModal} />

      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-6">
          <FaArrowLeft
            onClick={() => navigate(-1)}
            className="text-black text-xl cursor-pointer"
          />
          <h2 className="text-2xl font-bold text-center flex-grow">
            Edit your Ad
          </h2>
          <div className="w-6" />
        </div>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl space-y-4 text-[#002f34]"
          >
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border-2 border-black rounded-md p-3 outline-none"
              required
            />
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full border-2 border-black rounded-md p-3 outline-none"
              required
            />
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border-2 border-black rounded-md p-3 outline-none"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={3}
              className="w-full border-2 border-black rounded-md p-3 outline-none resize-none"
            />

            <div className="border-2 border-black rounded-md h-48 flex flex-col items-center justify-center text-center cursor-pointer">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Ad"
                  className="h-full object-contain"
                />
              ) : (
                <>
                  <FiUploadCloud size={30} />
                  <p className="mt-2 text-sm">Click to upload images</p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#002f34] hover:bg-[#014449] text-white py-3 rounded-md text-lg font-semibold"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditAd;
