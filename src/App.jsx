import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import Addresses from "./pages/Addresses";

function App() {
  // Keep the search text in the main app so the navbar and products page can share it.
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearch={setSearchTerm} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products searchTerm={searchTerm} />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/categories" element={<Categories />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/addresses" element={<Addresses />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;