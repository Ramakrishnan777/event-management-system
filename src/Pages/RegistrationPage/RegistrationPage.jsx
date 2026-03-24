import { useState, useEffect } from "react";
import { HiUserGroup, HiKey } from "react-icons/hi";
import "./RegistrationPage.css";
import Spinner from "../../Components/Spinner/Spinner";
import { Calendar, Location, TickCircle, Lock } from "iconsax-react";
import { FaFileInvoice } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const RegistrationPage = () => {
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    specialRequest: "",
  });

  // ===== PASSKEY STATES (NEW) =====
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [confirmPasskey, setConfirmPasskey] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyCreated, setPasskeyCreated] = useState(false);
  const [userHasPasskey, setUserHasPasskey] = useState(null); // null = checking

  const { title } = useParams();

  // Check if user already has a passkey (NEW)
  useEffect(() => {
    const checkUserPasskey = async () => {
      try {
        const res = await fetch("/api/passkey/status", {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setUserHasPasskey(data.hasPasskey);
        }
      } catch (err) {
        console.error("Passkey status check failed:", err);
        setUserHasPasskey(false);
      }
    };
    checkUserPasskey();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setPageLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`/api/event/${title}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        if (!data) throw new Error("Event not found");
        setEvent(data);
      } catch (err) {
        setApiError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchEvents();
  }, [title]);

  useEffect(() => {
    if (apiError) toast.error(apiError);
  }, [apiError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newError = {};
    if (!form.name.trim()) newError.name = "Full name is required";
    if (!form.email.trim()) {
      newError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newError.email = "Enter a valid email";
    }
    if (!form.phone.trim()) {
      newError.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newError.phone = "Enter a valid phone Number";
    }
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  // ===== NEW: Actual booking logic (extracted) =====
  const proceedWithBooking = async () => {
    if (!validateForm()) return;
    
    const decodedTitle = decodeURIComponent(event.title);
    const bookingData = {
      ...form,
      eventTitle: decodedTitle,
      tickets: tickets,
      eventId: event.id,
      totalAmount: event.price * tickets,
    };
    
    const res = await fetch("/api/book-ticket/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    
    if (res.ok) {
      toast.success("Booking Successful!");
      console.log(data);
    } else {
      toast.error(data.message || "Booking failed");
    }
  };

  // ===== PASSKEY CREATION HANDLER  =====
  const handleCreatePasskey = async () => {
    if (!passkey.trim()) {
      setPasskeyError("Passkey is required");
      return;
    }
    if (passkey.length < 4) {
      setPasskeyError("Passkey must be at least 4 characters");
      return;
    }
    if (passkey !== confirmPasskey) {
      setPasskeyError("Passkeys do not match");
      return;
    }

    setPasskeyLoading(true);
    setPasskeyError("");

    try {
      const res = await fetch("/api/passkey/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ passkey: passkey.trim() })
      });
      const data = await res.json();
      
      if (res.ok) {
        setPasskeyCreated(true);
        setUserHasPasskey(true);
        toast.success("Passkey created successfully! 🔐");
        
        // After passkey saved on server → NOW proceed with booking
        setTimeout(() => {
          setShowPasskeyModal(false);
          proceedWithBooking();
        }, 1000);
      } else {
        setPasskeyError(data.message || "Failed to create passkey");
      }
    } catch (err) {
      setPasskeyError("Something went wrong. Please try again.");
      console.error("Passkey creation error:", err);
    } finally {
      setPasskeyLoading(false);
    }
  };

  // ===== MODIFIED: handleBooking - Passkey FIRST, then booking =====
  async function handleBooking() {
    if (!validateForm()) return;
    
    // 🔐 STEP 1: Check if user has passkey
    let hasPasskey = userHasPasskey;
    
    // If status unknown, fetch it now
    if (hasPasskey === null) {
      try {
        const statusRes = await fetch("/api/passkey/status", { credentials: "include" });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          hasPasskey = statusData.hasPasskey;
          setUserHasPasskey(hasPasskey);
        }
      } catch (e) {
        console.error("Passkey status check failed:", e);
        hasPasskey = false;
      }
    }
    
    // 🔐 STEP 2: If NO passkey, show modal FIRST and STOP here
    if (!hasPasskey) {
      setShowPasskeyModal(true);
      return;
    }
    
    // ✅ STEP 3: User has passkey → Proceed with booking immediately
    await proceedWithBooking();
  }




  // Show loading state
  if (pageLoading) {
    return <Spinner />;
  }

  // Show nothing if no event
  if (!event) {
    return <p>No event found</p>;
  }

  const totalAmount = event.price * tickets;
  const maxTickets = Math.min(4, event.available_tickets);

  return (
    <div className="event-page">
      {/* Banner */}
      <div className="registerbanner">
        <h1>{event.title}</h1>
        <div className="datetime">
          <Calendar size="16px" color="white" />
          <span className="date">{event.date}</span>
          <Location size="16px" color="white" />
          <span className="location">{event.location}</span>
        </div>
        <span className="seats">{event.available_tickets} seats left</span>
      </div>

      {/* Security Notice */}
      <div className="security-notice">
        ⚠️ Please keep your event booking details secure and avoid sharing them with others. 
        We verify cancellation requests, but users should always protect their own information.
      </div>

      {/* Heading */}
      <h2 className="heading">Event Registration</h2>
      <p className="subtitle">
        Fill in your details to secure your spot at{" "}
        <b>{event.title}</b>
      </p>

      <div className="container">
        {/* LEFT FORM */}
        <div className="form-card">
          <div className="formheading">
            <HiUserGroup size={22} color="blue" />
            <span>Participants Details</span>
          </div>

          <label>
            Full Name <span className="required">*</span>
          </label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {error.name && <p className="errmsg">{error.name}</p>}

          <label>
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            onChange={handleChange}
            value={form.email}
            required
          />
          {error.email && <p className="errmsg">{error.email}</p>}

          <label>
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your Phone number"
            onChange={handleChange}
            value={form.phone}
            required
          />
          {error.phone && <p className="errmsg">{error.phone}</p>}

          <label>
            Number of Tickets <span className="required">*</span>
          </label>
          <select
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
          >
            {[...Array(maxTickets)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 > 1 ? "Tickets" : "Ticket"}
              </option>
            ))}
          </select>

          <label>Emergency Contact</label>
          <input
            type="text"
            value={form.emergencyContact}
            onChange={handleChange}
            placeholder="Enter emergency contact"
            name="emergencyContact"
          />

          <label>Special Requests</label>
          <textarea
            name="specialRequest"
            placeholder="Any special requests or notes"
            value={form.specialRequest}
            onChange={handleChange}
          />

          <p className="note">
            * Fields marked with <span className="required">*</span> are
            mandatory
          </p>
        </div>

        {/* Right Summary */}
        <div className="summary-card">
          <div className="summaryheading">
            <FaFileInvoice color="blue" />
            <span>Booking Summary</span>
          </div>

          <div className="summary-item">
            <span>Price per Ticket :</span>
            <b>₹{event.price}</b>
          </div>

          <div className="summary-item">
            <span>Number of Tickets :</span>
            <b>
              {tickets} {tickets > 1 ? "Tickets" : "Ticket"}
            </b>
          </div>

          <div className="divider"></div>

          <div className="summary-total">
            <span>Total Amount</span>
            <h2>₹{totalAmount}</h2>
            <p>Inclusive of Taxes & Fees</p>
          </div>

          <div className="seat-warning">
            <TickCircle size="16" color="green" />
            Only {event.available_tickets} seats left!
          </div>

          <button className="pay-btn" onClick={handleBooking}>
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* ===== PASSKEY CREATION MODAL ===== */}
      {showPasskeyModal && (
        <div className="passkey-overlay" onClick={(e) => e.target === e.currentTarget && setShowPasskeyModal(false)}>
          <div className="passkey-modal">
            {!passkeyCreated ? (
              <>
                <div className="passkey-header">
                  <Lock size="24" color="#4A6CF7" variant="Bold" />
                  <h3>Create Your Security Passkey</h3>
                </div>
                <div className="passkey-body">
                  <p>🔐 Create a secret passkey to protect your ticket cancellations. Only you can cancel tickets with this passkey.</p>
                  
                  <div className="passkey-input-group">
                    <input 
                      type="password" 
                      placeholder="Enter passkey (min 4 chars)" 
                      value={passkey}
                      onChange={(e) => { setPasskey(e.target.value); setPasskeyError(""); }}
                      className={passkeyError ? "error" : ""}
                      maxLength={20}
                    />
                  </div>
                  <div className="passkey-input-group">
                    <input 
                      type="password" 
                      placeholder="Confirm passkey" 
                      value={confirmPasskey}
                      onChange={(e) => { setConfirmPasskey(e.target.value); setPasskeyError(""); }}
                      className={passkeyError ? "error" : ""}
                      maxLength={20}
                    />
                  </div>
                  {passkeyError && <span className="passkey-error">{passkeyError}</span>}
                  <p className="passkey-hint">💡 Tip: Use something memorable but not easy to guess</p>
                </div>
                <div className="passkey-actions">
              
                  <button 
                    className="passkey-btn passkey-btn-primary" 
                    onClick={handleCreatePasskey}
                    disabled={passkeyLoading}
                  >
                    {passkeyLoading ? "Creating..." : "Create Passkey 🔐"}
                  </button>
                </div>
              </>
            ) : (
              <div className="passkey-success">
                <div className="check-icon">✓</div>
                <h3>Passkey Created!</h3>
                <p>Your tickets are now protected. Remember your passkey for future cancellations.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;