import { useState, useRef, useEffect } from "react";
import type { Project, Organisation } from "../api/types";

interface JiraTopNavProps {
  currentProject: Project | null;
  projects: Project[];
  organisations: Organisation[];
  username: string | null;
  isAdmin: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProject: (proj: Project) => void;
  onOpenCreate: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function JiraTopNav({
  currentProject,
  projects,
  username,
  isAdmin,
  searchQuery,
  onSearchChange,
  onSelectProject,
  onOpenCreate,
  onNavigate,
  onLogout,
}: JiraTopNavProps) {
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setProjectMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = username ? username.substring(0, 2).toUpperCase() : "U";

  return (
    <header className="jira-header">
      <div className="jira-header-left">
        {/* App Switcher 3x3 Dots */}
        <button
          type="button"
          className="jira-nav-icon-btn"
          title="Atlassian Apps"
          onClick={() => onNavigate("projects")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="5" r="2" />
            <circle cx="12" cy="5" r="2" />
            <circle cx="19" cy="5" r="2" />
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="12" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
          </svg>
        </button>

        {/* Jira Logo */}
        <div className="jira-header-logo" onClick={() => onNavigate("board")}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path
              d="M15.938 1.5C8.016 1.5 1.594 7.922 1.594 15.844c0 7.922 6.422 14.344 14.344 14.344 7.922 0 14.344-6.422 14.344-14.344C30.282 7.922 23.86 1.5 15.938 1.5z"
              fill="#0052CC"
            />
            <path
              d="M16.275 7.125h-5.063c-.414 0-.75.336-.75.75v10.125c0 .414.336.75.75.75h5.063c3.218 0 5.813-2.595 5.813-5.813s-2.595-5.812-5.813-5.812z"
              fill="#2684FF"
            />
            <path
              d="M16.275 13.5h-2.25c-.414 0-.75.336-.75.75v7.875c0 .414.336.75.75.75h2.25c2.595 0 4.688-2.093 4.688-4.688S18.87 13.5 16.275 13.5z"
              fill="#FFFFFF"
            />
          </svg>
          <span className="jira-logo-text">Jira</span>
        </div>

        {/* Projects Dropdown Menu */}
        <div className="jira-nav-dropdown-wrapper" ref={projectMenuRef}>
          <button
            type="button"
            className={`jira-nav-link ${projectMenuOpen ? "active" : ""}`}
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
          >
            Projects <span className="jira-chevron">?</span>
          </button>
          {projectMenuOpen && (
            <div className="jira-dropdown-menu">
              <div className="jira-dropdown-title">Recent Projects</div>
              {projects.length === 0 ? (
                <div className="jira-dropdown-item disabled">No projects found</div>
              ) : (
                projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`jira-dropdown-item ${currentProject?.id === p.id ? "selected" : ""}`}
                    onClick={() => {
                      onSelectProject(p);
                      setProjectMenuOpen(false);
                      onNavigate("board");
                    }}
                  >
                    <span className="jira-proj-icon">??</span>
                    <div className="jira-proj-info">
                      <span className="jira-proj-name">{p.name}</span>
                      <small className="jira-proj-sub">{p.organisation?.name || "Software project"}</small>
                    </div>
                  </button>
                ))
              )}
              <div className="jira-dropdown-divider" />
              <button
                type="button"
                className="jira-dropdown-item highlight"
                onClick={() => {
                  setProjectMenuOpen(false);
                  onNavigate("projects");
                }}
              >
                View all projects
              </button>
            </div>
          )}
        </div>

        {/* Filters Navigation Link */}
        <button
          type="button"
          className="jira-nav-link"
          onClick={() => onNavigate("issues")}
        >
          Filters
        </button>

        {/* Workspaces / Organizations Link */}
        <button
          type="button"
          className="jira-nav-link"
          onClick={() => onNavigate("workspaces")}
        >
          Workspaces
        </button>

        {/* Team Link */}
        <button
          type="button"
          className="jira-nav-link"
          onClick={() => onNavigate("team")}
        >
          Teams
        </button>

        {/* Global Create Button */}
        <button
          type="button"
          className="jira-create-btn"
          onClick={onOpenCreate}
        >
          + Create
        </button>
      </div>

      <div className="jira-header-right">
        {/* Global Search Bar */}
        <div className="jira-search-bar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="jira-user-menu-wrapper" ref={userMenuRef}>
          <div
            className="jira-avatar-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            title={username || "User"}
          >
            {initials}
          </div>
          {userMenuOpen && (
            <div className="jira-dropdown-menu jira-user-dropdown">
              <div className="jira-user-header">
                <div className="jira-avatar-lg">{initials}</div>
                <div>
                  <strong>{username}</strong>
                  <span className={`jira-role-pill ${isAdmin ? "admin" : ""}`}>
                    {isAdmin ? "Admin" : "Member"}
                  </span>
                </div>
              </div>
              <div className="jira-dropdown-divider" />
              <button
                type="button"
                className="jira-dropdown-item"
                onClick={() => {
                  setUserMenuOpen(false);
                  onNavigate("team");
                }}
              >
                Profile & Team
              </button>
              <button
                type="button"
                className="jira-dropdown-item"
                onClick={() => {
                  setUserMenuOpen(false);
                  onNavigate("workspaces");
                }}
              >
                Organisation settings
              </button>
              <div className="jira-dropdown-divider" />
              <button
                type="button"
                className="jira-dropdown-item text-danger"
                onClick={onLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
