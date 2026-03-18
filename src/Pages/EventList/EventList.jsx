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

        const res = await fetch("/api/list-events/",{credentials:"include"});
        

        if (!res.ok) throw new Error("Failed to load events");

        const data = await res.json();
        const eventList = Array.isArray(data)
          ?data
          : Array.isArray(data?.events)
          ? data.events
          : [];
          setEvents(eventList);
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

  const filterEvents = (Array.isArray(events) ? events : []).filter((event) => {
  const text = search.toLowerCase();
  return (
    event.title?.toLowerCase().includes(text) ||
    event.category?.toLowerCase().includes(text) ||
    event.location?.toLowerCase().includes(text)
  );
});
  // ticket handler

 const handleGetTicket = async (title) => {
  setLoadingEvent(title);

  try {
    const res = await fetch("/api/check-auth/", {
      method: "GET",
      credentials: "include",
    });

    // 401  user not logged in or session expired
    if (res.status === 401) {
      toast.error("Please login to get a ticket");
      navigate("/login");
      return;
    }

    // 403  logged in but not allowed
    if (res.status === 403) {
      toast.error("You are not allowed to perform this action");
      return;
    }

    // 404 event not found
    if (res.status === 404) {
      toast.error("Event not found");
      return;
    }

    // 429  too many requests
    if (res.status === 429) {
      toast.error("Too many requests. Please try again later.");
      return;
    }

    // server errors
    if (res.status >= 500) {
      toast.error("Server error. Please try again later.");
      return;
    }

    // any other unexpected error
    if (!res.ok) {
      toast.error("Something went wrong");
      return;
    }

    // success go to event details page
    navigate(`/event/${encodeURIComponent(title)}`);

  } catch (e) {
    console.log(e.message);
    toast.error("Network error. Check your internet connection.");
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
      <div className="events-page">
      {/* Search Header */}
      <header className="events-header">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search events by name, category, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Events Grid */}
      <main className="events-main">
        <div className="events-grid">
          {pageLoading ? (
            <div className="loading-container">
              <ButtonSpinner />
              <p className="loading-text">Loading amazing events...</p>
            </div>
          ) : currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <article
                key={`${event.title}-${event.date}-${event.time}-${index}`}
                className="event-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Image */}
                <div className="card-image-wrapper">
                  <img
                    src={event.image || "/images/conferenceEvent.jpg"}
                    alt={event.title || "Event"}
                    className="card-image"
                    loading="lazy"
                  />
                  <div className="image-overlay"></div>
                  <span className="category-badge">{event.category || "Event"}</span>
                </div>

                {/* Card Content */}
                <div className="card-content">
                  <h3 className="event-title">{event.title || "Untitled Event"}</h3>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">{event.date} · {event.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{event.location || "Location TBD"}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <div className="price-container">
                      <span className="price-label">Price</span>
                      <span className="event-price">₹{event.price || "0"}</span>
                    </div>
                    <button
                      className="ticket-button"
                      onClick={() => handleGetTicket(event.title)}
                      disabled={loadingEvent === event.title}
                    >
                      {loadingEvent === event.title ? (
                        <span className="button-loading">
                          <ButtonSpinner />
                        </span>
                      ) : (
                        <>
                          <span>Get Ticket</span>
                          <span className="button-arrow">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="no-events">
              <div className="no-events-icon">🔍</div>
              <h3>No events found</h3>
              <p>Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <footer className="pagination-container">
            <button
              className="pagination-btn"
              disabled={currentpage === 1}
              onClick={() => setCurrentPage(currentpage - 1)}
            >
              ← Previous
            </button>

            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-number ${currentpage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              disabled={currentpage === totalPages}
              onClick={() => setCurrentPage(currentpage + 1)}
            >
              Next →
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}