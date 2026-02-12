import { BrowserRouter, Routes, Route } from "react-router-dom";

import EmailCard from "./components/EmailCard";
import OtpCard from "./components/OtpCard";
import "./login.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Email page */}
        <Route path="/" element={<EmailCard />} />

        {/* OTP page */}
        <Route path="/otp" element={<OtpCard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
