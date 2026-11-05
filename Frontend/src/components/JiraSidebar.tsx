import type { Project } from "../api/types";

interface JiraSidebarProps {
  currentProject: Project | null;
  activeView: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: (view: string) => void;
}

export function JiraSidebar({
  currentProject,
  activeView,
  isCollapsed,
  onToggleCollapse,
  onNavigate,
}: JiraSidebarProps) {
  return (
    <aside className={`jira-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Project Header */}
      <div className="jira-sidebar-header">
        <div className="jira-sidebar-proj-icon">
          {currentProject?.name ? currentProject.name.substring(0, 1).toUpperCase() : "P"}
        </div>
        {!isCollapsed && (
          <div className="jira-sidebar-proj-details">
            <span className="jira-sidebar-proj-name" title={currentProject?.name || "Select a project"}>
              {currentProject?.name || "All Projects"}
            </span>
            <span className="jira-sidebar-proj-type">
              {currentProject?.organisation?.name || "Software project"}
            </span>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className="jira-sidebar-nav">
        {!isCollapsed && <div className="jira-sidebar-group-title">PLANNING</div>}

        <button
          type="button"
          className={`jira-sidebar-item ${activeView === "board" ? "active" : ""}`}
          onClick={() => onNavigate("board")}
          title="Kanban Board"
        >
          <span className="jira-sidebar-icon">??</span>
          {!isCollapsed && <span>Kanban board</span>}
        </button>

        <button
          type="button"
          className={`jira-sidebar-item ${activeView === "issues" ? "active" : ""}`}
          onClick={() => onNavigate("issues")}
          title="Issues List"
        >
          <span className="jira-sidebar-icon">??</span>
          {!isCollapsed && <span>List</span>}
        </button>

        <button
          type="button"
          className={`jira-sidebar-item ${activeView === "summary" ? "active" : ""}`}
          onClick={() => onNavigate("summary")}
          title="Summary"
        >
          <span className="jira-sidebar-icon">??</span>
          {!isCollapsed && <span>Summary</span>}
        </button>

        {!isCollapsed && <div className="jira-sidebar-group-title" style={{ marginTop: "1rem" }}>COLLABORATION</div>}

        <button
          type="button"
          className={`jira-sidebar-item ${activeView === "chat" ? "active" : ""}`}
          onClick={() => onNavigate("chat")}
          title="Live Project Chat"
        >
          <span className="jira-sidebar-icon">??</span>
          {!isCollapsed && (
            <span className="jira-chat-sidebar-label">
              Project Chat
              <span className="jira-live-indicator" />
            </span>
          )}
        </button>

        <button
          type="button"
          className={`jira-sidebar-item ${activeView === "team" ? "active" : ""}`}
          onClick={() => onNavigate("team")}
          title="Team & Members"
        >
          <span className="jira-sidebar-icon">??</span>
          {!isCollapsed && <span>Team members</span>}
        </button>

        {!isCollapsed && <div className="jira-sidebar-group-title" style={{ marginTop: "1rem" }}>ORGANISATION</div>}

        <button
          type="button"
          className={`jira-sidebar-item ${activeView === "workspaces" ? "active" : ""}`}
          onClick={() => onNavigate("workspaces")}
          title="Workspaces"
        >
          <span className="jira-sidebar-icon">??</span>
          {!isCollapsed && <span>Workspaces</span>}
        </button>

        <button
          type="button"
          className={`jira-sidebar-item ${activeView === "projects" ? "active" : ""}`}
          onClick={() => onNavigate("projects")}
          title="All Projects"
        >
          <span className="jira-sidebar-icon">??</span>
          {!isCollapsed && <span>All projects</span>}
        </button>
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="jira-sidebar-footer">
        <button
          type="button"
          className="jira-collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "?" : "? Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
}
