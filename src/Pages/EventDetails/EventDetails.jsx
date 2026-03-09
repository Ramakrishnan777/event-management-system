import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";
 import './EventDetails.css';
 


import {

  Calendar,
  Location,

  Clock,
  TickCircle,
  Profile2User
} from "iconsax-react";
import { FaTicketAlt } from 'react-icons/fa';
import { BsTag } from 'react-icons/bs';
import { AiOutlineWallet } from 'react-icons/ai';
import { toast } from "react-toastify";



const EventDetails = ({mode}) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {title}=useParams();
  const navigate=useNavigate();
    useEffect(() => {
      fetchEventDetails();
    }, [title]);
  



const fetchEventDetails = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch(
      `/api/events/${encodeURIComponent(title)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (res.status === 401) {
      toast.error("Session expired. Please login again.");
      navigate("/login");

      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    setEvent(data); 

  } catch (e) {
    setError(`Something went wrong: ${e.message}`);
  } finally {
    setLoading(false);
  }
};

    const handleTicketAction = async (type) => {
  try {
    if (type === "register") {
     navigate(`/register/${encodeURIComponent(title)}`);
      return;
    }

    if (type === "cancel") {
      const res = await fetch("/api/cancel-ticket/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ eventTitle: event.title }) 
      });

      if (!res.ok) {
        toast.error("Failed to cancel ticket");
        return;
      }

      toast.success("Ticket cancelled successfully ");

     
      
    }
  } catch (e) {
    console.log(e.message);
    toast.error("Something went wrong");
  }
};

      if (loading) return <Spinner />;
    
      if (error)
        return (
          <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
            {error}
          </p>
        );
  return (
<div className="events-details-container">
  <div className="bannercontainer">
<img
  src={event.image || "/images/conferenceEvent.jpg"}
  className="banner"
/>
  <span className="eventCategory">{event.category}</span>
  </div>
  <div className="content-container">

  <h1 className="event-title">{event.title}</h1>

  {/* Info List */}
  <div className="info-list">
    <div className="info-row">
<Calendar size="30" color="#F4A261" variant="Bold" />
  <p>{event.date},{event.time}</p>
  </div>
  <div className="info-row">
<Location size="30" color="#E63946" variant="Bold" />
  <p>{event.location}</p>
  </div>
    <div className="info-row">
<BsTag size="30" color="#F97316" />
  <p>Registration Last Date:{event.registrationLastDate}</p>
  </div>
    <div className="info-row">
<AiOutlineWallet color="#14B8A6" size={30} /> 
  <p>₹{event.price}</p>
  </div>
   <div className="info-row">
<Profile2User size="30" color="#fF9F43" variant="Bold" />
  <p>Organized by: {event.organizer}</p>
  </div>
    </div>
 {/* Description & Agenda */}
 <div className="agenda-section">
   <h2 className="agenda-title">Agenda</h2>
  <p className="description-text">{event.description}</p>
  <div className="agenda-list">
  {event.agenda?.map((item,index)=>(
    <div key={index} className="agenda-row">
      <Clock size="30" color="gray" variant="Bold" />
      <span className="agenda-time">{item.time}</span>{" "}

       {" "} <span>{item.title}</span>
      
    </div>
  
  ))}
   </div>
   </div>

   {/* Tickets Details */}
   <div className="ticketdetails">
    <div className="stat-box">
       <TickCircle size="45" color="#4A6CF7" variant="Bold" />
       <span className="stat-label">Total Tickets</span>
       <span className="stat-value ">{event.tickets.total}</span>
       </div>

      <div className="stat-box">
          <FaTicketAlt size={45} color="#3b82f6" />
          <span className="stat-label">Booked</span>
          <span className="stat-value booked">{event.tickets.booked}</span>
          </div>
       <div className="stat-box">
        <TickCircle size="45" color="green" variant="Bold" />
        <span className="stat-label">Available</span>
        <span className="stat-value available">{event.tickets.available}</span>
        </div>
   </div>


 {/* Action Button */}
  {event.tickets.available>0?(
    mode==="register" ?(
      <button className="register-btn" onClick={() => handleTicketAction( "register")}>Register Now</button>
    ): <button className="cancel-btn"  onClick={() => handleTicketAction( "cancel")}
>Cancel Ticket</button>
  ):<button className="register-btn" disabled> 🎫 Sold Out</button>
  }


  </div>
 </div>
    
  )
}

export default EventDetails