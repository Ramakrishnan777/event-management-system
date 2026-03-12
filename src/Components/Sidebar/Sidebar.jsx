import {useNavigate,Link} from "react-router-dom"
import { FaHome, FaCalendarAlt, FaList, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css"




const Sidebar = ({isOpen,setIsOpen}) => {
    const navigate=useNavigate()
 const handleLogout = async () => {
 
    await fetch("/api/logout/", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };
  return (
    <>
    <div className={`sidebar-overlay ${isOpen?"show":""}`} onClick={()=>setIsOpen(false)}></div>
      <div className={`sidebar ${isOpen?"open":""}`}>

        <nav>
        <Link to="/" onClick={() => setIsOpen(false)} className="nav-item">
        <FaHome /> Home
        </Link>
         <Link to="/eventlist" onClick={() => setIsOpen(false)} className="nav-item">
        <FaCalendarAlt /> All Events
        </Link>
         <Link to="/myevents" onClick={() => setIsOpen(false)} className="nav-item">
        <FaList/> My Events
        </Link>
           <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
        </nav>
        
      </div>
      </>
  )
}

export default Sidebar