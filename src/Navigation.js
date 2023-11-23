import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, firestore } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email);
        fetchUserRole(user.uid);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        setUserType("");
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserRole = async (userId) => {
    const usersRef = collection(firestore, "Users");
    const q = query(usersRef, where("uid", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Get the first document in the results
      const fetchedUserType = userDoc.data().userType;
      console.log("Fetched User Type:", fetchedUserType); // Logging the user type for debugging
      setUserType(fetchedUserType);
    } else {
      console.log("User document with given UID does not exist");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="navbar shadow-lg bg-base-100 rounded-box">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 shadow bg-base-100 rounded-box w-52"
          >
            {/* Dropdown menu items (similar to navbar-center) */}
            {/* You can replicate the logic here for a responsive design */}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          VibeVault 👩🏻‍🎤
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          {isLoggedIn ? (
            <>
              {userType === "admin" && (
                <>
                  <li>
                    <Link to="/admin-dashboard" className="hover:text-gray-300">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="hover:text-gray-300">
                      Settings
                    </Link>
                  </li>
                </>
              )}
              {userType === "employee" && (
                <li>
                  <Link
                    to="/employee-dashboard"
                    className="hover:text-gray-300"
                  >
                    Employee Dashboard
                  </Link>
                </li>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-gray-300">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-gray-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-gray-300">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-gray-300">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  Contact Us
                </Link>
              </li>
              {/* <li>
                <Link to="/admin-signup" className="hover:text-gray-300">
                  Admin Signup
                </Link>
              </li> */}
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {isLoggedIn && <span className="text-sm mr-3">{userEmail}</span>}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        ) : (
          <button onClick={() => navigate("/login")} className="btn">
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Navigation;
