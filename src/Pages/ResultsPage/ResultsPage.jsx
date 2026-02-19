import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../MainPage/mainpage.css";
import "./ResultPage.css";
import Spinner from '../../Components/Spinner/Spinner';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/search/?q=${encodeURIComponent(query)}`);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        const eventList = Array.isArray(data.events) ? data.events : [];
        setEvents(eventList);
      } catch (err) {
        console.error("[ResultsPage] Search failed: ", err);
        setError(`Search failed: ${err.message}. Try "Food", "Chennai", or "Conference".`);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  
  if (loading) return <Spinner />;
  

  if (error) return <p style={{ textAlign: 'center', color: 'red', padding: '20px' }}>{error}</p>;

  return (
    <section className="results-page">
      <h1 className="results-title">Results for "{query}"</h1>
      
      {events.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777', padding: '40px' }}>
          🔍 No events found matching <strong>"{query}"</strong>. <br />
          Try: <code>"Food"</code>, <code>"Chennai"</code>, or <code>"Conference"</code>
        </p>
      ) : (
        <div className="results-grid">
          {events.map((event) => (
            <div key={event.id} className="eventcard">
              <img 
                src={event.image || "/images/conferenceEvent.jpg"} 
                alt={event.title} 
              />
              <div className="eventcard-body">
                <span className="event-category">{event.category}</span>
                <h3 className="event-name">{event.title}</h3>
                <p className="event-date">📅 {event.date} · {event.time}</p>
                <p className="event-location">📍 {event.location}</p>
                <div className="cardfooter">
                  <span className="event-price">₹{event.price}</span>
                  <button 
                    className="ticket-btn"
                    onClick={() => alert(`Booking: ${event.title}`)}
                  >
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}