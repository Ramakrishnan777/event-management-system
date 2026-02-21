
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/MainPage/HomePage";
import EmailCard from "./Pages/Login/EmailCard";
import OtpCard from "./Pages/Login/OtpCard";
import ResultsPage from "./Pages/ResultsPage/ResultsPage";
import EventList from "./Pages/EventList/EventList"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<EmailCard />} />
      <Route path="/otp" element={<OtpCard />} />
     <Route path="/results" element={<ResultsPage />} />
     <Route path="/eventlist" element={<EventList />}/>
 
    </Routes>
  );
}