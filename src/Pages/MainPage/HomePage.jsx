import { useNavigate } from "react-router-dom";
import "./mainpage.css";
import { useState, useEffect } from "react";
import ButtonSpinner from "../../Components/Spinner/ButtonSpinner";
import { toast } from "react-toastify";

export default function HomePage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(null);
  const [error, setError] = useState("");
  
  // SLIDE BY 1 - Track starting index
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE_CARDS = 3;

  useEffect(() => {
    fetchNearestEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/results?search=${encodeURIComponent(search)}`);
  };

  const fetchNearestEvents = async () => {
    try {
      setPageLoading(true);
      setError("");

      const res = await fetch("/api/upcoming-events/", { credentials: "include" });

  


      if (!res.ok) {
        throw new Error("Failed to load events");
      }

      const data = await res.json();

      const eventList = Array.isArray(data)
        ? data
        : Array.isArray(data?.events)
          ? data.events
          : [];

      setEvents(eventList);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load events");
    } finally {
      setPageLoading(false);
    }
  };

  const handleGetTicket = async (title) => {
    setTicketLoading(title);
    try {
      const res = await fetch("/api/check-auth/", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Please login to get a ticket");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        toast.error("Something went wrong");
        return;
      }

      navigate(`/event/${encodeURIComponent(title)}`);
    } catch (e) {
      console.error(e.message);
      toast.error("Network error. Check your internet connection.");
    } finally {
      setTicketLoading(null);
    }
  };

  const handleAllEvents = () => {
    navigate("/eventlist");
  };

  const handleCategoryClick = (category) => {
    navigate(`/results?category=${encodeURIComponent(category)}`);
  };

  // SLIDE ONE CARD AT A TIME
  const handleNext = () => {
    if (startIndex + VISIBLE_CARDS < events.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
    // CLICK ON CARD TO CENTER IT
  const handleCardClick = (cardIndex) => {
    // If center card (index 1), don't slide
    if (cardIndex === 1) return;
    
    // Calculate new startIndex to make clicked card center
    // Left card (index 0) -> go back 1
    // Right card (index 2) -> go forward 1
    const newIndex = startIndex + cardIndex - 1;
       if (newIndex >= 0 && newIndex + VISIBLE_CARDS <= events.length) {
      setStartIndex(newIndex);
    }
  };


  // Get visible cards (always 3)
  const visibleEvents = events.slice(startIndex, startIndex + VISIBLE_CARDS);

  return (
     <div className="home-page-container">
      {/* --- Navbar Section --- */}
      <nav className="navbar">
        <div className="logo-container" onClick={() => navigate("/")}>
          <img src="/images/logonew.png" alt="Vibely Logo" />
          <span>Vibely</span>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="herocontent">
        <h1>Connecting the world</h1>
        <p>Discover events. Meet people. Create memories</p>

        <form onSubmit={handleSearch}>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="searchbtn" type="submit">
              Search
            </button>
          </div>
        </form>
      </section>

      {/* --- Categories Section --- */}
      <section className="categories">
        <h2>Browse Events by Category</h2>

        <div className="category-container">
          <div
            className="category-card"
            onClick={() => handleCategoryClick("concert")}
          >
            <img src="/images/concert category.png" alt="Concert" />
            <p>Concerts</p>
          </div>

          <div
            className="category-card"
            onClick={() => handleCategoryClick("food festival")}
          >
            <img src="/images/food category.png" alt="Food Festival" />
            <p>Food Festival</p>
          </div>

          <div
            className="category-card"
            onClick={() => handleCategoryClick("conference")}
          >
            <img src="/images/conference category.png" alt="Conference" />
            <p>Conference</p>
          </div>

          <div
            className="category-card"
            onClick={() => handleCategoryClick("sport")}
          >
            <img src="/images/Sports category.png" alt="Sports" />
            <p>Sports</p>
          </div>

          <div
            className="category-card"
            onClick={() => handleCategoryClick("tech")}
          >
            <img src="/images/techcategory.png" alt="Tech" />
            <p>Tech</p>
          </div>
        </div>
      </section>

      {/* --- Event Carousel - CLICKABLE CARDS --- */}
      <section className="eventlist">
        <h1 className="eventlist-title">Upcoming Events</h1>
        <p className="eventlist-subtitle">
          Hand-picked events you shouldn't miss
        </p>

        {error && <p className="error-text">{error}</p>}

        {pageLoading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <ButtonSpinner />
            <p>Loading events...</p>
          </div>
        ) : (
          <>
            {Array.isArray(events) && events.length > 0 ? (
              <div className="carousel-wrapper">
                {/* Previous Button */}
                <button 
                  className="carousel-arrow left" 
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                >
                  ‹
                </button>

                {/* Show 3 Cards - CLICKABLE */}
                <div className="carousel-container">
                  {visibleEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`carousel-card ${
                        index === 1 ? "center-card" : ""
                      }`}
                      onClick={() => handleCardClick(index)}
                      style={{ cursor: index === 1 ? "default" : "pointer" }}
                    >
                      {/* Event Image */}
                      <div className="event-image-container">
                        <img
                          src={event.image || "/images/artevent1.jpg"}
                          alt={event.title}
                          className="event-image"
                        />
                      </div>

                      {/* Event Content */}
                      <div className="carousel-card-content">
                        <span className="event-category">{event.category}</span>
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-details">
                          <span>📅 {event.date}</span>
                          <span>· {event.time}</span>
                        </div>
                        <div className="event-details location">
                          <span>📍 {event.location}</span>
                        </div>
                        <div className="event-price">₹{event.price}</div>
                        <button
                          className="get-ticket-btn carousel-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleGetTicket(event.title);
                          }}
                          disabled={ticketLoading === event.title}
                        >
                          {ticketLoading === event.title
                            ? "Processing..."
                            : "Get Ticket"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                <button 
                  className="carousel-arrow right" 
                  onClick={handleNext}
                  disabled={startIndex + VISIBLE_CARDS >= events.length}
                >
                  ›
                </button>
              </div>
            ) : (
              <div
                style={{ textAlign: "center", color: "#6b7280", padding: "3rem" }}
              >
                <p>No upcoming events available.</p>
              </div>
            )}

            {/* Dots Indicator */}
            {events.length > VISIBLE_CARDS && (
              <div className="carousel-dots">
                {Array.from({ length: events.length - VISIBLE_CARDS + 1 }).map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${
                      startIndex === index ? "active" : ""
                    }`}
                    onClick={() => setStartIndex(index)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <button className="alleventsbtn" onClick={handleAllEvents}>
          View All Events
        </button>
      </section>

      {/* --- Footer Section --- */}
      <section className="footersection">
        <h1>How it Works</h1>

        <footer>
          <div>
            <h2>Find Events</h2>
            <img
              src="/images/searchicon (2).svg"
              className="footericons"
              alt="Search"
            />
            <p>Browse events by category or location</p>
          </div>

          <div>
            <h2>Book Tickets</h2>
            <img
              src="/images/ticketicon.svg"
              className="footericons"
              alt="Ticket"
            />
            <p>Reserve your ticket instantly</p>
          </div>

          <div>
            <h2>Attend & Enjoy</h2>
            <img
              src="/images/partyicon (1).svg"
              className="footericons"
              alt="Enjoy"
            />
            <p>Join the event and have fun</p>
          </div>
        </footer>
      </section>
    </div>
  );
}