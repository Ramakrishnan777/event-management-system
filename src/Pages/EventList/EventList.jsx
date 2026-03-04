
import { useState, useEffect } from "react";
import "../../index.css";
import "./EventList.css";
import ButtonSpinner from "../../Components/Spinner/ButtonSpinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [currentpage, setCurrentPage] = useState(1);

  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");


  const [pageLoading, setPageLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(null);

  const navigate = useNavigate();
  const eventsPerPage = 6;

  // fetch data

  useEffect(() => {
    async function fetchEvents() {
      try {
        setPageLoading(true);

        const res = await fetch("/data/events.json");
        

        if (!res.ok) throw new Error("Failed to load events");

        const data = await res.json();
        setEvents(data);
      } catch (e) {
        setError(`Something went wrong: ${e.message}`);
      } finally {
        setPageLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  // search filter

  const filterEvents = events.filter((event) => {
    const text = search.toLowerCase();

    return (
      event.title.toLowerCase().includes(text) ||
      event.category.toLowerCase().includes(text) ||
      event.location.toLowerCase().includes(text)
    );
  });


  // ticket handler

  const handleGetTicket = async (eventTitle) => {
    setLoadingEvent(eventTitle);

    try {
      const res = await fetch("/api/check-auth/", {
        method: "POST",
        credentials: "include",

   
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ eventTitle }),
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
      console.log(e);
      setError(`Something went wrong: ${e.message}`);
    } finally {
      setLoadingEvent(null);
    }
  };

 
  // pagination math

  const lastIndex = currentpage * eventsPerPage;
  const firstIndex = lastIndex - eventsPerPage;
  const currentEvents = filterEvents.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filterEvents.length / eventsPerPage);

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", padding: "20px" }}>
        {error}
      </p>
    );

  return (
    <div className="results-page">
      {/* Search */}
      <header>
        <div className="searchbox">
          <input
            type="text"
            placeholder="Search events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

  
      {/* Events Grid */}
  
      <div className="events-grid-container">
        {pageLoading ? (
          <ButtonSpinner />
        ) : currentEvents.length > 0 ? (
          currentEvents.map((event) => (
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
               
                  <span className="event-price">₹{event.price}</span>

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
          ))
        ) : (
          <div className="no-events">No events found for your search 😕</div>
        )}
      </div>

   
      {/* Pagination */}
 
      <footer className="pagination">
        <button
          disabled={currentpage === 1}
          onClick={() => setCurrentPage(currentpage - 1)}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <span
            key={i}
            className={`page-number ${currentpage === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </span>
        ))}

        <button
          disabled={currentpage === totalPages}
          onClick={() => setCurrentPage(currentpage + 1)}
        >
          Next
        </button>
      </footer>
    </div>
  );
}