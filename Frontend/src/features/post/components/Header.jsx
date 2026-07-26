import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import Notification from "./Notification";
import Logo from "../../shared/components/Logo";
import "../style/header.scss";

const Header = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  return (
    <div className="mobile-header">
      <div className="mobile-header__logo"><Logo size={26} /></div>

      <div className="mobile-header__actions">
        <Notification userId={user?._id} />
        <div
          className="mobile-header__logout"
          onClick={() => { handleLogout(); navigate("/login"); }}
        >
          <LogOut />
        </div>
      </div>
    </div>
  );
};

export default Header;