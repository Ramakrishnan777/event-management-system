import { useEffect, useState } from "react";

import Spinner from "../../Components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import "./MyEvents.css"
import { toast } from 'react-toastify'; 

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
  try {
    setLoading(true);
    setError("");

    // const res = await fetch("/api/my-events/", {
    //   credentials: "include"
    // });
  const res =await fetch("./data/events.json")
    if (res.status === 401) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();

const eventList = Array.isArray(data)
  ? data
  : Array.isArray(data?.events)
  ? data.events
  : [];

setEvents(eventList);

  } catch (e) {
    console.log(e);
    setError(`Something went wrong: ${e.message}`);
  } finally {
    setLoading(false);
  }
};

const handleViewDetails = (eventTitle) => {
  navigate(`/myevents/${encodeURIComponent(eventTitle)}`);
};

  if (loading) return <Spinner />;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
        {error}
      </p>
    );

return (
 <section className="myevents-page">
  {events.length === 0 ? (
    <div className="empty-state">
      <div className="empty-icon">🎫</div>
      <h3>No Events Yet</h3>
      <p>You haven't registered for any events yet. Explore events and book your first one!</p>
      <button className="Alleventsbtn" onClick={() => navigate("/eventlist")}>
        Browse Events
      </button>
    </div>
  ) : (
    <>
      <div className="page-header">
        <h2 className="myevents-title">My Events</h2>
        <p className="myevents-subtitle">Your registered events at a glance</p>
      </div>
      
      <div className="tickets-container">
        {events.map((event, index) => (
          <div key={index} className="ticket-card">
            {/* Left Side - Image Section */}
            <div className="ticket-image-section">
              <img src={event.image || "/images/conferenceEvent.jpg"} alt={event.title} />
              <div className="image-overlay">
                <span className="category-tag">{event.category || "General"}</span>
              </div>
            </div>
            
            {/* Middle - Event Details */}
            <div className="ticket-details">
              <h3 className="ticket-title">{event.title || "Untitled Event"}</h3>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div className="detail-content">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{event.date || "TBD"}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">🕐</span>
                  <div className="detail-content">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{event.time || "TBD"}</span>
                  </div>
                </div>
                
                <div className="detail-item full-width">
                  <span className="detail-icon">📍</span>
                  <div className="detail-content">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{event.location || "TBD"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Price & Action */}
            <div className="ticket-action">
              <div className="price-section">
                <span className="price-label">Price</span>
                <span className="price-amount">{event.price || "Free"}</span>
              </div>
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(event.title)}
              >
                View Details
                <span className="btn-arrow">→</span>
              </button>
            </div>
            
            {/* Decorative Elements */}
        
            <div className="ticket-notch right-notch"></div>
          </div>
        ))}
      </div>
    </>
  )}
</section>
);
}

export default MyEvents;