// import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const layout = () => {
  return (
    <>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default layout;
