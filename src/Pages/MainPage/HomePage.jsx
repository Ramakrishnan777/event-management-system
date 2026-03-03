
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

  useEffect(() => {
    fetchNearestEvents();
  }, []);


  // Fetch nearest events

  const fetchNearestEvents = async () => {
    try {
      setPageLoading(true);
      setError("");

      const res = await fetch("/api/events/nearest");

 
      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setPageLoading(false);
    }
  };

  //SEARCH

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/results?search=${encodeURIComponent(search)}`);
  };


  // Get Ticket

  const handleGetTicket = async (eventTitle) => {
    setTicketLoading(eventTitle);

    try {
      const res = await fetch("/api/check-auth/", {
        method: "POST",
        credentials: "include",

     
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ eventTitle }),
      });

      if (!res.ok) {
        toast.error("Please login to book tickets!");
        navigate("/login");
        return;
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      setTicketLoading(null);
    }
  };


  // Logout

  const handleLogout = async () => {
    
    await fetch("/api/logout/", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  const handleAllEvents = () => {
    navigate("/eventlist");
  };

  const handleMyEvents = () => {
    navigate("/myevents");
  };

  const handleCategoryClick = (category) => {
    navigate(`/results/${category}`);
  };

  
  // UI

  return (
    <div>
      <section className="hero">
        <div className="topbar">
          <div className="vibely-logo">
            <div className="vibely-icon">
              <img src="/images/logonew.png" alt="logo" />
            </div>
            <div className="vibely-text">Vibely</div>
          </div>

          <button className="myeventsbtn" onClick={handleMyEvents}>
            My Events
          </button>

          <button className="LogOut" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="herocontent">
          <h1>Connecting the world</h1>
          <p>Discover events. Meet people. Create memories</p>

          <form onSubmit={handleSearch}>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search events"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="searchbtn" type="submit">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="categories">
        <h2>Browse Events by Category</h2>

        <div className="category-container">
          <div
            className="category-card"
            onClick={() => handleCategoryClick("concerts")}
          >
            <img src="/images/concert category.png" alt="Concerts" />
            <p>Concerts</p>
          </div>

          <div
            className="category-card"
            onClick={() => handleCategoryClick("foodfestival")}
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
            onClick={() => handleCategoryClick("sports")}
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

      <section className="eventlist">
        <h1 className="eventlist-title">Upcoming Events</h1>
        <p className="eventlist-subtitle">
          Hand-picked events you shouldn't miss
        </p>

        {error && <p className="error-text">{error}</p>}

        {pageLoading ? (
          <ButtonSpinner />
        ) : (
          <div className="events">
            {events.map((event) => (
              <div
                className="eventcard"
                key={`${event.title}-${event.date}-${event.time}`}
              >
                <img src={event.image} alt={event.title} />

                <div className="eventcard-body">
                  <span className="event-category">{event.category}</span>

                  <h3 className="event-name">{event.title}</h3>

                  <p className="event-date">
                    📅 {event.eventDate} · {event.time}
                  </p>

                  <p className="event-location">📍 {event.location}</p>

                  <div className="cardfooter">
                    <span className="event-price">₹{event.price}</span>

                    <button
                      className="ticket-btn"
                      onClick={() => handleGetTicket(event.title)}
                      disabled={ticketLoading === event.title}
                    >
                      {ticketLoading === event.title && <ButtonSpinner />}
                      {ticketLoading === event.title
                        ? "Processing..."
                        : "Get Ticket"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="alleventsbtn" onClick={handleAllEvents}>
          View All Events
        </button>
      </section>

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

