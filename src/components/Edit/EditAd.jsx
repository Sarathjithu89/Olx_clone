import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { fireStore } from "../../services/Firebase";
import Swal from "sweetalert2";
import { FiUploadCloud } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { Navbar } from "../Navbar/Navbar";

const CATEGORIES = [
  {
    id: "cars",
    name: "Cars",
    fields: ["brand", "model", "year", "km", "fuel"],
  },
  {
    id: "motorcycles",
    name: "Motorcycles",
    fields: ["brand", "model", "year", "km"],
  },
  {
    id: "mobiles",
    name: "Mobile Phones",
    fields: ["brand", "model", "condition"],
  },
  {
    id: "properties",
    name: "Properties",
    fields: ["type", "bedrooms", "furnishing", "area"],
  },
  {
    id: "jobs",
    name: "Jobs",
    fields: ["jobType", "experience", "salary"],
  },
  {
    id: "furniture",
    name: "Furniture",
    fields: ["type", "condition"],
  },
  {
    id: "fashion",
    name: "Fashion",
    fields: ["type", "brand", "condition"],
  },
  {
    id: "books",
    name: "Books",
    fields: ["title", "author", "condition"],
  },
];

const FIELD_LABELS = {
  brand: "Brand",
  model: "Model",
  year: "Year",
  km: "KM Driven",
  fuel: "Fuel Type",
  condition: "Condition",
  type: "Type",
  bedrooms: "Bedrooms",
  furnishing: "Furnishing",
  area: "Area (sq ft)",
  jobType: "Job Type",
  experience: "Experience Required",
  salary: "Salary",
  title: "Book Title",
  author: "Author",
};

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
    categoryId: "",
    price: "",
    location: "",
    categoryFields: {},
    imageUrl: "",
  });

  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    if (ad) {
      setForm({
        title: ad.title || "",
        description: ad.description || "",
        category: ad.category || "",
        categoryId: ad.categoryId || "",
        price: ad.price || "",
        location: ad.location || "",
        categoryFields: ad.categoryFields || {},
        imageUrl: ad.imageUrl || "",
      });

      if (ad.categoryId) {
        const cat = CATEGORIES.find((c) => c.id === ad.categoryId);
        setCurrentCategory(cat);
      }
    }
  }, [ad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      categoryFields: {
        ...prev.categoryFields,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adRef = doc(fireStore, "Products", ad.id);
      await updateDoc(adRef, {
        title: form.title,
        description: form.description,
        category: form.category,
        categoryId: form.categoryId,
        price: form.price,
        location: form.location,
        categoryFields: form.categoryFields,
        imageUrl: form.imageUrl,
      });
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

      <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 px-3 sm:px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <FaArrowLeft
                onClick={() => navigate(-1)}
                className="text-black text-lg sm:text-xl cursor-pointer mr-3 sm:mr-4"
              />
              <h2 className="text-xl sm:text-2xl font-bold">Edit Your Ad</h2>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Basic Info */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Ad Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>

              {/* Category-Specific Fields */}
              {currentCategory &&
                currentCategory.fields.map((field) => (
                  <div key={field}>
                    <label className="block text-xs sm:text-sm font-semibold mb-2">
                      {FIELD_LABELS[field]} *
                    </label>
                    <input
                      type={
                        ["year", "km", "salary"].includes(field)
                          ? "number"
                          : "text"
                      }
                      value={form.categoryFields[field] || ""}
                      onChange={(e) =>
                        handleCategoryFieldChange(field, e.target.value)
                      }
                      placeholder={`Enter ${FIELD_LABELS[field].toLowerCase()}`}
                      className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                    />
                  </div>
                ))}

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="₹ 0"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Include condition, features and reason for selling"
                  rows={5}
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Photo
                </label>
                <div className="relative h-40 sm:h-60 w-full border-2 border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="Ad"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FiUploadCloud className="mx-auto text-4xl text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No image</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Edit image</p>
              </div>

              <button
                type="submit"
                className="w-full p-2.5 sm:p-3 rounded-lg text-white text-sm sm:text-base font-semibold"
                style={{ backgroundColor: "#002f34" }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAd;
