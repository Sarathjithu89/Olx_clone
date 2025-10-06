import { collection, getDocs } from "firebase/firestore";
import { createContext, useState, useEffect, useContext } from "react";
import { fireStore } from "../services/Firebase";

//Create context
const ItemContext = createContext(null);

//Custom hook to access context
export const useItemContext = () => {
  return useContext(ItemContext);
};

//Provider component
export const ItemContextProvider = ({ children }) => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const fetchItemsFromFireStore = async () => {
      try {
        const productsCollection = collection(fireStore, "Products");
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(productsList);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };
    fetchItemsFromFireStore();
  }, []);

  return (
    <ItemContext.Provider value={{ items, setItems }}>
      {children}
    </ItemContext.Provider>
  );
};
