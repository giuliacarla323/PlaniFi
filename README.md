# PlaniFi - Personal Resource Management Platform

PlaniFi is a full-stack web application designed to help users efficiently manage their two most valuable personal resources: time and mone. By integrating task organization with financial planning into a single, cohesive digital tool, PlaniFi addresses the limitations of isolated productivity apps.

## 🚀 Key Features

- **Task Manager**: Organize daily activities with event scheduling, to-do lists, and contact logs (calls/emails). Includes a real-time note-taking feature.
- **Budget Planner**: Comprehensive monthly financial overview. [cite_start]Users can set budgets for up to 8 categories (House, Bills, Groceries, etc.), track expenses, and monitor their total balance.
- **Split with Friends**: Manage shared group expenses (e.g., trips, shared rent) with custom splitting logic and a "Settle Up" confirmation system.
- **Financial Reporting**: Ability to generate and export detailed monthly budget reports in PDF format.
- **Authentication**: Secure user access via email/password authentication and account management.

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework for building reactive interfaces.
- **Vite**: Modern frontend tooling for fast development and optimized builds.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Pinia**: State management for the Vue application.

### Backend
- **Node.js & Express.js**: Minimalist and flexible web framework for the server-side logic.
- **Supabase**: Open-source Backend-as-a-Service (BaaS) providing authentication and a RESTful API.
- **PostgreSQL**: Robust relational database managed via Supabase.

## 🏗️ Architecture

The application follows a **Client-Server architecture**. 
- The **Frontend** communicates with the server via HTTP requests using **Axios**.
- The **Backend** is organized modularly into **Controllers**, **Models**, **Services**, and **Routes** to ensure scalability and maintainability.

## 🧪 Testing & Validation

The application was validated through a testing phase with 10 users. It achieved high satisfaction scores, with a **4.6/5** for the authentication process and **4.5/5** for the Budget Planner's intuitiveness.

## 🏁 Getting Started

1. **Clone the repository**
2. **Setup Frontend**: 
   - `cd frontend`
   - `npm install`
   - `npm run dev`
3. **Setup Backend**:
   - `cd backend`
   - `npm install`
   - Create a `.env` file with your Supabase credentials.
   - `node index.js`
