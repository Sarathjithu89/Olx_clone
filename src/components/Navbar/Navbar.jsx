import { useEffect, useState, useRef } from "react";
import olx_logo_2025 from "../../assets/olx_logo_2025.svg";
import search_home from "../../assets/search.svg";
import arrow_home from "../../assets/arrow.svg";
import sellbtn from "../../assets/sellbtn.png";
import { FiHeart, FiMenu, FiX } from "react-icons/fi";
import { auth, logout } from "../../services/Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const itemArray = ['"Cars"', '"Properties"', '"Mobiles"', '"Bikes"', '"Jobs"'];

export const Navbar = ({ toggleModal }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchItem, setSearchItem] = useState(itemArray[0]);
  const dropdownRef = useRef(null);

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Rotate search placeholder
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSearchItem(itemArray[count % itemArray.length]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate("/");
  };

  const handleMyAds = () => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate("/ads");
  };

  const UserMenu = () => (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <p
        style={{ color: "#002f34" }}
        className="font-bold cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.displayName?.split(" ")[0]}
      </p>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-[9999]">
          <button
            onClick={handleMyAds}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
          >
            My Ads
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  const AuthButton = () => (
    <p
      onClick={toggleModal}
      className="font-bold underline cursor-pointer flex-shrink-0"
      style={{ color: "#002f34" }}
    >
      Login
    </p>
  );
  const renderLocationSearh = () => (
    <div className="relative flex-shrink-0">
      <img src={search_home} alt="" className="absolute top-4 left-2 w-5" />
      <input
        type="text"
        placeholder="Search city, area, country...."
        className="w-[270px] p-2.5 pl-8 pr-10 border-black border-2 rounded-md placeholder:text-sm focus:outline-none focus:border-teal-500"
      />
      <img
        src={arrow_home}
        alt=""
        className="absolute top-4 right-3 w-3 cursor-pointer"
      />
    </div>
  );

  const renderSearchInput = (placeholder, extraClasses = "") => (
    <div className={`relative ${extraClasses}`}>
      <input
        placeholder={placeholder}
        className="w-full p-2.5 pr-10 border-black border-2 rounded-md text-sm focus:outline-none focus:border-teal-500"
        type="text"
      />
      <div
        style={{ backgroundColor: "#002f34" }}
        className="flex justify-center items-center absolute top-0 right-0 h-full rounded-e-md w-10 cursor-pointer"
      >
        <img className="w-4 filter invert" src={search_home} alt="Search" />
      </div>
    </div>
  );

  const DesktopAndTabletMenu = () => (
    <div className="hidden md:flex items-center gap-3 px-4 py-3 justify-around">
      <img src={olx_logo_2025} alt="Logo" className="w-12 flex-shrink-0" />

      {/* Location search */}
      {renderLocationSearh()}

      {/* Item search input */}
      {renderSearchInput(`find ${searchItem}`, "flex-grow max-w-2xl")}

      <div className="flex items-center gap-1 cursor-pointer flex-shrink-0">
        <p className="font-bold text-sm">English</p>
        <img src={arrow_home} alt="" className="w-3" />
      </div>

      <FiHeart
        onClick={user ? () => navigate("/") : toggleModal}
        className="text-2xl cursor-pointer flex-shrink-0"
      />

      {!user ? <AuthButton /> : <UserMenu />}

      <img
        src={sellbtn}
        onClick={user ? () => navigate("/sell") : toggleModal}
        className="w-24 cursor-pointer flex-shrink-0"
        alt="Sell"
      />
    </div>
  );

  const MobileMenuDropdown = () => (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-[9998]">
      <div className="p-4 space-y-3">
        {renderSearchInput(`find ${searchItem}`)}
        {user ? (
          <div className="border-t pt-3 space-y-2">
            <button
              onClick={handleMyAds}
              className="w-full text-left py-2 text-sm font-semibold"
              style={{ color: "#002f34" }}
            >
              My Ads
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 text-sm font-semibold"
              style={{ color: "#002f34" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="border-t pt-3">
            <button
              onClick={() => {
                toggleModal();
                setShowMobileMenu(false);
              }}
              className="w-full py-2 text-sm font-semibold text-left"
              style={{ color: "#002f34" }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const MobileMenu = () => (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-2xl"
          >
            {showMobileMenu ? <FiX /> : <FiMenu />}
          </button>
          <img src={olx_logo_2025} alt="Logo" className="w-10" />
        </div>
        <div className="flex items-center gap-4">
          <FiHeart
            onClick={user ? () => navigate("/") : toggleModal}
            className="text-xl cursor-pointer"
          />
          <img
            src={sellbtn}
            onClick={user ? () => navigate("/sell") : toggleModal}
            className="w-16 cursor-pointer"
            alt="Sell"
          />
        </div>
      </div>
      {showMobileMenu && <MobileMenuDropdown />}
    </div>
  );

  return (
    <>
      <nav className="fixed z-[9999] top-0 left-0 right-0 bg-slate-100 shadow-md border-b-4 border-white">
        <DesktopAndTabletMenu />
        <MobileMenu />
      </nav>

      {/* Sub Categories - Desktop */}
      <div className="flex items-center justify-center">
        <div className="hidden md:block fixed top-[72px] lg:top-[76px] z-[9998] shadow-md w-11/12 bg-white">
          <div className="overflow-x-hidden">
            <ul className="flex items-center gap-6 px-4 py-3 text-sm whitespace-nowrap justify-center">
              <li className="flex items-center gap-1 font-semibold cursor-pointer flex-shrink-0 min-w-1 mx-1">
                <span>ALL CATEGORIES</span>
                <img className="w-3" src={arrow_home} alt="" />
              </li>
              <li className="cursor-pointer hover:text-teal-600 min-w-1 mx-1 overflow-x-hidden">
                Cars
              </li>
              <li className="cursor-pointer hover:text-teal-600 min-w-2 mx-2 overflow-x-hidden">
                Motorcycles
              </li>
              <li className="cursor-pointer hover:text-teal-600 min-w-1 mx-2 overflow-x-hidden">
                Mobile Phones
              </li>
              <li className="cursor-pointer hover:text-teal-600 min-w-1 mx-1 overflow-x-hidden">
                For Sale: Houses & Apartments
              </li>
              <li className="cursor-pointer hover:text-teal-600 min-w-1 mx-1 overflow-x-hidden">
                Scooters
              </li>
              <li className="cursor-pointer hover:text-teal-600 min-w-1 mx-1 overflow-x-hidden">
                Commercial & Other Vehicles
              </li>
              <li className="cursor-pointer hover:text-teal-600 min-w-1 overflow-x-hidden">
                For Rent: Houses & Apartments
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-[120px] md:h-[128px] lg:h-[132px]"></div>
    </>
  );
};
