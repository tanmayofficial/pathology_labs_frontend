import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Navbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeOption,
  setActiveOption,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(user.username || user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMasterOpen(false);
        setIsEntryOpen(false);
        setIsReportsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 right-0 h-[60px] px-6 py-4 flex justify-end items-center z-50 transition-all duration-300">
      <ul className="hidden md:flex space-x-6 text-sm uppercase items-center">
        {["Home", "Masters", "Entry", "Reports", "Utilities", "Help"].map(
          (item, id) => (
            <li key={id} className="relative">
              {["Home", "Utilities", "Help"].includes(item) ? (
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="hover:text-primary cursor-pointer flex items-center space-x-1"
                  onClick={() => setActiveOption(`/${item.toLowerCase()}`)}
                >
                  {item}
                </Link>
              ) : (
                <span
                  className="hover:text-primary cursor-pointer flex items-center space-x-1"
                  onClick={(e) => {
                    setActiveOption(`/${item.toLowerCase()}`);
                    if (item === "Masters") {
                      e.preventDefault();
                      setIsMasterOpen(!isMasterOpen);
                      setIsEntryOpen(false);
                      setIsReportsOpen(false);
                    } else if (item === "Entry") {
                      e.preventDefault();
                      setIsEntryOpen(!isEntryOpen);
                      setIsMasterOpen(false);
                      setIsReportsOpen(false);
                    } else if (item === "Reports") {
                      e.preventDefault();
                      setIsReportsOpen(!isReportsOpen);
                      setIsMasterOpen(false);
                      setIsEntryOpen(false);
                    }
                  }}
                >
                  {item}

                  {(item === "Masters" &&
                    (isMasterOpen ? (
                      <FaChevronDown className="text-xs mx-1" />
                    ) : (
                      <FaChevronRight className="text-xs mx-1" />
                    ))) ||
                    (item === "Entry" &&
                      (isEntryOpen ? (
                        <FaChevronDown className="text-xs mx-1" />
                      ) : (
                        <FaChevronRight className="text-xs mx-1" />
                      ))) ||
                    (item === "Reports" &&
                      (isReportsOpen ? (
                        <FaChevronDown className="text-xs mx-1" />
                      ) : (
                        <FaChevronRight className="text-xs mx-1" />
                      )))}
                </span>
              )}

              {/* Masters Dropdown */}
              {item === "Masters" && isMasterOpen && (
                <div
                  ref={menuRef}
                  className="absolute left-0 mt-1 w-48 bg-white shadow-lg border rounded-md py-2 z-50"
                >
                  <Link
                    to="/test"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Test
                  </Link>
                  <Link
                    to="/test-group"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Test Group
                  </Link>
                  <Link
                    to="/test-formula"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Test Formula
                  </Link>
                  <Link
                    to="/doctor"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Doctors
                  </Link>
                  <Link
                    to="/ledger"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Ledger
                  </Link>
                  <Link
                    to="/account-group"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Account Group
                  </Link>
                  <Link
                    to="/address-book"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Address Book
                  </Link>
                </div>
              )}

              {/* Entry Dropdown */}
              {item === "Entry" && isEntryOpen && (
                <div
                  ref={menuRef}
                  className="absolute left-0 mt-1 w-48 bg-white shadow-lg border rounded-md py-2 z-50"
                >
                  <Link
                    to="/category"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Category
                  </Link>
                  <Link
                    to="/department"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Department
                  </Link>
                  <Link
                    to="/patient-entry"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Patient Entry
                  </Link>
                  <Link
                    to="/quick-payment"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Quick Payment
                  </Link>
                  <Link
                    to="/receipt-report"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Receipt Report
                  </Link>
                  <Link
                    to="/bank-entry"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Bank Entry
                  </Link>
                </div>
              )}

              {/* Reports Dropdown */}
              {item === "Reports" && isReportsOpen && (
                <div
                  ref={menuRef}
                  className="absolute left-0 mt-1 w-48 bg-white shadow-lg border rounded-md py-2 z-50"
                >
                  <Link
                    to="/invoices"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Invoices
                  </Link>
                  <Link
                    to="/test-report"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Test Report
                  </Link>
                  <Link
                    to="/pending-report"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Pending Report
                  </Link>
                  <Link
                    to="/complete-report"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Complete Report
                  </Link>
                  <Link
                    to="/cash-register"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Cash Register Report
                  </Link>
                  <Link
                    to="/ledger-report"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Ledger Report
                  </Link>
                  <Link
                    to="/balance-list"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Balance List
                  </Link>
                  <Link
                    to="/outstanding"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Outstanding
                  </Link>
                </div>
              )}
            </li>
          )
        )}
        <li>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-primary"
            >
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/"
              className="flex items-center space-x-1 hover:text-primary"
            >
              <FaUserCircle className="text-xl" />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
