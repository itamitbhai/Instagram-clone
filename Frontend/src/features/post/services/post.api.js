import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials:true

})

export async function getFeed() {
    const response = await api.get('/api/posts/feed')
    return response.data
    
}


export async function createPost(imageFile, caption) {
    const formData = new FormData()

    formData.append("image", imageFile)
    formData.append('caption', caption)

    const response = await api.post("/api/posts", formData)

    return response.data
}

export async function deletePost(postId) {
    console.log("DELETE API HIT:", postId)  // 👈 ADD THIS
    const response = await api.delete("/api/posts/" + postId)
    return response.data
}
export async function likePost(postId) {
    console.log("POST ID:", postId)  

    const response = await api.post("/api/posts/like/" + postId)
    return response.data
}

export async function unLikePost(postId) {
    const response = await api.post("/api/posts/unlike/" + postId)
    return response.data
}
//  ADD COMMENT
export async function addComment(postId, text) {
    const response = await api.post("/api/posts/comment/" + postId, {
        text
    })
    return response.data
}

//  GET COMMENTS
export async function getComments(postId) {
    const response = await api.get("/api/posts/comment/" + postId)
    return response.data.comments
}

//  delete comment

export async function deleteComment(commentId) {
    const res = await api.delete("/api/posts/comment/" + commentId)
    return res.data
}

export async function getUserProfile(username) {
    const res = await api.get("/api/posts/user/" + username)
    return res.data
}