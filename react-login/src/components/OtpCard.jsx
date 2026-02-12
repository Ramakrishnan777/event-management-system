import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function OtpCard() {

  // get email from router state
  const location = useLocation();
  const email = location.state?.email;


  // store 4 OTP digits
  const [otp, setOtp] = useState(["", "", "", ""]);

  // countdown timer
  const [seconds, setSeconds] = useState(30);


  // TIMER (runs every second)
  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);


  // HANDLE INPUT CHANGE
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };


  // HANDLE BACKSPACE
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };


  // SUBMIT OTP TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    try {
      await fetch("http://localhost:8000/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      alert("Login success");

    } catch {
      alert("DEV mode: backend not ready");
    }
  };


  // RESEND OTP
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
