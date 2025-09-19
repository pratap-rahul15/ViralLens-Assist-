import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Chat() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load all conversations
  const loadConversations = async () => {
    try {
      const res = await API.get("/chat/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  // Load a specific conversation
  const loadMessages = async (id) => {
    try {
      setConversationId(id);
      const res = await API.get(`/chat/history/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
  };

  // Delete a conversation
  const deleteConversation = async (id) => {
    try {
      await API.delete(`/chat/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (conversationId === id) {
        setMessages([]);
        setConversationId(null);
      }
      loadConversations();
    } catch (err) {
      console.error("Failed to delete conversation", err);
      alert(
        "Failed to delete conversation: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setTyping(true);
    try {
      const res = await API.post(
        "/chat/send",
        { message: input, conversationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversationId(res.data.conversationId);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: res.data.reply },
      ]);
      setInput("");
      loadConversations();
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>💬 Conversations</h3>
        <button
          onClick={startNewConversation}
          style={{
            marginBottom: "15px",
            padding: "8px",
            background: "#4f46e5",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ➕ New Chat
        </button>
        <ul>
          {conversations.map((c) => (
            <li
              key={c.conversationId}
              className={conversationId === c.conversationId ? "active" : ""}
            >
              <div onClick={() => loadMessages(c.conversationId)}>
                {c.lastMessage || "✨ New conversation"}
              </div>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "red",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(c.conversationId);
                }}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
          🚪 Logout
        </button>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === "user" ? "🤠 " : "🤖 "}
              {m.content}
            </div>
          ))}
          {typing && <div className="typing">🤖 Assistant is typing...</div>}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} disabled={loading}>
            ➤ Send
          </button>
        </div>
      </div>

     
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  navigate("/login"); 
                }}
              >
                ✅ Yes, Logout
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
