import React from "react";
import { useNavigate } from "react-router-dom";
import "./mainpage.css";
import { useState } from "react";
import ButtonSpinner from "../../Components/Spinner/ButtonSpinner";

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loadingEvent, setLoadingEvent] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/results?search=${encodeURIComponent(search)}`);
  };

  // Get Ticket
  const handleGetTicket = async (eventName) => {
    setLoadingEvent(eventName);
    try {
      const res = await fetch("http://localhost:8000/check-auth/", {
        credentials: "include"
      });
      
      if (!res.ok) {
        alert("Please login to book tickets!");
        navigate("/login");
        return;
      }

      alert(`Booking ticket for: ${eventName}`);
    } catch {
      navigate("/login");
    } finally {
      setLoadingEvent(null);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8000/logout/", {
      method: "POST",
      credentials: "include"
    });
    navigate("/login");
  };

  return (
    <div>
      <section className="hero">
        <div className="topbar">
          <div className="vibely-logo">
            <div className="vibely-icon">
              <img src="/images/logonew.png" alt="" />
            </div>
            <div className="vibely-text">Vibely</div>
          </div>
          <button className="myeventsbtn" type="button">My Events</button>
          <button className="LogOut" onClick={handleLogout}>Log Out</button>
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
              <button className="searchbtn" type="submit">Search</button>
            </div>
          </form>
        </div>
      </section>

      <section className="categories">
        <h2>Browse Events by Category</h2>
        <div className="category-container">
          <div className="category-card">
            <img src="/images/concert category.png" alt="Concerts" />
            <p>Concerts</p>
          </div>
          <div className="category-card">
            <img src="/images/food category.png" alt="Food Festival" />
            <p>Food Festival</p>
          </div>
          <div className="category-card">
            <img src="/images/conference category.png" alt="Conference" />
            <p>Conference</p>
          </div>
          <div className="category-card">
            <img src="/images/Sports category.png" alt="Sports" />
            <p>Sports</p>
          </div>
          <div className="category-card">
            <img src="/images/techcategory.png" alt="Tech" />
            <p>Tech</p>
          </div>
        </div>
      </section>

      <section className="eventlist">
        <h1 className="eventlist-title">Upcoming Events</h1>
        <p className="eventlist-subtitle">Hand-picked events you shouldn't miss</p>

        <div className="events">
          {/* Event 1 */}
          <div className="eventcard">
            <img src="/images/foodevent.jpg" alt="" />
            <div className="eventcard-body">
              <span className="event-category">Food Festival</span>
              <h3 className="event-name">Food Mood Reboot</h3>
              <p className="event-date">📅 2026-02-07 · 10:00 AM</p>
              <p className="event-location">📍 Chennai</p>
              <div className="cardfooter">
                <span className="event-price">₹499</span>
                <button
                  className="ticket-btn"
                  onClick={() => handleGetTicket("Food Mood Reboot")}
                  disabled={loadingEvent === "Food Mood Reboot"}
                >
                  {loadingEvent === "Food Mood Reboot" && <ButtonSpinner />}
                  {loadingEvent === "Food Mood Reboot" ? "Processing..." : "Get Ticket"}
                </button>
              </div>
            </div>
          </div>

          {/* Event 2 */}
          <div className="eventcard">
            <img src="/images/conferenceEvent.jpg" alt="" />
            <div className="eventcard-body">
              <span className="event-category">Conference</span>
              <h3 className="event-name">Auto Seat Conference</h3>
              <p className="event-date">📅 2026-02-08 · 9:00 AM</p>
              <p className="event-location">📍 Bangalore</p>
              <div className="cardfooter">
                <span className="event-price">₹999</span>
                <button
                  className="ticket-btn"
                  onClick={() => handleGetTicket("Auto Seat Conference")}
                  disabled={loadingEvent === "Auto Seat Conference"}
                >
                  {loadingEvent === "Auto Seat Conference" && <ButtonSpinner />}
                  {loadingEvent === "Auto Seat Conference" ? "Processing..." : "Get Ticket"}
                </button>
              </div>
            </div>
          </div>

          {/* Event 3 */}
          <div className="eventcard">
            <img src="/images/concertevent.jpg" alt="" />
            <div className="eventcard-body">
              <span className="event-category">Fashion</span>
              <h3 className="event-name">Music Festival Night</h3>
              <p className="event-date">📅 2026-02-09 · 6:00 PM</p>
              <p className="event-location">📍 Goa</p>
              <div className="cardfooter">
                <span className="event-price">₹1499</span>
                <button
                  className="ticket-btn"
                  onClick={() => handleGetTicket("Music Festival Night")}
                  disabled={loadingEvent === "Music Festival Night"}
                >
                  {loadingEvent === "Music Festival Night" && <ButtonSpinner />}
                  {loadingEvent === "Music Festival Night" ? "Processing..." : "Get Ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button className="alleventsbtn" type="button">View All Events</button>
      </section>

      <section className="footersection">
        <h1>How it Works</h1>
        <footer>
          <div>
            <h2>Find Events</h2>
            <img src="/images/searchicon (2).svg" className="footericons" />
            <p>Browse events by category or location</p>
          </div>
          <div>
            <h2>Book Tickets</h2>
            <img src="/images/ticketicon.svg" className="footericons" />
            <p>Reserve your ticket instantly</p>
          </div>
          <div>
            <h2>Attend & Enjoy</h2>
            <img src="/images/partyicon (1).svg" className="footericons" />
            <p>Join the event and have fun</p>
          </div>
        </footer>
      </section>
    </div>
  );
}