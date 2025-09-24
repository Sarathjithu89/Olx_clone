import React from "react";
import { auth } from "../services/Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";

export const UserRoute = ({ children }) => {
  const [user] = useAuthState(auth);
  return user ? children : <Navigate to="/" />;
};
