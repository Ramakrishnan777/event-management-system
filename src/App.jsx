
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/MainPage/HomePage";
import EmailCard from "./Pages/Login/EmailCard";
import OtpCard from "./Pages/Login/OtpCard";
import ResultsPage from "./Pages/ResultsPage/ResultsPage";
import EventList from "./Pages/EventList/EventList"
import MyEvents from "./Pages/MyEvents/MyEvents";
import EventDetails from "./Pages/EventDetails/EventDetails";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegistrationPage from "./Pages/RegistrationPage/RegistrationPage";
export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<EmailCard />} />
      <Route path="/otp" element={<OtpCard />} />
     <Route path="/results" element={<ResultsPage />} />
     <Route path="/eventlist" element={<EventList />}/>
     <Route path="/myevents" element={<MyEvents/>}/>
     <Route path="/results/:category" element={<ResultsPage />} />
      <Route path="/event/:title" element={<EventDetails mode="register"/>} />
        <Route path="/myevents/:title" element={<EventDetails mode="cancel"/>} />
         <Route path="/register/:title" element={<RegistrationPage/>}/>
      </Routes>
         <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="light"
      />
      </>
  );
}