import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './login.css';
import ButtonSpinner from '../../Components/Spinner/ButtonSpinner';

function OtpCard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // get email from URL
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // countdown timer
  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  // OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8000/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      if (!response.ok) throw new Error("Invalid OTP");

      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // resend OTP
  const resendOtp = async () => {
    if (seconds > 0) return;
    setSeconds(30);
    setError("");
    try {
      await fetch("http://localhost:8000/resend-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="outerlayer">
      <div id="login-card">
        <h1>Enter OTP</h1>
        <p>Enter the OTP sent to your email</p>
        <p style={{ color: "#777" }}>{email}</p>

        <form onSubmit={handleSubmit}>
          <div id="otpbox">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                className="otpinput"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                required
              />
            ))}
          </div>
          
          <button id="loginbtn" disabled={loading}>
            {loading && <ButtonSpinner />}
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p>
          Didn't receive OTP?
          <span
            id="resendotp"
            className={`Resend ${seconds ? "disabled" : ""}`}
            onClick={resendOtp}
          >
            Resend OTP ({seconds}s)
          </span>
        </p>
        
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}

export default OtpCard;