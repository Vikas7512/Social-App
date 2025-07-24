import { Outlet } from "react-router-dom";
import Leftbar from "../leftbar/Leftbar";
import Navbar from "../navbar/Navbar";
import Rightbar from "../rightbar/Rightbar";
import "../../style.scss";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Layout = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <Leftbar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <Rightbar />
        </div>
      </div>
    </QueryClientProvider>
  );
};
