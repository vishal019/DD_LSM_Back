<<<<<<< HEAD
# Digital Diaries - Resort Leads Node.js Backend

High-performance Express & MySQL backend for Digital Diaries lead capture, ready for **Render** deployment.

---

## 1. Local Setup & Testing

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. In `.env`, add your Hostinger MySQL password:
   ```env
   DB_PASSWORD=YOUR_ACTUAL_HOSTINGER_PASSWORD
   ```
3. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The server will start at `http://localhost:5000`.

---

## 2. Deploy to Render (Free Web Service)

1. **Push your code to GitHub** (or just the `backend` folder/repository).
2. Go to [Render Dashboard](https://dashboard.render.com/) &rarr; Click **New +** &rarr; Select **Web Service**.
3. Connect your repository:
   - If deploying the whole monorepo, set **Root Directory** to: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables** in Render:
   - `PORT`: `5000` (or leave default, Render sets `PORT` automatically)
   - `DB_HOST`: `srv1881.hstgr.io`
   - `DB_PORT`: `3306`
   - `DB_USER`: `u774474676_dd_leads`
   - `DB_NAME`: `u774474676_dd_leads`
   - `DB_PASSWORD`: *(Your Hostinger MySQL password)*
   - `ALLOWED_ORIGIN`: `*`
5. Click **Create Web Service**. Render will assign you a live HTTPS URL like:
   `https://dd-leads-backend.onrender.com`

---

## 3. Crucial Hostinger Step: Enable "Remote MySQL"

Because Render runs in the cloud (outside of Hostinger's local network), Hostinger's firewall will block Render unless you allow remote connections:

1. Open your **Hostinger hPanel**.
2. Navigate to **Databases** &rarr; **Remote MySQL**.
3. Under **Create a remote connection**:
   - **IP (IPv4 or IPv6)**: Enter `%` (the percent symbol allows connections from any external server like Render/localhost).
   - **Database**: Select `u774474676_dd_leads`.
4. Click **Create**.
=======
# DD_LSM_Back
>>>>>>> 886f74de41e8514ba39e5479fcd7bd226bececeb
