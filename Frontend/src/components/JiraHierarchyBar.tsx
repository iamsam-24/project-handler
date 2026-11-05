import { useState, useRef, useEffect } from "react";
import type { Organisation, Project, Task } from "../api/types";

interface JiraHierarchyBarProps {
  organisations: Organisation[];
  currentOrganisation: Organisation | null;
  onSelectOrganisation: (organisation: Organisation) => void;
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (proj: Project) => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateTask: () => void;
}

export function JiraHierarchyBar({
  organisations,
  currentOrganisation,
  onSelectOrganisation,
  projects,
  currentProject,
  onSelectProject,
  tasks,
  onSelectTask,
  onOpenCreateTask,
}: JiraHierarchyBarProps) {
  const [organisationDropdownOpen, setOrganisationDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);

  const organisationRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const taskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (organisationRef.current && !organisationRef.current.contains(e.target as Node)) {
        setOrganisationDropdownOpen(false);
      }
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) {
        setProjectDropdownOpen(false);
      }
      if (taskRef.current && !taskRef.current.contains(e.target as Node)) {
        setTaskDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const organisationProjects = currentOrganisation
    ? projects.filter((project) => project.organisation?.id === currentOrganisation.id)
    : [];
  const projectTasks = currentProject
    ? tasks.filter((task) => task.project?.id === currentProject.id)
    : [];

  return (
    <div className="jira-hierarchy-bar">
      <div className="jira-hierarchy-flow">
        <span className="jira-hierarchy-label">WORKSPACE CONTEXT:</span>

        {/* STEP 1: ORGANISATION */}
        <div className="jira-hierarchy-step" ref={organisationRef}>
          <div
            className="jira-step-chip"
            onClick={() => setOrganisationDropdownOpen(!organisationDropdownOpen)}
            title="Step 1: Select Organisation"
          >
            <span className="jira-step-num">1</span>
            <span className="jira-step-icon">??</span>
            <div className="jira-step-text">
              <span className="jira-step-title">Organisation</span>
              <strong className="jira-step-val">
                {currentOrganisation?.name || "Select Organisation"}
              </strong>
            </div>
            <span className="jira-step-arrow">?</span>
          </div>

          {organisationDropdownOpen && (
            <div className="jira-dropdown-menu jira-hierarchy-dropdown">
              <div className="jira-dropdown-title">Choose Organisation</div>
              {organisations.length === 0 ? (
                <div className="jira-dropdown-item disabled">No organisations available</div>
              ) : organisations.map((organisation) => (
                <button
                  key={organisation.id}
                  type="button"
                  className={`jira-dropdown-item ${currentOrganisation?.id === organisation.id ? "selected" : ""}`}
                  onClick={() => {
                    onSelectOrganisation(organisation);
                    setOrganisationDropdownOpen(false);
                  }}
                >
                  <div className="jira-avatar-sm">{organisation.name.substring(0, 2).toUpperCase()}</div>
                  <div className="jira-user-item-info">
                    <strong>{organisation.name}</strong>
                    <small>{organisation.slug}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="jira-hierarchy-sep">&rarr;</span>

        {/* STEP 2: PROJECT */}
        <div className="jira-hierarchy-step" ref={projectRef}>
          <div
            className={`jira-step-chip ${!currentOrganisation ? "disabled" : ""}`}
            onClick={() => currentOrganisation && setProjectDropdownOpen(!projectDropdownOpen)}
            title="Step 2: Select Project after choosing an organisation"
          >
            <span className="jira-step-num">2</span>
            <span className="jira-step-icon">??</span>
            <div className="jira-step-text">
              <span className="jira-step-title">Project</span>
              <strong className="jira-step-val">{currentProject?.name || "Select Project"}</strong>
            </div>
            <span className="jira-step-arrow">?</span>
          </div>

          {projectDropdownOpen && (
            <div className="jira-dropdown-menu jira-hierarchy-dropdown">
              <div className="jira-dropdown-title">Choose Project</div>
              {!currentOrganisation ? (
                <div className="jira-dropdown-item disabled">Choose an organisation first</div>
              ) : organisationProjects.length === 0 ? (
                <div className="jira-dropdown-item disabled">No projects in this organisation</div>
              ) : (
                organisationProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`jira-dropdown-item ${currentProject?.id === p.id ? "selected" : ""}`}
                    onClick={() => {
                      onSelectProject(p);
                      setProjectDropdownOpen(false);
                    }}
                  >
                    <span>??</span>
                    <div className="jira-user-item-info">
                      <strong>{p.name}</strong>
                      <small>{p.organisation?.name || "Project workspace"}</small>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <span className="jira-hierarchy-sep">&rarr;</span>

        {/* STEP 3: TASK */}
        <div className="jira-hierarchy-step" ref={taskRef}>
          <div
            className={`jira-step-chip ${!currentProject ? "disabled" : ""}`}
            onClick={() => currentProject && setTaskDropdownOpen(!taskDropdownOpen)}
            title="Step 3: Select or View Tasks after choosing a project"
          >
            <span className="jira-step-num">3</span>
            <span className="jira-step-icon">??</span>
            <div className="jira-step-text">
              <span className="jira-step-title">Task</span>
              <strong className="jira-step-val">
                {projectTasks.length} {projectTasks.length === 1 ? "Task" : "Tasks"}
              </strong>
            </div>
            <span className="jira-step-arrow">?</span>
          </div>

          {taskDropdownOpen && (
            <div className="jira-dropdown-menu jira-hierarchy-dropdown wide">
              <div className="jira-dropdown-title">
                Tasks for {currentProject?.name || "Project"} ({projectTasks.length})
              </div>
              <div className="jira-task-dropdown-scroll">
                {!currentProject ? (
                  <div className="jira-dropdown-item disabled">Choose a project first</div>
                ) : projectTasks.length === 0 ? (
                  <div className="jira-dropdown-item disabled">No tasks in this project yet</div>
                ) : (
                  projectTasks.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="jira-dropdown-item"
                      onClick={() => {
                        onSelectTask(t);
                        setTaskDropdownOpen(false);
                      }}
                    >
                      <span className="jira-type-icon task-sm">?</span>
                      <div className="jira-task-item-info">
                        <span className="jira-task-item-title">
                          <code className="jira-task-key">TASK-{t.id}</code> {t.title}
                        </span>
                        <span className={`jira-status-pill-mini status-${t.status.toLowerCase().replace("_", "-")}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="jira-dropdown-divider" />
              <button
                type="button"
                className="jira-dropdown-item highlight"
                onClick={() => {
                  setTaskDropdownOpen(false);
                  onOpenCreateTask();
                }}
              >
                + Add new task to this project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
