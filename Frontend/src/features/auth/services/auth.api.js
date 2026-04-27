import axios from "axios";

//  AUTH API
const authApi = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
});

//  USER API (IMPORTANT)
const userApi = axios.create({
    baseURL: "http://localhost:3000/api/users",
    withCredentials: true,
});

// LOGIN
export async function login(email, password) {
    const res = await authApi.post("/login", { email, password });
    return res.data;
}

// REGISTER
export async function register(username, email, password) {
    const res = await authApi.post("/register", { username, email, password });
    return res.data;
}

// GET CURRENT USER
export async function getMe() {
    const res = await authApi.get("/get-me");
    return res.data;
}

//  FOLLOW
export async function followUser(username) {
    const res = await userApi.post("/follow/" + username);
    return res.data;
}

//  UNFOLLOW
export async function unfollowUser(username) {
    const res = await userApi.post("/unfollow/" + username);
    return res.data;
}

export async function updateProfile(data) {
    const res = await userApi.put("/edit", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return res.data
}
