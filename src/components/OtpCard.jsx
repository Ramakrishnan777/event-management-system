import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpCard() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    try {
      const response = await fetch("http://localhost:8000/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save session details in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        alert("Login success");

        // Navigate to MainPage
        navigate("/main");
      }

    } catch (err) {
  console.log("Backend not ready:", err);

  alert("DEV mode: temporary fake session")
  localStorage.setItem("user", JSON.stringify({ email })); // store fake user
  localStorage.setItem("token", "DEV_TOKEN");             // store fake token

  alert("DEV mode: Navigating to Main Page");             // notify
  navigate("/main");                                     // go to main page
}

  };

  const resendOtp = async () => {
    if (seconds > 0) return;

    setSeconds(30);

    await fetch("http://localhost:8000/resend-otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="outerlayer">
      <div id="otp-card">
        <h1> Enter the OTP sent to your email</h1>
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
          <button id="loginbtn">Login</button>
        </form>
        <p>
          Didn't receive OTP ?
          <span
            id="resendotp"
            className={`Resend ${seconds ? "disabled" : ""}`}
            onClick={resendOtp}
          >
            {" "}Resend OTP (<span id="timer">{seconds}</span>s)
          </span>
        </p>
      </div>
    </div>
  );
}

export default OtpCard;
