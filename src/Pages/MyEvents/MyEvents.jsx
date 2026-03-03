import { useEffect, useState } from "react";
import "../../index.css";
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

      const res = await fetch("/data/events.json");
        //session expired
      if (res.status === 401) {
      toast.error("Session expired. Please login again."); 
      navigate("/login");
      return;
    }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }


      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.log(e);
      setError(`Something went wrong: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };
    const handleViewDeatils = async (eventTitle) => {
  try {
    const res = await fetch("/api/check-auth/", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json" 
      },
      credentials: "include",
      body: JSON.stringify({ eventTitle })
    });

    if (!res.ok) {
      toast.error("Please login to View details!");
        navigate("/login");
  
      return;
    }

    navigate(`/myevents/${encodeURIComponent(eventTitle)}`);

  } catch (e) {
    console.log(e.message);
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
  <section className="myevents-page">
    {events.length === 0 ? (
      <p style={{ textAlign: "center", color: "#777", padding: "40px" }}>
        <strong>
          You haven't registered for any events yet. Explore events and book
          your first one!
        </strong>
        <br />

        <button
          className="Alleventsbtn"
          type="button"
          onClick={() => navigate("/eventlist")}
     
        >
          View All Events
        </button>
      </p>
    ) : (
      <>
        
        <h2 className="myevents-title">
     
          My Events
        </h2>

        <div className="events-grid-container">
          {events.map((event) => (
            <div key={`${event.title}-${event.date}-${event.time}`} className="reusable-event-card">
              <img
                src={event.image || "/images/conferenceEvent.jpg"}
                alt={event.title}
              />

              <div className="card-body">
                <span className="event-category">{event.category}</span>

                <h3 className="event-title">{event.title}</h3>

                <div className="event-info">
                  📅 {event.date} · {event.time}
                </div>

                <div className="event-info">📍 {event.location}</div>

                <div className="card-footer">
                  <span className="event-price">{event.price}</span>

                  <button
                    className="viewdetailsbtn"
                    onClick={()=>handleViewDeatils(event.title)}
             
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </section>
);
}
 export default MyEvents;