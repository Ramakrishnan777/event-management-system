import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../MainPage/mainpage.css";
import Spinner from '../../Components/Spinner/Spinner';

export default function ResultsPage() {
  const navigate = useNavigate();

  // get ?search=value from URL
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // runs when page loads
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/events?search=${query}`
      );

      const data = await res.json();
      setEvents(data);

    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  const handleGetTicket = (name) => {
    alert(`Booking ticket for: ${name}`);
  };

  return (
    <section className="eventlist">
      <h1 className="eventlist-title">Results for "{query}"</h1>

      
      {loading && <Spinner />}

      {!loading && events.length === 0 && <p>No events found</p>}

      <div className="events">
        {!loading &&
          events.map((event) => (
            <div key={event.id} className="eventcard">
              <img src={event.image || "/images/conferenceEvent.jpg"} alt="" />

              <div className="eventcard-body">
                <span className="event-category">{event.category}</span>

                <h3 className="event-name">{event.name}</h3>

                <p className="event-date">📅 {event.date}</p>

                <p className="event-location">📍 {event.location}</p>

                <div className="cardfooter">
                  <span className="event-price">₹{event.price}</span>

                  <button
                    className="ticket-btn"
                    onClick={() => handleGetTicket(event.name)}
                  >
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
     