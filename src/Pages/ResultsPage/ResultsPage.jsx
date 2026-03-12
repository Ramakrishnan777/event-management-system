
import  { useEffect, useState } from "react";
import { useSearchParams,  useNavigate } from "react-router-dom";
import "../../index.css";
import Spinner from "../../Components/Spinner/Spinner";
import ButtonSpinner from "../../Components/Spinner/ButtonSpinner";
import { toast } from 'react-toastify'; 
import "./ResultPage.css"


export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const  category  = searchParams.get("category") || "";
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(null);

  const [error, setError] = useState("");

  // fetch Events
  useEffect(() => {
  const fetchResults = async () => {
    try {
      setPageLoading(true);
      setError("");

      if (!category && !query) {
        setEvents([]);
        return;
      }

      let url = "";

      if (category) {
        url = `/api/list-events/?category=${encodeURIComponent(category)}`;
      } else {
        url = `/api/search/?q=${encodeURIComponent(query)}`;
      }

      const res = await fetch(url,{credentials:"include"});

      // HANDLE STATUS CODES

      if (res.status === 401) {
        setError("Your session expired. Please login again.");
        return;
      }

      if (res.status === 404) {
        setError("Search service not available.");
        return;
      }

      if (res.status === 500) {
        setError("Server error. Please try again later.");
        return;
      }

      if (!res.ok) {
        setError(`Request failed (${res.status}). Please try again.`);
        return;
      }

      // PARSE JSON 

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Invalid data received from server.");
        return;
      }

      const eventList = Array.isArray(data?.events) ? data.events : data;

      if (!Array.isArray(eventList)) {
        setError("Unexpected response format from server.");
        return;
      }

      setEvents(eventList);

    } catch (err) {
      // NETWORK ERRORS
      if (err.name === "TypeError") {
        setError("Cannot connect to server. Please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }

      console.error("Search error:", err);
    } finally {
      setPageLoading(false);
    }
  };

  fetchResults();
}, [query, category]);

  // Get Ticket
  const handleGetTicket = async (eventTitle) => {
    setLoadingEvent(eventTitle);

    try {
      const res = await fetch("/api/check-auth/", {
        method: "POST",
        headers: {               
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ eventTitle })
      });
            if (res.status === 401) {
            toast.error("Session expired. Please login again."); 
            navigate("/login");
            return;
          }

          if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      navigate(`/event/${encodeURIComponent(eventTitle)}`);

    } catch (e) {
      console.log(e.message);
    } finally {
      setLoadingEvent(null);
    }
  };


  // UI

  if (pageLoading) return <Spinner />;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
        {error}
      </p>
    );

  return (
    <section className="results-page">
    <h1 className="results-title">
  {category ? `${category} Events` : `Results for "${query}"`}
</h1>

{events.length === 0 ? (
  <p className="no-results-message">
    🔍 No events found
  </p>
      ) : (
        <div className="events-grid-container">
          {events.map((event) => (
            <div
              key={`${event.title}-${event.date}-${event.time}`}
              className="reusable-event-card"
            >
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
                    className="gradient-ticket-btn"
                    onClick={() => handleGetTicket(event.title)}
                    disabled={loadingEvent === event.title}
                  >
                    {loadingEvent === event.title ? (
                      <ButtonSpinner />
                    ) : (
                      "Get Ticket"
                    )}
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