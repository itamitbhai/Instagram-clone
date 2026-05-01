import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../style/layout.scss"; // 👈 add this

const MainLayout = () => {
  return (
    <div className="layout">
      
      <Sidebar />

      <div className="mainContent">
        <Outlet />
      </div>

    </div>
  );
};

export default MainLayout;