"use client";

import { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "안녕하세요. 무엇을 도와드릴까요?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "응답을 받지 못했습니다." }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "오류가 발생했습니다." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>챗봇</div>

      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#222" : "#f1f1f1",
              color: msg.role === "user" ? "#fff" : "#111"
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, alignSelf: "flex-start" }}>
            응답 중...
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={input}
          placeholder="메시지를 입력하세요"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button style={styles.button} onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    boxSizing: "border-box"
  },
  header: {
    padding: "14px",
    fontWeight: "bold",
    borderBottom: "1px solid #eee"
  },
  messages: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto"
  },
  message: {
    maxWidth: "80%",
    padding: "10px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: 1.4
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #eee"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  },
  button: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#111",
    color: "#fff",
    cursor: "pointer"
  }
};
