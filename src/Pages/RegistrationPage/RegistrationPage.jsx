import { useState, useEffect } from "react";
import { HiUserGroup } from "react-icons/hi";
import "./RegistrationPage.css";
import Spinner from "../../Components/Spinner/Spinner";
import { Calendar, Location, TickCircle } from "iconsax-react";
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

  const { title } = useParams();

  useEffect(() => {
    const fetchEvents = async () => {
      setPageLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`/api/events/${title}`);
        
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

  // Show api error
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
    }
  }, [apiError]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form validate function
  const validateForm = () => {
    const newError = {};
    if (!form.name.trim()) {
      newError.name = "Full name is required";
    }
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
    return Object.keys(newError).length === 0; // checks whether the form has any validation errors
  };

  // Handle booking submit
  async function handleBooking() {
    if (!validateForm()) {
      return;
    }
    const bookingData = {
      ...form,
      title,
      tickets,
      eventId: event.id,
      totalAmount: event.ticketprice * tickets,
    };
    try {
      const res = await fetch("/api/book-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    } catch (err) {
      console.error("Booking error", err);
      toast.error("Something went wrong while booking");
    }
  }

  // Show loading state
  if (pageLoading) {
    return <Spinner />;
  }

  // Show nothing if no event
  if (!event) {
    return <p>No event found</p>;
  }

  const totalAmount = event.ticketprice * tickets;
  const maxTickets = Math.min(4, event.tickets.available);

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
        <span className="seats">{event.tickets.available} seats left</span>
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
        <b>Tech Conference 2026</b>
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
            <b>₹{event.ticketprice}</b>
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
            Only {event?.tickets?.available} seats left!
          </div>

          <button className="pay-btn" onClick={handleBooking}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;