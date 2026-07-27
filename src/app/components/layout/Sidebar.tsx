import React from "react";
import { 
  LayoutDashboard, MessageSquare, Bot, Database, FolderKanban, 
  CheckSquare, BarChart2, FileText, Settings, LogOut, ChevronLeft, ChevronRight, Zap 
} from "lucide-react";
import { Page } from "../../types";

interface SidebarProps {
  activePage: Page;
  onNavigate: (p: Page) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) => {
  const MENU_ITEMS = [
    { id: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { id: "chat", icon: <MessageSquare size={18} />, label: "AI Chat" },
    { id: "agents", icon: <Bot size={18} />, label: "AI Agents" },
    { id: "knowledge", icon: <Database size={18} />, label: "Knowledge" },
    { id: "projects", icon: <FolderKanban size={18} />, label: "Projects" },
    { id: "tasks", icon: <CheckSquare size={18} />, label: "Tasks" },
    { id: "analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
    { id: "reports", icon: <FileText size={18} />, label: "Reports" },
  ];

  return (
    <aside
      className={`relative h-screen border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out bg-sidebar ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 mb-2">
        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-background fill-background" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-bold text-lg tracking-tight text-foreground">
            Shrija<span className="opacity-70">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Page)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${activePage === item.id ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"}`}
          >
            <div className={`${activePage === item.id ? "text-sidebar-foreground" : "group-hover:text-sidebar-foreground"}`}>
              {item.icon}
            </div>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => onNavigate("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activePage === "settings" ? "bg-sidebar-accent text-sidebar-foreground" : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"}`}
        >
          <Settings size={18} />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all">
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-sidebar-border bg-sidebar flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};
