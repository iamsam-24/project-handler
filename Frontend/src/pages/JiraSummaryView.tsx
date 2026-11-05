import type { Project, Task } from "../api/types";

interface JiraSummaryViewProps {
  currentProject: Project | null;
  tasks: Task[];
  onNavigate: (view: string) => void;
}

export function JiraSummaryView({ currentProject, tasks, onNavigate }: JiraSummaryViewProps) {
  const projectTasks = tasks.filter(
    (t) => !currentProject || (t.project && t.project.id === currentProject.id),
  );

  const todoCount = projectTasks.filter((t) => t.status === "TODO").length;
  const inProgressCount = projectTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const doneCount = projectTasks.filter((t) => t.status === "DONE").length;
  const failedCount = projectTasks.filter((t) => t.status === "FAILED").length;
  const total = projectTasks.length;

  const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="jira-summary-page">
      <div className="jira-view-header">
        <div>
          <h1 className="jira-view-title">{currentProject?.name || "Global"} Summary</h1>
          <p className="jira-view-subtitle">Status metrics, completion breakdown, and project performance</p>
        </div>
      </div>

      <div className="jira-metrics-row">
        <div className="jira-stat-card">
          <span className="jira-stat-label">TOTAL ISSUES</span>
          <div className="jira-stat-value">{total}</div>
          <span className="jira-stat-sub">Across all statuses</span>
        </div>

        <div className="jira-stat-card">
          <span className="jira-stat-label">COMPLETED</span>
          <div className="jira-stat-value text-success">{doneCount}</div>
          <span className="jira-stat-sub">{completionRate}% completion rate</span>
        </div>

        <div className="jira-stat-card">
          <span className="jira-stat-label">IN PROGRESS</span>
          <div className="jira-stat-value text-primary">{inProgressCount}</div>
          <span className="jira-stat-sub">Active work</span>
        </div>

        <div className="jira-stat-card">
          <span className="jira-stat-label">TO DO</span>
          <div className="jira-stat-value text-muted">{todoCount}</div>
          <span className="jira-stat-sub">Backlog items</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="jira-card-panel" style={{ marginTop: "1.5rem" }}>
        <div className="jira-panel-header">
          <h3>Progress Overview</h3>
          <span className="jira-badge">{completionRate}% done</span>
        </div>
        <div className="jira-panel-body">
          <div className="jira-progress-track">
            <div
              className="jira-progress-fill done"
              style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
              title={`Done: ${doneCount}`}
            />
            <div
              className="jira-progress-fill progress"
              style={{ width: `${total ? (inProgressCount / total) * 100 : 0}%` }}
              title={`In Progress: ${inProgressCount}`}
            />
            <div
              className="jira-progress-fill failed"
              style={{ width: `${total ? (failedCount / total) * 100 : 0}%` }}
              title={`Failed: ${failedCount}`}
            />
          </div>

          <div className="jira-progress-legend">
            <div className="legend-item">
              <span className="legend-dot done" /> Done ({doneCount})
            </div>
            <div className="legend-item">
              <span className="legend-dot progress" /> In Progress ({inProgressCount})
            </div>
            <div className="legend-item">
              <span className="legend-dot todo" /> To Do ({todoCount})
            </div>
            {failedCount > 0 && (
              <div className="legend-item">
                <span className="legend-dot failed" /> Failed ({failedCount})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Breakdown & Quick Action */}
      <div className="jira-team-grid" style={{ marginTop: "1.5rem" }}>
        <div className="jira-card-panel">
          <div className="jira-panel-header">
            <h3>Status Distribution</h3>
          </div>
          <div className="jira-panel-body">
            <div className="jira-status-list">
              <div className="jira-status-item">
                <span className="jira-status-tag todo">TO DO</span>
                <strong>{todoCount} issues</strong>
              </div>
              <div className="jira-status-item">
                <span className="jira-status-tag in-progress">IN PROGRESS</span>
                <strong>{inProgressCount} issues</strong>
              </div>
              <div className="jira-status-item">
                <span className="jira-status-tag done">DONE</span>
                <strong>{doneCount} issues</strong>
              </div>
              <div className="jira-status-item">
                <span className="jira-status-tag failed">FAILED</span>
                <strong>{failedCount} issues</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="jira-card-panel">
          <div className="jira-panel-header">
            <h3>Quick Navigation</h3>
          </div>
          <div className="jira-panel-body">
            <div className="jira-quick-links">
              <button
                type="button"
                className="jira-quick-link-btn"
                onClick={() => onNavigate("board")}
              >
                <span>?? Kanban Board</span>
                <small>Drag and update issue cards across columns</small>
              </button>
              <button
                type="button"
                className="jira-quick-link-btn"
                onClick={() => onNavigate("issues")}
              >
                <span>?? Issues List</span>
                <small>Search, filter, and review all project items</small>
              </button>
              <button
                type="button"
                className="jira-quick-link-btn"
                onClick={() => onNavigate("chat")}
              >
                <span>?? Team Channel</span>
                <small>Communicate live with project collaborators</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
