# 🚀 Render Deployment Guide - Step-by-Step

This guide walks you through deploying your Instagram-clone web app on **Render.com** (both Backend and Frontend) using their free plan.

---

## 🛠️ Step 1: Deploy Backend (Render Web Service)

Render will host your Node.js backend as a **Web Service**.

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository containing the project.
3. Configure the following settings for the backend:
   - **Name**: `insta-backend` (or any custom name)
   - **Root Directory**: `Project-01/Backend` *(Crucial! Tells Render to build from Backend folder)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (or `npm start`)
   - **Instance Type**: `Free`

4. Click **Advanced** and add the following **Environment Variables**:
   - `PORT`: `3000`
   - `MONGO_URI`: `mongodb+srv://...` *(Your MongoDB connection string)*
   - `JWT_SECRET`: `your_random_jwt_secret`
   - `IMAGEKIT_PRIVATE_KEY`: `your_imagekit_private_key`
   - `CORS_ORIGIN`: `https://your-frontend-domain.onrender.com` *(You will get this URL in Step 2! Update it here once created)*

5. Click **Create Web Service**. Render will now build and host your backend. Note down the live URL provided by Render (e.g., `https://insta-backend.onrender.com`).

---

## 💻 Step 2: Deploy Frontend (Render Static Site)

Render will host your Vite frontend as a **Static Site** for free.

1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the following settings for the frontend:
   - **Name**: `insta-frontend` (or any custom name)
   - **Root Directory**: `Project-01/Frontend` *(Crucial! Tells Render to build from Frontend folder)*
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist` *(Vite outputs build files here)*
   - **Instance Type**: `Free`

4. Click **Advanced** and add the following **Environment Variable**:
   - `VITE_API_URL`: `https://insta-backend.onrender.com` *(Replace this with your actual Backend URL from Step 1!)*

5. Click **Create Static Site**.

---

## 🔗 Step 3: Link CORS in Backend

Once your Frontend Static Site is created, copy its Render URL (e.g., `https://insta-frontend.onrender.com`).

1. Go back to your Backend Web Service dashboard on Render.
2. Under **Environment Variables**, update `CORS_ORIGIN` to match your exact Frontend URL (e.g. `https://insta-frontend.onrender.com`).
3. Save the changes. Render will automatically redeploy the backend with CORS configured!

🎉 **Congratulations! Your application is now live in production!**
