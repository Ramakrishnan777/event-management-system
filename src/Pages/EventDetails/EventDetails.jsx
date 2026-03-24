import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../Components/Spinner/Spinner";
import './EventDetails.css';
import {
  Calendar, Location, Clock, TickCircle, Profile2User, Lock
} from "iconsax-react";
import { FaTicketAlt, FaKey } from 'react-icons/fa';
import { BsTag } from 'react-icons/bs';
import { AiOutlineWallet } from 'react-icons/ai';
import { toast } from "react-toastify";

const EventDetails = ({mode}) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {title} = useParams();
  const navigate = useNavigate();
  
  // ===== PASSKEY STATES (NEW) =====
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(false); // flag for cancel after verify

  useEffect(() => {
    fetchEventDetails();
  }, [title]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/event/${encodeURIComponent(title)}`, {
        method: "GET", credentials: "include",
      });
      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvent(data); 
    } catch (e) {
      setError(`Something went wrong: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ===== PASSKEY VERIFICATION HANDLER (NEW) =====
  const handleVerifyPasskey = async () => {
    if (!passkeyInput.trim()) {
      setPasskeyError("Please enter your passkey");
      return;
    }

    setPasskeyLoading(true);
    setPasskeyError("");

    try {
      const res = await fetch("/api/passkey/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ passkey: passkeyInput.trim() })
      });
      const data = await res.json();
      
      if (res.ok) {
        setShowPasskeyModal(false);
        setPasskeyInput("");
        
        // If we were waiting to cancel, proceed now
        if (pendingCancel) {
          await executeCancelTicket();
          setPendingCancel(false);
        }
      } else {
        setPasskeyError(data.message || "Incorrect passkey");
        toast.error("Invalid passkey. Please try again.");
      }
    } catch (err) {
      setPasskeyError("Verification failed. Please try again.");
      console.error("Passkey verification error:", err);
      toast.error("Something went wrong");
    } finally {
      setPasskeyLoading(false);
    }
  };

  // ===== ACTUAL CANCEL LOGIC (extracted for reuse) (NEW) =====
  const executeCancelTicket = async () => {
    try {
      const res = await fetch("/api/cancel-ticket/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventTitle: event.title }) 
      });

      if (!res.ok) {
        toast.error("Failed to cancel ticket");
        return;
      }
      toast.success("Ticket cancelled successfully");
      // Refresh event data to update UI
      fetchEventDetails();
    } catch (e) {
      console.log(e.message);
      toast.error("Something went wrong");
    }
  };

  // ===== MODIFIED: handleTicketAction (NEW) =====
  const handleTicketAction = async (type) => {
    try {
      if (type === "register") {
        navigate(`/register/${encodeURIComponent(title)}`);
        return;
      }

      if (type === "cancel") {
        // ===== SHOW PASSKEY MODAL BEFORE CANCELING (NEW) =====
        setShowPasskeyModal(true);
        setPendingCancel(true); // flag to cancel after successful verification
        return;
      }
    } catch (e) {
      console.log(e.message);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div className="events-details-container">
      <div className="bannercontainer">
        <img src={event.image || "/images/conferenceEvent.jpg"} className="banner" alt={event.title} />
        <span className="eventCategory">{event.category}</span>
      </div>
      <div className="content-container">
        <h1 className="event-title">{event.title}</h1>

        {/* Info List */}
        <div className="info-list">
          <div className="info-row"><Calendar size="30" color="#F4A261" variant="Bold" /><p>{event.date},{event.time}</p></div>
          <div className="info-row"><Location size="30" color="#E63946" variant="Bold" /><p>{event.location}</p></div>
          <div className="info-row"><BsTag size="30" color="#F97316" /><p>Registration Last Date:{event.registration_last_date}</p></div>
          <div className="info-row"><AiOutlineWallet color="#14B8A6" size={30} /><p>₹{event.price}</p></div>
          <div className="info-row"><Profile2User size="30" color="#fF9F43" variant="Bold" /><p>Organized by: {event.organizer}</p></div>
        </div>

        {/* Description & Agenda */}
        <div className="agenda-section">
          <h2 className="agenda-title">Agenda</h2>
          <p className="description-text">{event.description}</p>
          <div className="agenda-list">
            {event.agenda?.map((item,index)=>(
              <div key={index} className="agenda-row">
                <Clock size="30" color="gray" variant="Bold" />
                <span className="agenda-time">{item.time}</span> <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets Details */}
        <div className="ticketdetails">
          <div className="stat-box"><TickCircle size="45" color="#4A6CF7" variant="Bold" /><span className="stat-label">Total Tickets</span><span className="stat-value">{event.total_tickets}</span></div>
          <div className="stat-box"><FaTicketAlt size={45} color="#3b82f6" /><span className="stat-label">Booked</span><span className="stat-value booked">{event.booked_tickets}</span></div>
          <div className="stat-box"><TickCircle size="45" color="green" variant="Bold" /><span className="stat-label">Available</span><span className="stat-value available">{event.available_tickets}</span></div>
        </div>

        {event ? (
          event.available_tickets > 0 ? (
            event.is_registered ? (  
              <button className="cancel-btn" onClick={() => handleTicketAction("cancel")}>
                Cancel Ticket
              </button>
            ) : (
              <button className="register-btn" onClick={() => handleTicketAction("register")}>
                Register Now
              </button>
            )
          ) : event.is_registered ? (
            <button className="register-btn" disabled>✅ Already Registered</button>
          ) : (
            <button className="register-btn" disabled>🎫 Sold Out</button>
          )
        ) : null}
      </div>

      {/* ===== PASSKEY VERIFICATION MODAL (NEW) ===== */}
      {showPasskeyModal && (
        <div className="passkey-overlay" onClick={(e) => e.target === e.currentTarget && setShowPasskeyModal(false)}>
          <div className="passkey-modal">
            <div className="passkey-header">
              <Lock size="24" color="#E63946" variant="Bold" />
              <h3>Verify Your Passkey</h3>
            </div>
            <div className="passkey-body">
              <p>🔐 Enter your security passkey to confirm ticket cancellation for <b>{event.title}</b></p>
              
              <div className="passkey-input-group">
                <input 
                  type="password" 
                  placeholder="Enter your passkey" 
                  value={passkeyInput}
                  onChange={(e) => { setPasskeyInput(e.target.value); setPasskeyError(""); }}
                  className={passkeyError ? "error" : ""}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyPasskey()}
                  autoFocus
                />
              </div>
              {passkeyError && <span className="passkey-error">{passkeyError}</span>}
       
            </div>
            <div className="passkey-actions">
              <button className="passkey-btn passkey-btn-secondary" onClick={() => { setShowPasskeyModal(false); setPendingCancel(false); setPasskeyInput(""); }}>
                Cancel
              </button>
              <button 
                className="passkey-btn passkey-btn-primary" 
                onClick={handleVerifyPasskey}
                disabled={passkeyLoading}
              >
                {passkeyLoading ? "Verifying..." : "Verify & Cancel 🔐"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;