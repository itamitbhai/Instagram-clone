import React from "react";

const Logo = ({ iconOnly = false, size = 28, className = "" }) => (
  <div className={`meetupx-logo ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="13" fill="url(#meetupx-logo-grad)" />
      <path
        d="M12 34V14L24 26L36 14V34"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="3.4" fill="#47bfff" stroke="#ffffff" strokeWidth="1.4" />
      <defs>
        <linearGradient id="meetupx-logo-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#863bff" />
          <stop offset="1" stopColor="#47bfff" />
        </linearGradient>
      </defs>
    </svg>

    {!iconOnly && <span className="meetupx-logo__text">MeetUpX</span>}
  </div>
);

export default Logo;
