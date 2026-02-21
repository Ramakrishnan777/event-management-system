import {useState,useEffect} from "react";
import "../../GlobalEvents.css";
import "./EventList.css"

export default function EventsPage() {
  const [search,setSearch]=useState("");
  const [currentpage,setCurrentPage]=useState(1);
  const [events,setEvents]=useState([]);
  const eventsPerPage=6;

  // fetch data
  useEffect(()=>{
    async function fetchEvents(){
      try{
        const res=await fetch("/data/events.json")
        const data = await res.json()
        setEvents(data)
      }
      catch(e){
        console.log(e);
      }
    }
    fetchEvents()
  },[])

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  //search logic
  const filterEvents=events.filter((events)=>{
    const text=search.toLowerCase();
    return(
      events.title.toLowerCase().includes(text)||
      events.category.toLowerCase().includes(text)||
      events.location.toLowerCase().includes(text)
    )
  })

  //pagination math
  const lastIndex=currentpage*eventsPerPage;
  const firstIndex=lastIndex-eventsPerPage;
  const currentEvents=filterEvents.slice(firstIndex,lastIndex);
  const totalPages=Math.ceil(filterEvents.length/eventsPerPage)

  return (
    <div className="results-page" style={{backgroundColor: 'lightgray', minHeight: '100vh'}}>
      {/* Search bar (static) */}
      <header className="header">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search events" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </header>

      {/* Events Grid */}
      <div className="events-grid-container">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <div key={event.id} className="reusable-event-card">
              <img src={event.image || "/images/conferenceEvent.jpg"} alt={event.title} />
              <div className="card-body">
                <span className="event-category">{event.category}</span>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-info">📅 {event.date} · {event.time}</div>
                <div className="event-info">📍 {event.location}</div>
                <div className="card-footer">
                  <span className="event-price">{event.price}</span>
                  <button className="gradient-ticket-btn">Get Ticket</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">No events found for your search 😕</div>
        )}
      </div>

      {/* Pagination */}
      <footer className="pagination">
        <button disabled={currentpage===1} onClick={()=>setCurrentPage(currentpage-1)}>Previous</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <span key={i} className={`page-number ${currentpage === i + 1 ? "active" : ""}`} >
            {i + 1}
          </span>
        ))}
        <button disabled={currentpage===totalPages} onClick={()=>setCurrentPage(currentpage+1)}>Next</button>
      </footer>
    </div>
  )
}
