import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
const MainLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      
      <Sidebar />  

      <div style={{ marginLeft: "80px",
          width: "100%",
          transition: "margin-left 0.3s ease"
        }}>
        <Outlet />
      </div>

    </div>
  );
};

export default MainLayout;