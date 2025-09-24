import { useState } from "react";
import { Homepage } from "./pages/Homepage";
import { Routes, Route, Link } from "react-router-dom";
import { ThemeInit } from "../.flowbite-react/init";
import { UserRoute } from "./Routes/UserRoute";
import { SellModal } from "./components/SellModal/SellModal";
import MyAds from "./components/Ads/MyAds";
import EditAd from "./components/Edit/EditAd";
import Details from "./components/Details/Details";

function App() {
  return (
    <>
      <ThemeInit />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/details" element={<Details />} />

        <Route
          path="/sell"
          element={
            <UserRoute>
              <SellModal />
            </UserRoute>
          }
        />
        <Route
          path="/ads"
          element={
            <UserRoute>
              <MyAds />
            </UserRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <UserRoute>
              <EditAd />
            </UserRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
