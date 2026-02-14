// import EmailCard from "../../components/EmailCard";
// import OtpCard from "../../components/OtpCard";
// import Main from "../MainPage/Main"; // <- go up to Pages, then into MainPage folder
// import "../../login.css";


// import Login from "../LoginPage/App";
// export default function App() {
//   return (
//     <BrowserRouter>
//       {" "}
//       <Routes>
//         {" "}
//         <Route path="/login" element={<Login />} />{" "}
//         <Route path="/main" element={<Main />} />{" "}
//         <Route path="*" element={<Login />} /> {/* fallback */}{" "}
//       </Routes>{" "}
//     </BrowserRouter>
//   );
// }
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EmailCard from "../../components/EmailCard";
import OtpCard from "../../components/OtpCard";
import Main from "../MainPage/Main"; // correct path
import "./login.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmailCard />} />
        <Route path="/otp" element={<OtpCard />} />
        <Route path="/main" element={<Main />} />
        <Route path="*" element={<EmailCard />} /> {/* fallback */}
      </Routes>
    </BrowserRouter>
  );
}

