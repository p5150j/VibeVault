import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navigation from "./Navigation";
import AdminSignup from "./AdminSignup";
import Login from "./Login";
import CreateCompanyProfile from "./CreateCompanyProfile";
import AdminDashboard from "./AdminDashboard";
import EmployeeSignup from "./EmployeeSignup";
import EmployeeDashboard from "./EmployeeDashboard";
import SettingsPage from "./SettingsPage";
import Homepage from "./marketing/Homepage";
import AboutUs from "./marketing/AboutUs";
import Features from "./marketing/Features";
import Pricing from "./marketing/Pricing";
import Testimonials from "./marketing/Testimonials";
import FAQs from "./marketing/FAQs";
import ContactUs from "./marketing/ContactUs";
import TermsOfUse from "./marketing/TermsOfUse";
import PrivacyPolicy from "./marketing/PrivacyPolicy";
import CookiePolicy from ".//marketing/CookiePolicy";
import Footer from "./Footer"; // Ensure this path is correct

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation /> {/* Navigation component */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success-stories" element={<Testimonials />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route
              path="/create-company-profile/:companyId"
              element={<CreateCompanyProfile />}
            />
            <Route path="/employee-signup" element={<EmployeeSignup />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            {/* Add other routes as necessary */}
          </Routes>
        </main>
        {!isLoggedIn && <Footer />}
      </div>
    </Router>
  );
}

export default App;
