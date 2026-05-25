import axios from "axios";

// ================= AXIOS INSTANCES =================
const authApi = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
});

const userApi = axios.create({
    baseURL: "http://localhost:3000/api/users",
    withCredentials: true
});

// ================= TOKEN ATTACH =================
const attachToken = (config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
};

authApi.interceptors.request.use(attachToken);
userApi.interceptors.request.use(attachToken);

// ================= AUTH =================
export async function login(email, password) {
    const res = await authApi.post("/login", { email, password });

    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
    }

    return res.data;
}

export async function register(username, email, password) {
    const res = await authApi.post("/register", {
        username,
        email,
        password,
    });

    if (res.data.token) {
        localStorage.setItem("token", res.data.token);
    }

    return res.data;
}

export async function getMe() {

  const token = localStorage.getItem("token");

  const res = await authApi.get("/get-me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// ================= USER =================
export async function followUser(username) {
    const res = await userApi.post("/follow/" + username);
    return res.data;
}

export async function unfollowUser(username) {
    const res = await userApi.post("/unfollow/" + username);
    return res.data;
}

export async function updateProfile(data) {
    const res = await userApi.put("/edit", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
}

// ================= LOGOUT =================
export function logout() {
    localStorage.removeItem("token");
}