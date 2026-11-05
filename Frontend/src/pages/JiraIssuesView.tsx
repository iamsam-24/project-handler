import { useState } from "react";
import type { Project, Task, TaskPriority, TasksStatus } from "../api/types";
import { taskApi } from "../api/endpoints";

interface JiraIssuesViewProps {
  currentProject: Project | null;
  tasks: Task[];
  searchQuery: string;
  isAdmin: boolean;
  onSelectTask: (task: Task) => void;
  onRefreshTasks: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function JiraIssuesView({
  currentProject,
  tasks,
  searchQuery,
  isAdmin,
  onSelectTask,
  onRefreshTasks,
  showToast,
}: JiraIssuesViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [localSearch, setLocalSearch] = useState("");

  const filtered = tasks.filter((t) => {
    const matchesProj = Boolean(currentProject && t.project?.id === currentProject.id);
    const matchesStatus = !filterStatus || t.status === filterStatus;
    const matchesPriority = !filterPriority || t.priority === filterPriority;
    const term = (searchQuery || localSearch).toLowerCase();
    const matchesSearch =
      !term ||
      t.title.toLowerCase().includes(term) ||
      String(t.id).includes(term);
    return matchesProj && matchesStatus && matchesPriority && matchesSearch;
  });

  async function handleQuickStatusChange(task: Task, nextStatus: TasksStatus) {
    try {
      await taskApi.update(task.id, {
        title: task.title,
        status: nextStatus,
        priority: task.priority,
      });
      showToast(`TASK-${task.id} updated to ${nextStatus.replace("_", " ")}`, "success");
      onRefreshTasks();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  }

  return (
    <div className="jira-issues-view">
      <div className="jira-view-header">
        <div>
          <h1 className="jira-view-title">Issues</h1>
          <p className="jira-view-subtitle">Track, filter, and prioritize all work items across your projects</p>
        </div>
        <button type="button" className="jira-btn jira-btn-subtle" onClick={onRefreshTasks}>
          ? Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="jira-filter-bar">
        <input
          type="text"
          placeholder="Search issues..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="jira-search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="jira-filter-select"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="FAILED">Failed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="jira-filter-select"
        >
          <option value="">All Priorities</option>
          <option value="VERYHIGH">Highest</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Issues Table */}
      <div className="jira-table-container">
        {filtered.length === 0 ? (
          <div className="jira-empty-state">
            <p>No issues found matching your filters</p>
          </div>
        ) : (
          <table className="jira-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>Type</th>
                <th style={{ width: "110px" }}>Key</th>
                <th>Summary</th>
                <th style={{ width: "160px" }}>Status</th>
                <th style={{ width: "120px" }}>Priority</th>
                <th style={{ width: "160px" }}>Project</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="jira-table-row"
                >
                  <td>
                    <span className="jira-type-icon task-sm">?</span>
                  </td>
                  <td>
                    <span className="jira-key-badge">TASK-{task.id}</span>
                  </td>
                  <td>
                    <span className="jira-issue-title">{task.title}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={(e) => handleQuickStatusChange(task, e.target.value as TasksStatus)}
                      className={`jira-status-pill-select status-${task.status.toLowerCase().replace("_", "-")}`}
                    >
                      <option value="TODO">TO DO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </td>
                  <td>
                    <span className={`jira-priority-pill prio-${task.priority.toLowerCase()}`}>
                      {task.priority === "VERYHIGH"
                        ? "Highest"
                        : task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>
                    <span className="jira-proj-badge">{task.project?.name || "Global"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
