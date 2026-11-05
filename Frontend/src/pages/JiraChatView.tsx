import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Project } from "../api/types";
import { chatSocketUrl } from "../api/endpoints";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
  isMe?: boolean;
}

interface JiraChatViewProps {
  currentProject: Project | null;
  projects: Project[];
  username: string | null;
  onSelectProject: (proj: Project) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function JiraChatView({
  currentProject,
  projects,
  username,
  onSelectProject,
  showToast,
}: JiraChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect whenever active project changes
  useEffect(() => {
    if (currentProject && UUID_REGEX.test(currentProject.id)) {
      connectToRoom(currentProject.id);
    } else if (!currentProject && projects.length > 0 && UUID_REGEX.test(projects[0].id)) {
      onSelectProject(projects[0]);
    } else {
      disconnect();
    }
    return () => {
      disconnect();
    };
  }, [currentProject?.id, projects.length]);

  function disconnect() {
    if (socketRef.current) {
      const ws = socketRef.current;
      socketRef.current = null;
      try {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close(1000, "Normal closure");
        }
      } catch {
        // ignore
      }
    }
    setStatus("disconnected");
  }

  function connectToRoom(projectId: string) {
    disconnect();
    setStatus("connecting");

    try {
      const url = chatSocketUrl(projectId);
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        addMessage({
          id: Math.random().toString(36).substring(2, 9),
          sender: "System",
          text: `Connected to #${currentProject?.name || "project"} channel`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSystem: true,
        });
      };

      ws.onmessage = (event) => {
        const raw = String(event.data);
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && parsed.text) {
            addMessage({
              id: Math.random().toString(36).substring(2, 9),
              sender: parsed.sender || "Teammate",
              text: parsed.text,
              time: parsed.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isMe: parsed.sender === username,
            });
            return;
          }
        } catch {
          // plain text
        }

        addMessage({
          id: Math.random().toString(36).substring(2, 9),
          sender: "Teammate",
          text: raw,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false,
        });
      };

      ws.onclose = () => {
        setStatus("disconnected");
      };

      ws.onerror = () => {
        setStatus("disconnected");
      };
    } catch (err: any) {
      setStatus("disconnected");
      showToast(err.message || "Failed to connect to chat", "error");
    }
  }

  function addMessage(msg: ChatMessage) {
    setMessages((prev) => [...prev, msg]);
  }

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || status !== "connected" || !socketRef.current) return;

    const payload = JSON.stringify({
      sender: username || "User",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    try {
      socketRef.current.send(payload);
      addMessage({
        id: Math.random().toString(36).substring(2, 9),
        sender: username || "Me",
        text: draft.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      });
      setDraft("");
    } catch (err: any) {
      showToast("Failed to send message: " + err.message, "error");
    }
  }

  return (
    <div className="jira-chat-page">
      <div className="jira-view-header">
        <div className="jira-chat-header-info">
          <div className="jira-chat-title-row">
            <h1 className="jira-view-title">
              #{currentProject?.name || "project-chat"}
            </h1>
            <span
              className={`jira-chat-status-badge ${
                status === "connected"
                  ? "online"
                  : status === "connecting"
                  ? "connecting"
                  : "offline"
              }`}
            >
              <span className="dot" />
              {status === "connected"
                ? "Live room active"
                : status === "connecting"
                ? "Connecting..."
                : "Offline"}
            </span>

            {status !== "connected" && currentProject && (
              <button
                type="button"
                className="jira-btn jira-btn-secondary jira-btn-sm"
                onClick={() => connectToRoom(currentProject.id)}
                disabled={status === "connecting"}
              >
                {status === "connecting" ? "Connecting..." : "Connect"}
              </button>
            )}
          </div>
          <p className="jira-view-subtitle">Real-time team collaboration channel for project members</p>
        </div>

        <div className="jira-chat-project-switch">
          <select
            value={currentProject?.id || ""}
            onChange={(e) => {
              const found = projects.find((p) => p.id === e.target.value);
              if (found) onSelectProject(found);
            }}
            className="jira-select"
          >
            <option value="">Select project channel</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="jira-chat-window">
        <div className="jira-chat-feed">
          {messages.length === 0 ? (
            <div className="jira-chat-empty">
              <span className="jira-chat-empty-icon">??</span>
              <h3>Welcome to #{currentProject?.name || "project"}</h3>
              <p>This is the start of the team collaboration channel. Send a message to start chatting in real time!</p>
            </div>
          ) : (
            messages.map((m) => {
              if (m.isSystem) {
                return (
                  <div key={m.id} className="jira-chat-system-line">
                    <span>{m.text}</span>
                    <small>{m.time}</small>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`jira-chat-msg-row ${m.isMe ? "me" : "other"}`}
                >
                  <div className="jira-chat-avatar">
                    {m.sender.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="jira-chat-msg-body">
                    <div className="jira-chat-msg-meta">
                      <strong>{m.isMe ? "You" : m.sender}</strong>
                      <span className="jira-chat-time">{m.time}</span>
                    </div>
                    <div className="jira-chat-bubble">{m.text}</div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="jira-chat-composer">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              status === "connected"
                ? `Message #${currentProject?.name || "project"}...`
                : "Connect to project room to send messages"
            }
            disabled={status !== "connected"}
            className="jira-input"
          />
          <button
            type="submit"
            className="jira-btn jira-btn-primary"
            disabled={status !== "connected" || !draft.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
