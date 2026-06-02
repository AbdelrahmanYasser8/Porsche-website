import { Routes, Route } from 'react-router-dom'
import CarListing from "./pages/CarsListing/CarsListing"
import CarDetails from "./pages/CarDetails/CarDetails"
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import ManageCars from "./pages/Admin/ManageCars/ManageCars";
import ManageUsers from "./pages/Admin/ManageUsers/ManageUsers";
import ManageOrders from "./pages/Admin/ManageOrders/ManageOrders";
import CookieConsent from "./components/Cookies/CookieConsent";
import RequireAuth from "./components/Auth/RequireAuth";
import { Navigate } from "react-router-dom";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<CarListing />} />
        <Route path="/shop/suv" element={<CarListing />} />
        <Route path="/shop/sports" element={<CarListing />} />
        <Route path="/shop/electric" element={<CarListing />} />
        <Route path="/shop/sedan" element={<CarListing />} />
        <Route path="/shop/all" element={<CarListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/CarDetails" element={<CarDetails />} />
        <Route path="/CarDetails/:id" element={<CarDetails />} />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route element={<RequireAuth roles={["Admin"]} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/cars" element={<ManageCars />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
        </Route>
      </Routes>
      <CookieConsent />
    </>
  );
}

export default App;
