import React from "react";
import "./Skeleton.scss";

export const FeedSkeleton = () => (
  <div className="skeleton-feed">
    {[1, 2, 3].map((i) => (
      <div className="skeleton-post" key={i}>
        <div className="skeleton-post__avatar-row">
          <div className="skeleton skeleton-post__avatar" />
          <div className="skeleton skeleton-post__name" />
        </div>
        <div className="skeleton skeleton-post__image" />
        <div className="skeleton skeleton-post__line" />
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="skeleton-profile">
    <div className="skeleton-profile__header">
      <div className="skeleton skeleton-profile__avatar" />
      <div className="skeleton-profile__info">
        <div className="skeleton skeleton-profile__line skeleton-profile__line--wide" />
        <div className="skeleton skeleton-profile__line skeleton-profile__line--mid" />
        <div className="skeleton skeleton-profile__line skeleton-profile__line--narrow" />
      </div>
    </div>
    <div className="skeleton-profile__grid">
      {Array.from({ length: 9 }).map((_, i) => (
        <div className="skeleton skeleton-profile__tile" key={i} />
      ))}
    </div>
  </div>
);
