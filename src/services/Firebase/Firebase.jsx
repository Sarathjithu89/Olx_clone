import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const fireStore = getFirestore(app);

//logout
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
//fetch data from fireStore;
const getDataFromFireStore = async () => {
  try {
    const products = collection(fireStore, "Products");
    const productSnapshot = await getDocs(products);
    const productsList = productSnapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    return productsList;
  } catch (error) {
    console.error("Erron fetching data from Firestore", error);
    return [];
  }
};

export { auth, logout, provider, storage, fireStore, getDataFromFireStore };
