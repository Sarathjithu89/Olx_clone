import { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import olx_logo_2025 from "../../assets/olx_logo_2025.svg";
import search_home from "../../assets/search.svg";
import arrow_home from "../../assets/arrow.svg";
import heart from "../../assets/heart_home.svg";
import sellbtn from "../../assets/sellbtn.png";
import { FiHeart } from "react-icons/fi";
//firebase
import { auth, logout } from "../../services/Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const itemArray = ['"Cars"', '"Properties"', '"Mobiles"', '"Bikes"', '"Jobs"'];

export const Navbar = ({ toggleModal, toggleSellModal }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchItem, setSearchItem] = useState(itemArray[0]);
  let count = 0;
  useEffect(() => {
    setInterval(() => {
      setSearchItem(itemArray[count % itemArray.length]);
      count++;
    }, 1500);
  }, []);

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  const handleMyAds = () => {
    navigate("/ads");
  };

  return (
    <div>
      <nav className="fixed z-[9999] top-0 left-0 right-0 bg-slate-100 p-2 pl-3 pr-3 shadow-md border-b-4 border-white">
        <div className="flex items-center gap-4 flex-wrap w-full">
          <img src={olx_logo_2025} alt="Logo" className="w-12" />

          <div className="relative location-search ml-2">
            <img
              src={search_home}
              alt=""
              className="absolute top-4 left-2 w-5"
            />
            <input
              type="text"
              placeholder="Search city ,area,country...."
              className="w-[50px] sm:w-[150px] md:w-[250px] lg:w-[270px] p-3 pl-8 pr-8 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300"
            />
            <img
              src={arrow_home}
              alt=""
              className="absolute top-4 right-3 w-3 cursor-pointer"
            />
          </div>

          <div className="relative flex-grow main-search ml-2 mr-2">
            <input
              placeholder={`find ${searchItem}`}
              className="w-full p-3 border-black border-solid border-2 rounded-md placeholder:text-ellipsis focus:outline-none focus:border-teal-300"
              type="text"
            />
            <div
              style={{ backgroundColor: "#002f34" }}
              className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-12"
            >
              <img
                className="w-5 filter invert"
                src={arrow_home}
                alt="Search Icon"
              />
            </div>
          </div>

          <div className="mx-1 sm:ml-5 sm:mr-5 relative lang flex items-center">
            <p className="font-bold mr-1">English</p>
            <img src={arrow_home} alt="" className="w-5 cursor-pointer" />
          </div>

          <div className="flex gap-4 text-2xl text-black ml-2">
            <FiHeart onClick={user ? () => navigate("/") : toggleModal} />
          </div>

          {!user ? (
            <p
              onClick={user ? () => navigate("/") : toggleModal}
              className="font-bold underline ml-5 cursor-pointer"
              style={{ color: "#002f34" }}
            >
              Login
            </p>
          ) : (
            <div className="relative z-[9999]" ref={dropdownRef}>
              <p
                style={{ color: "#002f34" }}
                className="font-bold ml-5 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.displayName?.split(" ")[0]}
              </p>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-[9999]">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleMyAds}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Ads
                  </button>
                </div>
              )}
            </div>
          )}

          <img
            src={sellbtn}
            onClick={user ? () => navigate("/sell") : toggleModal}
            className="w-24 mx-1 sm:ml-5 sm:mr-5 shadow-xl rounded-full cursor-pointer"
            alt=""
          />
        </div>
      </nav>

      <div className="w-full relative z-10 flex shadow-md p-2 pt-20 pl-10 pr-10 sm:pl-44 md:pr-44 sub-lists bg-white">
        <ul className="list-none flex items-center justify-between w-full overflow-x-auto text-xs">
          <div className="flex flex-shrink-0">
            <p className="font-semibold uppercase all-cats text-sm">
              All categories
            </p>
            <img className="w-4 ml-2" src={arrow_home} alt="" />
          </div>
          <li>Cars</li>
          <li>Motorcycles</li>
          <li>Mobile Phones</li>
          <li>For sale : Houses & Apartments</li>
          <li>Scooter</li>
          <li>Commercial & Other Vehicles</li>
          <li>For rent : Houses & Apartments</li>
        </ul>
      </div>
    </div>
  );
};
