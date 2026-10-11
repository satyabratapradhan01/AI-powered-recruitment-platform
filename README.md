# HireFlow AI — AI-Powered Recruitment & Application Tracker

HireFlow AI is a modern full-stack web application designed for intelligent job application tracking, automated candidate resume screening (ATS score matching), AI interview preparation, offer letter management, and role-based recruitment workflows.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Routing**: React Router v7 (SPA with client-side navigation)
- **HTTP Client**: Axios with JWT interceptors & unified base URL handler

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose 9 ODM
- **Authentication**: Stateless JWT Bearer tokens + bcryptjs password hashing
- **File Processing**: Multer (`memoryStorage`), `pdf-parse`, and `mammoth` (DOCX extraction)
- **Cloud Storage**: Cloudflare R2 / AWS S3 SDK for secure resume storage
- **AI Integrations**: Google Gemini API & Groq API for ATS scoring and interview prep
- **Email Delivery**: Nodemailer (SMTP)

---

## 📁 Repository Structure

```text
HireFlow-AI/
├── client/                      # Frontend Application (React + Vite)
│   ├── public/                  # Public assets (favicon, logos)
│   ├── src/
│   │   ├── assets/              # Static bundled images & brand assets
│   │   ├── components/          # Reusable UI & Layout components
│   │   ├── context/             # React Contexts (AuthContext, ToastContext)
│   │   ├── pages/               # Job Seeker, HR, Admin, & Public pages
│   │   │   ├── admin/           # Admin portal pages
│   │   │   └── hr/              # HR recruiter portal pages
│   │   ├── services/            # Centralized API service client (api.js)
│   │   ├── App.jsx              # Main React route declaration
│   │   ├── index.css            # Global Tailwind CSS entry
│   │   └── main.jsx             # React DOM entry
│   ├── .env.example             # Frontend environment documentation
│   ├── .gitignore               # Frontend gitignore
│   ├── package.json             # Frontend dependencies & build scripts
│   ├── vercel.json              # Frontend SPA fallback rewrite configuration
│   └── vite.config.js           # Vite build & proxy settings
│
├── server/                      # Backend API (Express + Node.js)
│   ├── api/
│   │   └── index.js             # Vercel serverless function entrypoint
│   ├── config/
│   │   ├── db.js                # Cached MongoDB connection handler
│   │   └── r2Client.js          # Cloudflare R2 / S3 client configuration
│   ├── controllers/             # Express request & response controllers
│   ├── middleware/              # Auth, RBAC, file upload & error middlewares
│   ├── models/                  # Mongoose data models (User, Job, Application, etc.)
│   ├── routes/                  # Modular Express router declarations
│   ├── services/                # Business logic (AI, ATS, Resumes, Email, Auth)
│   ├── utils/                   # Async handler, seed admin, API response helpers
│   ├── app.js                   # Express application instance & middleware chain
│   ├── index.js                 # Universal serverless export
│   ├── server.js                # Standalone Node.js entrypoint (app.listen)
│   ├── run_full_e2e_suite.js    # Comprehensive end-to-end test suite
│   ├── .env.example             # Backend environment documentation
│   ├── .gitignore               # Backend gitignore
│   ├── package.json             # Backend dependencies & scripts
│   └── vercel.json              # Backend serverless rewrite configuration
│
├── .gitignore                   # Monorepo root gitignore
├── package.json                 # Monorepo development scripts orchestrator
└── README.md                    # Project documentation
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18 or later
- **npm**: v9 or later
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/satyabratapradhan01/AI-powered-recruitment-platform.git
cd AI-powered-recruitment-platform

# Install frontend dependencies
cd client
npm install
cd ..

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Variables Configuration

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory copying from `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/job_tracker

# JWT Secret Key
JWT_SECRET=super_secret_jwt_key_12345

# Initial Admin Credentials
ADMIN_EMAIL=admin@platform.com
ADMIN_PASSWORD=Admin@123456

# AI Feature Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
EMAIL_FROM=no-reply@hireflow.com

# Cloudflare R2 / S3 Storage (Optional for local dev, uses memory buffer)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=resume-storage
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory copying from `client/.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running the Development Servers
Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Frontend running at http://localhost:5173
```

---

## 🌐 Separate Vercel Deployment Instructions

Deploying the frontend and backend as two independent Vercel projects offers decoupled scaling, clean logging, and optimal performance.

### Project 1: Backend Deployment (`server`)

1. Go to [Vercel](https://vercel.com) &rarr; **Add New…** &rarr; **Project**.
2. Select the repository: `AI-powered-recruitment-platform`.
3. In **Project Configuration**:
   - **Project Name**: `hireflow-backend` (or your choice)
   - **Framework Preset**: **Other**
   - **Root Directory**: Click **Edit** &rarr; select **`server`**
   - **Build Command**: Leave default (`npm run build`)
   - **Output Directory**: Leave empty
4. Add the **Environment Variables** in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas URI (`mongodb+srv://...`)
   - `JWT_SECRET`: A secure random secret string
   - `NODE_ENV`: `production`
   - `ADMIN_EMAIL`: `admin@platform.com`
   - `ADMIN_PASSWORD`: Your chosen admin password
   - `GEMINI_API_KEY`: Your Gemini API key
   - `GROQ_API_KEY`: Your Groq API key
   - `SMTP_USER` / `SMTP_PASSWORD`: (if sending notification emails)
   - `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET_NAME` / `R2_ENDPOINT`: (if storing resumes on R2)
5. Click **Deploy**.
6. Once deployed, note down your production backend URL:
   `https://<your-backend>.vercel.app`
7. Verify the backend health endpoint:
   `https://<your-backend>.vercel.app/api/health` &rarr; returns `{ "status": "success", "message": "HireFlow AI Backend API is running" }`.

---

### Project 2: Frontend Deployment (`client`)

1. In Vercel, click **Add New…** &rarr; **Project**.
2. Select the **same** GitHub repository (`AI-powered-recruitment-platform`).
3. In **Project Configuration**:
   - **Project Name**: `hireflow-frontend` (or your choice)
   - **Framework Preset**: **Vite**
   - **Root Directory**: Click **Edit** &rarr; select **`client`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the **Environment Variable**:
   - `VITE_API_BASE_URL`: `https://<your-backend>.vercel.app/api` *(replace with your deployed backend URL from Project 1)*
5. Click **Deploy**.
6. Once deployed, visit your frontend URL (e.g., `https://<your-frontend>.vercel.app`).

---

## 🔒 Cloud Service Configurations

### 1. MongoDB Atlas Setup
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Go to **Network Access** &rarr; **Add IP Address** &rarr; select **Allow Access from Anywhere (`0.0.0.0/0`)**.
  *(Required because Vercel Serverless Functions execute on dynamic IP addresses).*
- Go to **Database Access** &rarr; create a database user and assign Read & Write permissions.
- Copy your connection string into `MONGODB_URI`.

### 2. Cloudflare R2 Storage Setup
- In your Cloudflare dashboard, navigate to **R2 Object Storage** &rarr; create a bucket named `resume-storage`.
- In bucket settings, create an **R2 API Token** with `Object Read & Write` permissions.
- Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, and `R2_ENDPOINT` in backend environment variables.

### 3. SMTP Email Setup
- If using Gmail: Enable **2-Step Verification** on your Google Account &rarr; generate an **App Password** (16 characters).
- Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=your_email@gmail.com`, and `SMTP_PASSWORD=your_16_char_app_password`.

---

## 🧪 Testing & Verification

### Running the End-to-End Suite
To run the automated backend test suite (testing auth, jobs, applications, ATS scoring, and permissions):
```bash
cd server
npm run test:e2e
```

### Verifying Frontend Build
```bash
cd client
npm run build
```

---

## ❓ Common Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| **500 FUNCTION_INVOCATION_FAILED** | Missing serverless entrypoint or uncaught DB connection error | Verify `server/api/index.js` exists and `MONGODB_URI` is configured in Vercel. Ensure MongoDB Atlas network access has `0.0.0.0/0`. |
| **404 on page refresh on frontend** | SPA routing not rewriting to `index.html` | Ensure `client/vercel.json` contains the `/(.*) -> /index.html` rewrite rule. |
| **CORS error on API requests** | Origin header rejected | Backend already allows `origin: true`. Ensure `VITE_API_BASE_URL` in frontend project settings is pointing to the correct deployed backend URL. |
| **Frontend calls localhost in production** | `VITE_API_BASE_URL` was added after building | Vite embeds environment variables at build time. Go to Vercel Deployments &rarr; click `...` &rarr; **Redeploy** to rebuild with the new variable. |
