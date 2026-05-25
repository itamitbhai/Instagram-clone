import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// ✅ TOKEN CONFIG
const getAuthConfig = () => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ================= GET FEED =================
export async function getFeed() {

  const response = await api.get(
    "/api/posts/feed",
    getAuthConfig()
  );

  return response.data;
}

// ================= CREATE POST =================
export async function createPost(
  imageFile,
  caption
) {

  const formData = new FormData();

  formData.append("image", imageFile);

  formData.append("caption", caption);

  const response = await api.post(
    "/api/posts",
    formData,
    getAuthConfig()
  );

  return response.data;
}

// ================= DELETE POST =================
export async function deletePost(postId) {

  const response = await api.delete(
    "/api/posts/" + postId,
    getAuthConfig()
  );

  return response.data;
}

// ================= LIKE POST =================
export async function likePost(postId) {

  const response = await api.post(
    "/api/posts/like/" + postId,
    {},
    getAuthConfig()
  );

  return response.data;
}

// ================= UNLIKE POST =================
export async function unLikePost(postId) {

  const response = await api.post(
    "/api/posts/unlike/" + postId,
    {},
    getAuthConfig()
  );

  return response.data;
}

// ================= ADD COMMENT =================
export async function addComment(
  postId,
  text
) {

  const response = await api.post(
    "/api/posts/comment/" + postId,
    { text },
    getAuthConfig()
  );

  return response.data;
}

// ================= GET COMMENTS =================
export async function getComments(postId) {

  const response = await api.get(
    "/api/posts/comment/" + postId,
    getAuthConfig()
  );

  return response.data.comments;
}

// ================= DELETE COMMENT =================
export async function deleteComment(commentId) {

  const response = await api.delete(
    "/api/posts/comment/" + commentId,
    getAuthConfig()
  );

  return response.data;
}

// ================= USER PROFILE =================
export async function getUserProfile(username) {

  const response = await api.get(
    "/api/posts/user/" + username,
    getAuthConfig()
  );

  return response.data;
}