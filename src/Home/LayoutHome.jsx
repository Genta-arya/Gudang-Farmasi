import React from "react";
import Navbar from "../components/navbar";
import MenuList from "./MenuList";
import IPLocal from "../components/IPLocal";

const LayoutHome = () => {


  
  return (
    <>
      <Navbar />
      <IPLocal />

      <MenuList />
    </>
  );
};

export default LayoutHome;
