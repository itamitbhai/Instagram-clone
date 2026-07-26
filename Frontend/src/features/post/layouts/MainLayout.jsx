import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SearchPanel from "../components/SearchPanel";
import NotificationPanel from "../components/NotificationPanel";
import PageTransition from "../../shared/components/PageTransition";
import { useLenis } from "../../shared/hooks/useLenis";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/layout.scss";

const MainLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useAuth();

  useLenis();

  const handleToggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    setIsNotificationOpen(false); // Close notifications when opening search
  };

  const handleToggleNotifications = () => {
    setIsNotificationOpen(prev => !prev);
    setIsSearchOpen(false); // Close search when opening notifications
  };

  return (
    <div className="layout">
      <Header/>
      <Sidebar 
        isSearchOpen={isSearchOpen} 
        toggleSearch={handleToggleSearch} 
        isNotificationOpen={isNotificationOpen}
        toggleNotifications={handleToggleNotifications}
      />
      <SearchPanel 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
        userId={user?._id}
      />

      <div className="mainContent">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>

    </div>
  );
};

export default MainLayout;