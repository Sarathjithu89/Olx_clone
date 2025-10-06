import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import Login from "../components/Signin-modal/Login";
import { getDataFromFireStore } from "../services/Firebase";
import { useItemContext } from "../context/Sellitems";
import Card from "../components/Cards/Card";

export const Homepage = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const itemCtx = useItemContext();
  const toggleModal = () => setIsModelOpen((prev) => !prev);
  const toggleSellModal = () => setIsSellModalOpen((prev) => !prev);

  useEffect(() => {
    const getItems = async () => {
      const data = await getDataFromFireStore();
      itemCtx?.setItems(data);
    };
    getItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar toggleModal={toggleModal} toggleSellModal={toggleSellModal} />
      {/* Login */}
      <Login toggleModal={toggleModal} status={isModelOpen} />
      {/* Main Content Container */}
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 ">
        <Card items={itemCtx.items || []} />
      </main>
    </div>
  );
};
