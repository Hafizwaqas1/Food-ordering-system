import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaHeart,
  FaHome,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTruck,
  FaUser,
  FaUserCircle,
  FaUserPlus,
  FaUserShield,
  FaUtensils,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/layout.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const PublicLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const {cartCount, setCartCount} = useCart();
  const {wishlistCount, setWishlistCount} = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("userName");

  const fetchCartCount = async () => {
    if (userId) {
      const res = await fetch(`https://hafiz899.pythonanywhere.com/api/cart/${userId}`);
      const data = await res.json();
      setCartCount(data.length);
    }
  }

  const fetchWishlistCount = async () => {
    if (userId) {
      const res = await fetch(`https://hafiz899.pythonanywhere.com/api/wishlist/${userId}`);
      const data = await res.json();
      setWishlistCount(data.length);
    }
  }

  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name);
      fetchCartCount();
      fetchWishlistCount();
    }
  }, [userId, name, fetchCartCount, fetchWishlistCount]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setCartCount(0);
    setWishlistCount(0);
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid mx-3">
          <Link className="navbar-brand fw-bold" to="#">
            <FaUtensils className="me-2" />
            Food Ordering System
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/" ? "active-nav-link" : ""}`} to="/">
                  <FaHome className="me-1" />
                  Home
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/food-menu" ? "active-nav-link" : ""}`} to="/food-menu">
                  <FaUtensils className="me-1" />
                  Menu
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/track-orders" ? "active-nav-link" : ""}`} to="/track-orders">
                  <FaTruck className="me-1" />
                  Track
                </Link>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/register" ? "active-nav-link" : ""}`} to="/register">
                      <FaUserPlus className="me-1" />
                      Register
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/login" ? "active-nav-link" : ""}`} to="/login">
                      <FaSignInAlt className="me-1" />
                      Login
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/admin-login" ? "active-nav-link" : ""}`} to="/admin-login">
                      <FaUserShield className="me-1" />
                      Admin
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/my-orders" ? "active-nav-link" : ""}`} to="/my-orders">
                      <FaUser className="me-1" />
                      My Orders
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/cart" ? "active-nav-link" : ""}`} to="/cart">
                      <FaShoppingCart className="me-1" />
                      Cart
                      {cartCount > 0 && (
                        <span className="badge bg-light text-dark ms-1">({cartCount})</span>
                      )}
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/wishlist" ? "active-nav-link" : ""}`} to="/wishlist">
                      <FaHeart className="me-1" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="badge bg-light text-dark ms-1">({wishlistCount})</span>
                      )}
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle text-capitalize"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <FaUserCircle className="me-1"/>
                      {userName}
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className={`dropdown-item ${location.pathname === "/profile" ? "active-dropdown" : ""}`} to="/profile">
                        <FaUser className="me-1"/>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className={`dropdown-item ${location.pathname === "/change-password" ? "active-dropdown" : ""}`} to="/change-password">
                        <FaCog className="me-1"/>
                          Settings
                        </Link>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <button class="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt className="me-1"/>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div>{children}</div>
      <footer className="text-center py-3 mt-5">
        <div className="container">
          <p>&copy; 2026 Food Ordering System. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
