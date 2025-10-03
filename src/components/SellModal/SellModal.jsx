import { useState } from "react";
import { userAuth } from "../../context/Auth/Auth";
import { addDoc, collection } from "firebase/firestore";
import {
  getDataFromFireStore,
  fireStore,
} from "../../services/Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaFileUpload,
  FaCar,
  FaMotorcycle,
  FaMobileAlt,
  FaHome,
  FaBriefcase,
  FaCouch,
  FaTshirt,
  FaBook,
} from "react-icons/fa";
import { useItemContext } from "../../context/Sellitems";
import loading from "../../assets/loading.gif";

const CATEGORIES = [
  {
    id: "cars",
    name: "Cars",
    icon: FaCar,
    fields: ["brand", "model", "year", "km", "fuel"],
  },
  {
    id: "motorcycles",
    name: "Motorcycles",
    icon: FaMotorcycle,
    fields: ["brand", "model", "year", "km"],
  },
  {
    id: "mobiles",
    name: "Mobile Phones",
    icon: FaMobileAlt,
    fields: ["brand", "model", "condition"],
  },
  {
    id: "properties",
    name: "Properties",
    icon: FaHome,
    fields: ["type", "bedrooms", "furnishing", "area"],
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: FaBriefcase,
    fields: ["jobType", "experience", "salary"],
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: FaCouch,
    fields: ["type", "condition"],
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: FaTshirt,
    fields: ["type", "brand", "condition"],
  },
  {
    id: "books",
    name: "Books",
    icon: FaBook,
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

export const SellModal = () => {
  const navigate = useNavigate();
  const auth = userAuth();
  const itemCtx = useItemContext();
  const setItems = itemCtx?.setItems;

  // Step state
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [categoryFields, setCategoryFields] = useState({});
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // --- Validation ---
  const validateStep2 = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";

    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(price) || Number(price) <= 0)
      newErrors.price = "Enter a valid positive number";

    const category = CATEGORIES.find((c) => c.id === selectedCategory);
    if (category) {
      category.fields.forEach((field) => {
        if (!categoryFields[field] || !categoryFields[field].trim()) {
          newErrors[field] = `${FIELD_LABELS[field]} is required`;
        }
        // Numeric validation
        if (
          ["year", "km", "salary", "price"].includes(field) &&
          categoryFields[field]
        ) {
          if (isNaN(categoryFields[field]))
            newErrors[field] = `${FIELD_LABELS[field]} must be a number`;
        }
      });
    }
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = "Description is required";
    else if (description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (!image) newErrors.images = "Please upload image";
    if (!location.trim()) newErrors.location = "Location is required";
    return newErrors;
  };

  // --- Image handling ---
  const handleImageUpload = (e) => {
    if (e.target.files) setImage(e.target.files[0]);
  };
  const removeImage = () => setImage(null);

  // --- Navigation ---
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setStep(2);
  };
  const handleNext = () => {
    if (step === 2) {
      const validationErrors = validateStep2();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
      setStep(3);
    }
  };
  const handleBack = () => {
    step > 1 ? setStep(step - 1) : navigate(-1);
    setErrors({});
  };

  // --- Resize image to base64 to prevent large sizes ---
  const resizeImage = (file, maxWidth = 800) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      const img = new Image();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      reader.readAsDataURL(file);
    });

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.user) {
      setErrors({ auth: "Login is required to post an ad." });
      return;
    }

    const validationErrors = validateStep3();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = "";
      if (image) imageUrl = await resizeImage(image);

      const category = CATEGORIES.find((c) => c.id === selectedCategory);

      await addDoc(collection(fireStore, "Products"), {
        title,
        category: category.name,
        categoryId: selectedCategory,
        price,
        description,
        location,
        categoryFields,
        imageUrl,
        userId: auth.user.uid,
        userName: auth.user.displayName || "Anonymous",
        createAt: new Date(),
      });

      // Reset
      setImage(null);
      setTitle("");
      setPrice("");
      setDescription("");
      setLocation("");
      setCategoryFields({});
      setSelectedCategory(null);
      setStep(1);
      setErrors({});

      const datas = await getDataFromFireStore();
      setItems(datas);
      navigate("/");
    } catch (err) {
      setErrors({ submit: "Failed to add item. Try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render Steps ---
  const renderCategorySelection = () => {
    const groupedCategories = [
      {
        title: "Vehicles",
        items: CATEGORIES.filter((cat) =>
          ["cars", "motorcycles"].includes(cat.id)
        ),
      },
      {
        title: "Electronics",
        items: CATEGORIES.filter((cat) => ["mobiles"].includes(cat.id)),
      },
      {
        title: "Property",
        items: CATEGORIES.filter((cat) => ["properties"].includes(cat.id)),
      },
      {
        title: "Home & Living",
        items: CATEGORIES.filter((cat) => ["furniture"].includes(cat.id)),
      },
      {
        title: "Services & Jobs",
        items: CATEGORIES.filter((cat) => ["jobs"].includes(cat.id)),
      },
      {
        title: "Fashion & Lifestyle",
        items: CATEGORIES.filter((cat) =>
          ["fashion", "books"].includes(cat.id)
        ),
      },
    ];

    return (
      <div className="max-w-5xl mx-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-6">
          POST YOUR AD
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Choose a category
        </p>

        <div className="space-y-3 sm:space-y-6">
          {groupedCategories.map((group, idx) => (
            <div key={idx} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b">
                <h4 className="font-semibold text-sm sm:text-base text-gray-800">
                  {group.title}
                </h4>
              </div>
              <div className="divide-y">
                {group.items.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="flex items-center px-3 sm:px-4 py-3 sm:py-4 cursor-pointer hover:bg-teal-50 transition-colors group"
                    >
                      <div className="flex items-center flex-1">
                        <Icon className="text-xl sm:text-2xl text-gray-600 group-hover:text-teal-600 mr-3 sm:mr-4 flex-shrink-0" />
                        <span className="font-medium text-sm sm:text-base text-gray-800 group-hover:text-teal-600">
                          {category.name}
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-teal-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDetailsForm = () => {
    const category = CATEGORIES.find((c) => c.id === selectedCategory);
    if (!category) return null;

    return (
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Include some details
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2">
              Ad Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title"
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {category.fields.map((field) => (
            <div key={field}>
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                {FIELD_LABELS[field]} *
              </label>
              <input
                type={
                  ["year", "km", "salary"].includes(field) ? "number" : "text"
                }
                value={categoryFields[field] || ""}
                onChange={(e) =>
                  setCategoryFields({
                    ...categoryFields,
                    [field]: e.target.value,
                  })
                }
                placeholder={`Enter ${FIELD_LABELS[field].toLowerCase()}`}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
              />
              {errors[field] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2">
              Set a price *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₹ 0"
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
            />
            {errors.price && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.price}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-4 sm:mt-6 p-2.5 sm:p-3 rounded-lg text-white text-sm sm:text-base font-semibold"
          style={{ backgroundColor: "#002f34" }}
        >
          Next
        </button>
      </div>
    );
  };

  const renderPhotosAndDescription = () => (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
        Upload photos and add description
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">
            Upload photo*
          </label>
          {image ? (
            <div className="relative h-40 sm:h-60 w-full flex justify-center border-2 border-black rounded-md overflow-hidden">
              <img
                className="object-contain"
                src={URL.createObjectURL(image)}
                alt="preview"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="relative h-40 sm:h-60 w-full border-2 border-black rounded-md">
              <input
                onChange={handleImageUpload}
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <FaFileUpload className="w-12 text-gray-600" />
                <p className="text-sm pt-2">Click to upload images</p>
                <p className="text-sm pt-1 text-gray-600">SVG, PNG, JPG</p>
              </div>
            </div>
          )}
          {errors.images && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.images}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">
            Describe what you're selling *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Include condition, features and reason for selling"
            rows={5}
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500 resize-none"
          />
          {errors.description && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">
            Location *
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
          />
          {errors.location && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.location}
            </p>
          )}
        </div>

        {errors.auth && (
          <p className="text-red-500 text-xs sm:text-sm text-center">
            {errors.auth}
          </p>
        )}
        {errors.submit && (
          <p className="text-red-500 text-xs sm:text-sm text-center">
            {errors.submit}
          </p>
        )}

        {submitting ? (
          <div className="w-full flex justify-center py-4">
            <img
              className="w-24 sm:w-32 object-cover"
              src={loading}
              alt="loading"
            />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full p-2.5 sm:p-3 rounded-lg text-white text-sm sm:text-base font-semibold"
            style={{ backgroundColor: "#002f34" }}
          >
            Post Now
          </button>
        )}
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 pb-12 px-3 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <FaArrowLeft
              onClick={handleBack}
              className="text-black text-lg sm:text-xl cursor-pointer mr-3 sm:mr-4 flex-shrink-0"
            />
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
              {[1, 2, 3].map((n) => (
                <>
                  <div
                    key={n}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-base flex-shrink-0 ${
                      step >= n ? "bg-teal-500 text-white" : "bg-gray-300"
                    }`}
                  >
                    {n}
                  </div>
                  {n !== 3 && (
                    <div
                      className={`h-0.5 sm:h-1 w-8 sm:w-12 flex-shrink-0 ${
                        step > n ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
          {step === 1 && renderCategorySelection()}
          {step === 2 && renderDetailsForm()}
          {step === 3 && renderPhotosAndDescription()}
        </div>
      </div>
    </div>
  );
};
