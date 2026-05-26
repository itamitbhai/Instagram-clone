import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../style/layout.scss"; 

const MainLayout = () => {
  return (
    <div className="layout">
      <Header/>
      <Sidebar />

      <div className="mainContent">
        <Outlet />
      </div>

    </div>
  );
};

export default MainLayout;