import React, { createContext, useContext, useEffect, useState } from "react";
import { userAuth } from "./Auth/Auth";
import {
  addDoc,
  collection,
  deleteDoc,
  onSnapshot,
  query,
  where,
  doc,
} from "firebase/firestore";
import { fireStore } from "../services/Firebase";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = userAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(fireStore, "favorites"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const favs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user?.uid]);

  //check if item is favorite
  const isFavorite = (productId) => {
    return favorites.some((fav) => fav.productId === productId);
  };
  //add to favorites
  const addToFavorites = async (productId) => {
    if (!user?.uid) {
      throw new Error("Please login to add favorites");
    }
    if (isFavorite(productId)) {
      return;
    }
    try {
      await addDoc(collection(fireStore, "favorites"), {
        userId: user.uid,
        productId: productId,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding to Favorites:", error);
    }
  };

  //remove from favorites
  const removeFormFavorites = async (productId) => {
    if (!user?.uid) return;

    try {
      const favorite = favorites.find((fav) => fav.productId === productId);
      if (favorite) {
        await deleteDoc(doc(fireStore, "favorites", favorite.id));
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  };

  //toggle favorites
  const toggleFavorites = async (productId) => {
    if (isFavorite(productId)) {
      await removeFormFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  //get favorite products
  const getFavoriteProducts = (allProducts) => {
    return allProducts.filter((product) => isFavorite(product.id));
  };

  const value = {
    favorites,
    loading,
    isFavorite,
    addToFavorites,
    removeFormFavorites,
    toggleFavorites,
    getFavoriteProducts,
  };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
