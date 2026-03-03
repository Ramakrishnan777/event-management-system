
import  { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import "../../index.css";
import Spinner from "../../Components/Spinner/Spinner";
import ButtonSpinner from "../../Components/Spinner/ButtonSpinner";
import { toast } from 'react-toastify'; 

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";
  const { category } = useParams();
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

        let res;

        if (category) {
          res = await fetch(`/api/events/?category=${encodeURIComponent(category)}`);
        } else if (query) {
          res = await fetch(`/api/search/?q=${encodeURIComponent(query)}`);
        }

        if (!res || !res.ok) throw new Error(`HTTP ${res?.status}`);

        const data = await res.json();
        const eventList = Array.isArray(data.events) ? data.events : data;
        setEvents(eventList);

      } catch (err) {
        console.error(err);
        setError(`Search failed: ${err.message}. Try "Food", "Chennai", or "Conference".`);
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

      if (!res.ok) {
        toast.error("Please login to book tickets!");
        navigate("/login");
        return;                  
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
        <p style={{ textAlign: "center", color: "#777", padding: "40px" }}>
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