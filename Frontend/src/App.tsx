import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth/AuthContext";
import { AuthScreen } from "./pages/AuthScreen";
import { JiraTopNav } from "./components/JiraTopNav";
import { JiraSidebar } from "./components/JiraSidebar";
import { JiraHierarchyBar } from "./components/JiraHierarchyBar";
import { JiraBoardView } from "./pages/JiraBoardView";
import { JiraIssuesView } from "./pages/JiraIssuesView";
import { JiraSummaryView } from "./pages/JiraSummaryView";
import { JiraProjectsView } from "./pages/JiraProjectsView";
import { JiraOrgView } from "./pages/JiraOrgView";
import { JiraTeamView } from "./pages/JiraTeamView";
import { JiraChatView } from "./pages/JiraChatView";
import { JiraCreateModal } from "./components/JiraCreateModal";
import { JiraIssueDetailModal } from "./components/JiraIssueDetailModal";
import { projectApi, organisationApi, taskApi } from "./api/endpoints";
import type { Project, Organisation, Task } from "./api/types";
import { readWorkspace, writeWorkspace } from "./lib/workspaceStore";

interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

export function App() {
  const { isAuthenticated, username, isAdmin, logout } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentOrganisation, setCurrentOrganisation] = useState<Organisation | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const [activeView, setActiveView] = useState<string>("board");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const mem = readWorkspace();
      const [projList, orgList] = await Promise.all([
        projectApi.list().catch(() => []),
        organisationApi.list().catch(() => []),
      ]);

      const taskList = mem.projectId
        ? await taskApi.listByProject(mem.projectId).catch(() => [])
        : [];

      const validProjs = Array.isArray(projList) ? projList : [];
      const validOrgs = Array.isArray(orgList) ? orgList : [];
      const validTasks = Array.isArray(taskList) ? taskList : [];

      setProjects(validProjs);
      setOrganisations(validOrgs);
      setTasks(validTasks);

      const existingProject = validProjs.find((p) => p.id === mem.projectId);
      const restoredOrg =
        validOrgs.find((org) => org.id === mem.orgId) ||
        validOrgs.find((org) => org.id === existingProject?.organisation?.id) ||
        null;
      const restoredProject =
        existingProject && restoredOrg && existingProject.organisation?.id === restoredOrg.id
          ? existingProject
          : null;

      setCurrentOrganisation(restoredOrg);
      setCurrentProject(restoredProject);
      setSelectedTask(null);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  function handleSelectOrganisation(organisation: Organisation) {
    setCurrentOrganisation(organisation);
    setCurrentProject(null);
    setTasks([]);
    setSelectedTask(null);
    writeWorkspace({
      orgId: organisation.id,
      orgName: organisation.name,
      projectId: "",
      projectName: "",
    });
  }

  function handleSelectProject(proj: Project) {
    const organisation = organisations.find((org) => org.id === proj.organisation?.id) || null;
    if (!organisation) {
      showToast("This project is not linked to an organisation", "error");
      return;
    }

    setCurrentOrganisation(organisation);
    setCurrentProject(proj);
    setTasks([]);
    setSelectedTask(null);
    writeWorkspace({
      projectId: proj.id,
      projectName: proj.name,
      orgId: organisation.id,
      orgName: organisation.name,
    });
    taskApi.listByProject(proj.id)
      .then((projectTaskList) => setTasks(Array.isArray(projectTaskList) ? projectTaskList : []))
      .catch(() => setTasks([]));
  }

  const organisationProjects = currentOrganisation
    ? projects.filter((project) => project.organisation?.id === currentOrganisation.id)
    : [];
  const projectTasks = currentProject
    ? tasks.filter((task) => task.project?.id === currentProject.id)
    : [];

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="jira-app-layout">
      {/* Toast Alert Box */}
      <div className="jira-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`jira-toast jira-toast-${toast.type}`}>
            <span>{toast.text}</span>
            <button
              type="button"
              className="jira-toast-close"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Jira Top Nav */}
      <JiraTopNav
        currentProject={currentProject}
        projects={organisationProjects}
        organisations={organisations}
        username={username}
        isAdmin={isAdmin}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectProject={handleSelectProject}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onNavigate={setActiveView}
        onLogout={logout}
      />

      {/* Organisation -> Project -> Task Hierarchy Bar */}
      <JiraHierarchyBar
        organisations={organisations}
        currentOrganisation={currentOrganisation}
        onSelectOrganisation={handleSelectOrganisation}
        projects={organisationProjects}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        tasks={projectTasks}
        onSelectTask={setSelectedTask}
        onOpenCreateTask={() => setIsCreateModalOpen(true)}
      />

      <div className="jira-main-body">
        {/* Jira Collapsible Left Sidebar */}
        <JiraSidebar
          currentProject={currentProject}
          activeView={activeView}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onNavigate={setActiveView}
        />

        {/* Viewport Content */}
        <main className="jira-viewport">
          {activeView === "board" && (
            <JiraBoardView
              currentProject={currentProject}
              tasks={projectTasks}
              searchQuery={searchQuery}
              isAdmin={isAdmin}
              onOpenCreate={() => setIsCreateModalOpen(true)}
              onSelectTask={setSelectedTask}
              onRefreshTasks={loadData}
              showToast={showToast}
            />
          )}

          {activeView === "issues" && (
            <JiraIssuesView
              currentProject={currentProject}
              tasks={projectTasks}
              searchQuery={searchQuery}
              isAdmin={isAdmin}
              onSelectTask={setSelectedTask}
              onRefreshTasks={loadData}
              showToast={showToast}
            />
          )}

          {activeView === "summary" && (
            <JiraSummaryView
              currentProject={currentProject}
              tasks={projectTasks}
              onNavigate={setActiveView}
            />
          )}

          {activeView === "projects" && (
            <JiraProjectsView
              projects={organisationProjects}
              organisations={organisations}
              isAdmin={isAdmin}
              onSelectProject={(p) => {
                handleSelectProject(p);
                setActiveView("board");
              }}
              onRefreshProjects={loadData}
              showToast={showToast}
            />
          )}

          {activeView === "workspaces" && (
            <JiraOrgView
              organisations={organisations}
              projects={projects}
              isAdmin={isAdmin}
              onRefreshOrgs={loadData}
              showToast={showToast}
            />
          )}

          {activeView === "team" && (
            <JiraTeamView
              organisations={organisations}
              username={username}
              isAdmin={isAdmin}
              showToast={showToast}
            />
          )}

          {activeView === "chat" && (
            <JiraChatView
              currentProject={currentProject}
              projects={organisationProjects}
              username={username}
              onSelectProject={handleSelectProject}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Jira Create Issue Modal */}
      <JiraCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentProject={currentProject}
        onIssueCreated={loadData}
        showToast={showToast}
      />

      {/* Jira Issue Detail Drawer / Modal */}
      <JiraIssueDetailModal
        task={selectedTask}
        isAdmin={isAdmin}
        onClose={() => setSelectedTask(null)}
        onUpdated={loadData}
        showToast={showToast}
      />
    </div>
  );
}
