
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';

function EmailCard() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // validate email while typing
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(regex.test(value));
  };

  // send otp
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      setError(" ");

      const res = await fetch("http://localhost:8000/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send OTP");

      navigate(`/otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const helperColor = isValid === false ? "red" : "#777";
  const helperText =
    isValid === false
      ? "Invalid email"
      : "We'll send a one-time password to this email";

  return (
    <div className="outerlayer">
      <div id="login-card">
        <h1>Welcome back!</h1>
        <p>Enter your email to receive your OTP</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
            placeholder="example@email.com"
          />

          <p id="emailhelper" style={{ color: helperColor }}>
            {helperText}
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button id="getotpbtn" disabled={!isValid || loading}>
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailCard;
