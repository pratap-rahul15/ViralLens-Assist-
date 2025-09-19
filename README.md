
# 🤖 ViralLens Assist

**ViralLens Assist** is a **full-stack AI-powered customer support chatbot.**
Users can sign up, log in, and chat with an intelligent assistant that provides real-time responses using the **OpenRouter API (GPT-4o-mini model).**

The app is built with a **React + Vite frontend** and a **Node.js + Express + MongoDB Atlas backend**, fully containerized with **Docker** and **deployed** on **Vercel (frontend)** and **Render (backend).**

Visit the project at

https://viral-lens-assist.vercel.app/

## ✨ Features

- 🔐 JWT Authentication: Secure sign-up, login, and protected routes.

- 💬 Chat with AI: Conversations powered by OpenRouter LLM.

- 📜 Conversation History: Each user can maintain multiple sessions.

- 🗑️ Delete Conversations: Option to remove past chats.

- 🚀 Responsive UI: Clean, modern design with React and CSS.

- 🐳 Dockerized: Both frontend & backend fully containerized for easy deployment.

## 🧠 How AI Works

- The backend integrates with OpenRouter API using your API key.

- Each user message is sent to the model (gpt-4o-mini).

- The AI generates a contextual reply which is stored in MongoDB along with the conversation history.

- When the user comes back, they can view or continue past conversations.

## 🛠️ Tech Stack
### Frontend (Client)

- ⚛️ React + Vite

- React Router DOM

- Custom CSS (App.css)

- Backend (Server)

- Node.js + Express

- MongoDB Atlas

- JWT Authentication

- Bcrypt.js (password hashing)

- Axios (AI API calls)

- UUID (conversation IDs)

- Dotenv (env config)

- CORS middleware

### Deployment

- Frontend → Vercel

- Backend → Render

- Containerization → Docker & Docker Compose

### 🖥️ Local Setup (Clone & Run)

1️⃣ Clone the Repository

```
git clone https://github.com/pratap-rahul15/ViralLens-Assist-.git
cd ViralLens-Assist-

```

2️⃣ Setup Backend
```
cd server
npm install
```

Create a .env file in server

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
```
Run locally:
```
npm run dev
```

3️⃣ Setup Frontend

```
cd ../client
npm install
```

Create a .env file in client

```
VITE_API_URL=http://localhost:5000/api
```

Run locally:
```
npm run dev
```

4️⃣ Open in Browser
```
Frontend → http://localhost:5173

Backend → http://localhost:5000
```

## 🎉 Verdict

ViralLens Assist demonstrates how to build a **production-ready AI chatbot** using modern web technologies, **JWT authentication**, **persistent chat history**, and **LLM integration via OpenRouter**.

Made with ❤️ by Rahul Pratap Singh
