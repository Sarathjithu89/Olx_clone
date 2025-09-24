import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useItemContext } from "../../context/Sellitems";
import { Navbar } from "../Navbar/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import Login from "../Signin-modal/Login";

const Details = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};

  const [openModal, setModal] = useState(false);
  const toggleModal = () => setModal(!openModal);

  return (
    <div>
      <Navbar toggleModal={toggleModal} />
      <Login toggleModal={toggleModal} status={openModal} />

      <div className="p-4 sm:p-6 md:px-12 lg:px-32">
        <div className="mb-6">
          <FaArrowLeft
            onClick={() => navigate(-1)}
            className="text-black text-xl cursor-pointer"
          />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="border-2 rounded-lg flex justify-center items-center overflow-hidden h-96">
            <img
              className="object-cover w-full h-full"
              src={item?.imageUrl}
              alt={item?.title}
            />
          </div>

          <div className="flex flex-col justify-between w-full">
            <div>
              <p className="text-2xl font-bold">₹ {item?.price}</p>
              <p className="text-base">{item?.category}</p>
              <p className="text-xl font-bold mt-2">{item?.title}</p>
              <p className="mt-2 text-sm break-words">{item?.description}</p>
            </div>

            <div className="flex justify-between items-end mt-6 text-sm">
              <p className="font-bold">Seller: {item?.userName}</p>
              <p>{item?.createdAt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
