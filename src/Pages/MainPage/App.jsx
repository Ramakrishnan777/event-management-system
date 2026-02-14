import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmailCard from "../LoginPage/components/EmailCard";
import OtpCard from "../LoginPage/components/OtpCard";
import Main from "./Main";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Flow */}
        <Route path="/" element={<EmailCard />} />       {/* EmailCard page */}
        <Route path="/otp" element={<OtpCard />} />      {/* OTP page */}

        {/* Main App */}
        <Route path="/main" element={<Main />} />       {/* Main page */}

        {/* Fallback */}
        <Route path="*" element={<EmailCard />} />
      </Routes>
    </BrowserRouter>
  );
}
