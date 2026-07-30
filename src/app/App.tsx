// src/App.tsx
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { FilePreviewPanel } from "./components/layout/FilePreviewPanel";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { MessageCard, ChatInput } from "./components/chat";
import { Page, Message } from "./types";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanel, setRightPanel] = useState(false);
  const [splitScreen, setSplitScreen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );
  const [showSignUp, setShowSignUp] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! I'm Shrija AI. How can I help you today?", timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSendMessage = useCallback((content: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "I've received your message and I'm processing it.", timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    setMessages([
      { id: "1", role: "assistant", content: "Hello! I'm Shrija AI. How can I help you today?", timestamp: new Date() }
    ]);
  }, []);

  const handleSignUp = () => {
    // After successful sign up
    setIsLoggedIn(true);
    setShowSignUp(false);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage onNavigate={setActivePage} />;
      case "chat":
        return (
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map(m => <MessageCard key={m.id} msg={m} />)}
              {isTyping && <MessageCard msg={{ id: "thinking", role: "assistant", content: "", timestamp: new Date(), thinking: true }} />}
            </div>
            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background">
            <h2 className="text-xl font-bold capitalize">{activePage} Page</h2>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  // Show Login or SignUp if not logged in
  if (!isLoggedIn) {
    if (showSignUp) {
      return <SignUp onSignUp={handleSignUp} onBackToLogin={handleBackToLogin} />;
    }
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        onSignUpClick={() => setShowSignUp(true)}
      />
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar
          activePage={activePage}
          onCommandPalette={() => { }}
          onNavigate={setActivePage}
          rightPanel={rightPanel}
          onRightPanel={() => setRightPanel(!rightPanel)}
          splitScreen={splitScreen}
          onSplitScreen={() => setSplitScreen(!splitScreen)}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="flex-1 flex overflow-hidden">
          {renderPage()}
          {rightPanel && <FilePreviewPanel onClose={() => setRightPanel(false)} />}
        </main>
      </div>
    </div>
  );
}