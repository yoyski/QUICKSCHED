import { Outlet } from "react-router-dom";
import { Navigation } from "./components/navigation.jsx";

export const Layout = () => {
  return (
    <>
      <Navigation />
      <Outlet /> 
    </>
  )
}