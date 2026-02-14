import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./mainpage.css";

export default function Main() {
  const navigate = useNavigate();

  // Check session on component mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    
    if (!user) {
      // if no session, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

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
          <button
            className="LogOut"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Log Out
          </button>
        </div>

        <div className="herocontent">
          <h1>Connecting the world</h1>
          <p>Discover events. Meet people. Create memories</p>

          <form>
            <div className="search-box">
              <input type="text" placeholder=" 🔎︎ Search events" name="search" />

              <select className="dropdown" name="category">
                <option value="" disabled selected hidden>🧾 Category</option>
                <option value="concert">Concert</option>
                <option value="Foodfestival">Food Festival</option>
                <option value="conference">Conference</option>
                <option value="sports">Sports</option>
                <option value="tech">Tech</option>
              </select>

              <select className="dropdown" name="location">
                <option value="" disabled selected hidden>📌 Location</option>
                <option value="chennai">Ambathur</option>
                <option value="bangalore">RedHills</option>
                <option value="goa">Koyambedu</option>
                <option value="mumbai">Porur</option>
                <option value="delhi">Mylapore</option>
              </select>

              <button className="searchbtn" type="submit">Search</button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
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

      {/* Event List Section */}
      <section className="eventlist">
        <h1 className="eventlist-title">Upcoming Events</h1>
        <p className="eventlist-subtitle">Hand-picked events you shouldn't miss</p>

        <div className="events">
          <div className="eventcard">
            <img src="/images/foodevent.jpg" alt="" />
            <div className="eventcard-body">
              <span className="event-category">Food Festival</span>
              <h3 className="event-name">Food Mood Reboot</h3>
              <p className="event-date">📅 2026-02-07 · 10:00 AM</p>
              <p className="event-location">📍 Chennai</p>
              <div className="cardfooter">
                <span className="event-price">₹499</span>
                <button className="ticket-btn">Get Ticket</button>
              </div>
            </div>
          </div>

          <div className="eventcard">
            <img src="/images/conferenceEvent.jpg" alt="" />
            <div className="eventcard-body">
              <span className="event-category">Conference</span>
              <h3 className="event-name">Auto Seat Conference</h3>
              <p className="event-date">📅 2026-02-08 · 9:00 AM</p>
              <p className="event-location">📍 Bangalore</p>
              <div className="cardfooter">
                <span className="event-price">₹999</span>
                <button className="ticket-btn">Get Ticket</button>
              </div>
            </div>
          </div>

          <div className="eventcard">
            <img src="/images/concertevent.jpg" alt="" />
            <div className="eventcard-body">
              <span className="event-category">Fashion</span>
              <h3 className="event-name">Music Festival Night</h3>
              <p className="event-date">📅 2026-02-09 · 6:00 PM</p>
              <p className="event-location">📍 Goa</p>
              <div className="cardfooter">
                <span className="event-price">₹1499</span>
                <button className="ticket-btn">Get Ticket</button>
              </div>
            </div>
          </div>
        </div>

        <button className="alleventsbtn" type="button">View All Events</button>
      </section>

      {/* Footer Section */}
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
