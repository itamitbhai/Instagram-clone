export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getUserAvatar = (user) => {
  if (!user) {
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231c1c1e'/><path d='M50 50c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 10c-15 0-40 8-40 23v7h80v-7c0-15-25-23-40-23z' fill='%23a8a8a8'/></svg>`;
  }

  // extract the path from user object or string path
  let path = typeof user === "string" ? user : (user.profileImage || user.profilePic);

  const defaultSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%231c1c1e'/><path d='M50 50c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 10c-15 0-40 8-40 23v7h80v-7c0-15-25-23-40-23z' fill='%23a8a8a8'/></svg>`;

  if (!path || typeof path !== "string" || path.includes("default-avatar.png") || path.includes("images.jpeg") || path === "https://i.pravatar.cc/40") {
    return defaultSvg;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (path.includes("localhost:3000")) {
      return path.replace("http://localhost:3000", API_BASE_URL);
    }
    return path;
  }

  // Ensure leading slash and uploads prefix
  if (path.startsWith("/uploads/") || path.startsWith("uploads/")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  }

  return `${API_BASE_URL}/uploads/${path}`;
};
