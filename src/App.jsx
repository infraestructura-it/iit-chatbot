import { useState, useRef, useEffect, useCallback } from "react";
import { BRAND } from "./config.js";
import { TOPICS, CATEGORIES } from "./topics.js";
import { sendMessage } from "./api.js";

// ─────────────────────────────────────────────
//  COMPONENTE: TopicCard
// ─────────────────────────────────────────────
function TopicCard({ topic, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onClick(topic)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: BRAND.bgCard,
        border: `1px solid ${hovered ? topic.color : BRAND.border}`,
        borderRadius: 12,
        padding: "20px 16px",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        color: BRAND.text,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${topic.color}22` : "none",
        transition: "all .25s",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: topic.color, opacity: hovered ? 1 : 0.4,
        transition: "opacity .25s",
      }} />

      <div style={{ fontSize: 24, marginBottom: 10 }}>{topic.icon}</div>
      <div style={{
        fontSize: 10, color: topic.color, letterSpacing: 2,
        fontWeight: 700, marginBottom: 6,
      }}>
        {topic.cat.toUpperCase()}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
        {topic.title}
      </div>
      <div style={{ fontSize: 11, color: BRAND.muted, lineHeight: 1.5 }}>
        {topic.desc}
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: topic.color, letterSpacing: 1 }}>
        CONSULTAR →
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
//  COMPONENTE: Message
// ─────────────────────────────────────────────
function Message({ msg, topicColor, topicIcon }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      gap: 10,
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: 7, flexShrink: 0,
          background: topicColor + "33",
          border: `1px solid ${topicColor}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, marginTop: 2,
        }}>
          {topicIcon}
        </div>
      )}
      <div style={{
        maxWidth: "75%",
        padding: "12px 16px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        background: isUser ? topicColor + "1a" : BRAND.bgCard,
        border: `1px solid ${isUser ? topicColor + "44" : BRAND.border}`,
        fontSize: 14,
        lineHeight: 1.7,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COMPONENTE: TypingDots
// ─────────────────────────────────────────────
function TypingDots({ color, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        background: color + "33", border: `1px solid ${color}55`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
      }}>
        {icon}
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: color,
            animation: "blink 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COMPONENTE: ChatView
// ─────────────────────────────────────────────
function ChatView({ topic, onBack }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `¡Hola! Soy el asistente de IIT. Estoy aquí para hablar sobre ${topic.title}.\n\n${topic.desc}. ¿Qué quieres saber?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await sendMessage(next, topic);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, topic]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: BRAND.bg, fontFamily: "'Space Mono', monospace", color: BRAND.text,
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "14px 20px", borderBottom: `1px solid ${BRAND.border}`,
        display: "flex", alignItems: "center", gap: 14, background: BRAND.bgCard,
        position: "sticky", top: 0, zIndex: 10, flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: `1px solid ${BRAND.border}`,
            color: BRAND.muted, padding: "6px 12px", borderRadius: 6,
            cursor: "pointer", fontSize: 12, fontFamily: "inherit",
          }}
        >
          ← Temas
        </button>

        <div style={{
          width: 34, height: 34, borderRadius: 8, flexShrink: 0,
          background: topic.color + "22", border: `1px solid ${topic.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
        }}>
          {topic.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: topic.color, letterSpacing: 2, fontWeight: 700 }}>
            {topic.cat.toUpperCase()}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: BRAND.text,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {topic.title}
          </div>
        </div>

        <div style={{ fontSize: 10, color: BRAND.muted, letterSpacing: 2, flexShrink: 0 }}>
          <span style={{ color: BRAND.cyan }}>IIT</span> · IA
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 16px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {messages.map((m, i) => (
          <Message key={i} msg={m} topicColor={topic.color} topicIcon={topic.icon} />
        ))}
        {loading && <TypingDots color={topic.color} icon={topic.icon} />}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 8, fontSize: 12,
            background: "#ef444422", border: "1px solid #ef444444", color: "#fca5a5",
          }}>
            ⚠️ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: "14px 16px", borderTop: `1px solid ${BRAND.border}`,
        background: BRAND.bgCard, display: "flex", gap: 10, flexShrink: 0,
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Pregunta sobre ${topic.title}…`}
          rows={1}
          style={{
            flex: 1, background: BRAND.bgInput, border: `1px solid ${BRAND.border}`,
            borderRadius: 10, padding: "11px 14px", color: BRAND.text,
            fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none",
            lineHeight: 1.5, transition: "border-color .2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = topic.color)}
          onBlur={(e) => (e.target.style.borderColor = BRAND.border)}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? BRAND.border : topic.color,
            border: "none", borderRadius: 10, padding: "11px 18px",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            color: "#000", fontFamily: "inherit", fontWeight: 700,
            fontSize: 15, transition: "background .2s", flexShrink: 0,
          }}
        >
          →
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { transform: scale(.7); opacity: .3; }
          50%       { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COMPONENTE: HomeView
// ─────────────────────────────────────────────
function HomeView({ onSelect }) {
  const [filter, setFilter] = useState("Todos");
  const visible = filter === "Todos" ? TOPICS : TOPICS.filter((t) => t.cat === filter);

  return (
    <div style={{
      minHeight: "100vh", background: BRAND.bg,
      fontFamily: "'Space Mono', monospace", color: BRAND.text,
    }}>
      {/* Hero */}
      <div style={{
        padding: "48px 24px 28px", textAlign: "center",
        borderBottom: `1px solid ${BRAND.border}`,
        background: `radial-gradient(ellipse at 50% 0%, ${BRAND.cyan}0f 0%, transparent 65%)`,
      }}>
        <div style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 20,
          border: `1px solid ${BRAND.cyan}44`, fontSize: 10, letterSpacing: 3,
          color: BRAND.cyan, fontWeight: 700, marginBottom: 18,
        }}>
          INFRAESTRUCTURA IT · BOGOTÁ · 2026
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, margin: 0,
          fontSize: "clamp(28px, 6vw, 52px)", lineHeight: 1.05,
          background: `linear-gradient(135deg, ${BRAND.cyan} 0%, ${BRAND.green} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Asistente IIT
        </h1>
        <p style={{
          color: BRAND.muted, fontSize: 13, marginTop: 14,
          letterSpacing: 1, lineHeight: 1.6,
        }}>
          Selecciona un tema y te asesoro en tiempo real<br />
          sobre infraestructura IT, IoT, solar y automatización.
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        display: "flex", gap: 6, overflowX: "auto", padding: "0 16px",
        borderBottom: `1px solid ${BRAND.border}`, scrollbarWidth: "none",
      }}>
        {CATEGORIES.map((c) => {
          const active = filter === c;
          return (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "10px 14px",
              background: active ? BRAND.bgCard : "transparent",
              border: `1px solid ${active ? BRAND.border : "transparent"}`,
              borderBottom: active ? `1px solid ${BRAND.bgCard}` : `1px solid transparent`,
              borderRadius: "8px 8px 0 0",
              color: active ? BRAND.cyan : BRAND.muted,
              fontFamily: "inherit", fontSize: 10, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1.5, whiteSpace: "nowrap",
              marginBottom: active ? -1 : 0, transition: "color .2s",
            }}>
              {c.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{
        padding: "24px 16px 60px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
      }}>
        {visible.map((t) => (
          <TopicCard key={t.id} topic={t} onClick={onSelect} />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "20px 16px",
        borderTop: `1px solid ${BRAND.border}`,
        fontSize: 11, color: BRAND.muted, letterSpacing: 2,
      }}>
        <span style={{ color: BRAND.cyan }}>IIT</span> · InfraestructuraIT © 2026
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [activeTopic, setActiveTopic] = useState(null);

  if (activeTopic) {
    return <ChatView topic={activeTopic} onBack={() => setActiveTopic(null)} />;
  }

  return <HomeView onSelect={setActiveTopic} />;
}
