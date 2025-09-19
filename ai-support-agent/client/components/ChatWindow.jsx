import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); 
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {

    axios
      .get("http://localhost:5000/chat/history", {

        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", text: input };
    setMessages([...messages, newMsg]);
    setInput("");
    setLoading(true); 

    try {
      const res = await axios.post(

        "http://localhost:5000/chat/send",

        { message: newMsg.text },

        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply },
      ]);

    } catch (err) {

      console.error(err);

    } finally {
      setLoading(false); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
// redirect to login page after logout

    window.location.href = "/login"; 
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">Virallens AI Support</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Chat Body Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="italic text-gray-500">AI is typing...</div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Box Section */}
      <div className="flex p-4 border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 mr-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
