import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import Login from "../components/Signin-modal/Login";
import { getDataFromFireStore } from "../services/Firebase/Firebase";
import { useItemContext } from "../context/Sellitems";
import { SellModal } from "../components/SellModal/SellModal";
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
    <div>
      <Navbar toggleModal={toggleModal} toggleSellModal={toggleSellModal} />
      <Login toggleModal={toggleModal} status={isModelOpen} />
      {/* <SellModal toggleSellModal={toggleSellModal} status={isSellModalOpen} /> */}
      <Card items={itemCtx.items || []} />
    </div>
  );
};
