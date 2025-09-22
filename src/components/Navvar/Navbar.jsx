import React, { useEffect, useState } from "react";
import "./Navbar.css";
import olx_logo_2025 from "../../assets/olx_logo_2025.svg";
import search_home from "../../assets/search.svg";
import arrow_home from "../../assets/arrow.svg";

const itemArray = ['"Cars"', '"Properties"', '"Mobiles"', '"Bikes"', '"Jobs"'];

export const Navbar = () => {
  const [searchItem, setSearchItem] = useState(itemArray[0]);
  let count = 0;
  useEffect(() => {
    setInterval(() => {
      setSearchItem(itemArray[count % itemArray.length]);
      count++;
    }, 1500);
  }, []);

  return (
    <div>
      <nav>
        <img src={olx_logo_2025} alt="olx_logo_2025" className="w-12" />
        <div>
          <img src={search_home} alt="" className="absolute top-4 left-2 w-5" />
          <input
            type="text"
            name=""
            id=""
            placeholder={`search ${searchItem}`}
          />
          <img
            src={arrow_home}
            alt="arrow"
            className="absolute top-4 right-3 w-5 cursor-pointer"
          />
        </div>
      </nav>
    </div>
  );
};
