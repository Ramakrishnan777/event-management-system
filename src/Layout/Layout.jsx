import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";


const Layout = () => {
    const [isOpen,setIsOpen]=useState(false);
  return (
    <>
    <button className="burger" onClick={()=>setIsOpen(true)}> ☰</button>
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>

    <Outlet />
    </>
  )
}

export default Layout