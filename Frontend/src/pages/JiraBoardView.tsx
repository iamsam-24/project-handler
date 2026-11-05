import { useState } from "react";
import type { Project, Task, TaskPriority, TasksStatus } from "../api/types";
import { taskApi } from "../api/endpoints";

interface JiraBoardViewProps {
  currentProject: Project | null;
  tasks: Task[];
  searchQuery: string;
  isAdmin: boolean;
  onOpenCreate: () => void;
  onSelectTask: (task: Task) => void;
  onRefreshTasks: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

const COLUMNS: { id: TasksStatus; title: string }[] = [
  { id: "TODO", title: "TO DO" },
  { id: "IN_PROGRESS", title: "IN PROGRESS" },
  { id: "DONE", title: "DONE" },
  { id: "FAILED", title: "FAILED" },
];

export function JiraBoardView({
  currentProject,
  tasks,
  searchQuery,
  isAdmin,
  onOpenCreate,
  onSelectTask,
  onRefreshTasks,
  showToast,
}: JiraBoardViewProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [inlineCreateColumn, setInlineCreateColumn] = useState<TasksStatus | null>(null);
  const [inlineTitle, setInlineTitle] = useState("");
  const [creatingInline, setCreatingInline] = useState(false);

  // Filter tasks
  const projectTasks = tasks.filter((t) => {
    const matchesProj = !currentProject || (t.project && t.project.id === currentProject.id);
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(t.id).includes(searchQuery);
    const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
    return matchesProj && matchesSearch && matchesPriority;
  });

  async function handleQuickMove(task: Task, nextStatus: TasksStatus) {
    try {
      await taskApi.update(task.id, {
        title: task.title,
        status: nextStatus,
        priority: task.priority,
      });
      showToast(`TASK-${task.id} moved to ${nextStatus.replace("_", " ")}`, "success");
      onRefreshTasks();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  }

  async function handleInlineSubmit(status: TasksStatus) {
    if (!currentProject) {
      showToast("Please select a project first to create an issue", "error");
      return;
    }
    if (!inlineTitle.trim()) return;

    setCreatingInline(true);
    try {
      await taskApi.create(currentProject.id, {
        title: inlineTitle.trim(),
        status,
        priority: "MEDIUM",
      });
      showToast("Issue created!", "success");
      setInlineTitle("");
      setInlineCreateColumn(null);
      onRefreshTasks();
    } catch (err: any) {
      showToast(err.message || "Failed to create issue", "error");
    } finally {
      setCreatingInline(false);
    }
  }

  function renderPriorityIcon(p: TaskPriority) {
    switch (p) {
      case "VERYHIGH":
        return <span className="jira-prio-icon highest" title="Highest priority">??</span>;
      case "HIGH":
        return <span className="jira-prio-icon high" title="High priority">?</span>;
      case "MEDIUM":
        return <span className="jira-prio-icon medium" title="Medium priority">=</span>;
      case "LOW":
        return <span className="jira-prio-icon low" title="Low priority">?</span>;
      default:
        return null;
    }
  }

  return (
    <div className="jira-board-view">
      {/* Board Header */}
      <div className="jira-board-header">
        <div>
          <div className="jira-board-breadcrumbs">
            <span>Projects</span> / <span>{currentProject?.name || "All Projects"}</span>
          </div>
          <h1 className="jira-board-title">
            {currentProject?.name ? `${currentProject.name} board` : "Global Kanban Board"}
          </h1>
        </div>

        <div className="jira-board-actions">
          <div className="jira-filter-chips">
            <button
              type="button"
              className={`jira-filter-chip ${priorityFilter === "ALL" ? "active" : ""}`}
              onClick={() => setPriorityFilter("ALL")}
            >
              All issues
            </button>
            <button
              type="button"
              className={`jira-filter-chip ${priorityFilter === "VERYHIGH" ? "active" : ""}`}
              onClick={() => setPriorityFilter("VERYHIGH")}
            >
              Highest
            </button>
            <button
              type="button"
              className={`jira-filter-chip ${priorityFilter === "HIGH" ? "active" : ""}`}
              onClick={() => setPriorityFilter("HIGH")}
            >
              High
            </button>
            <button
              type="button"
              className={`jira-filter-chip ${priorityFilter === "MEDIUM" ? "active" : ""}`}
              onClick={() => setPriorityFilter("MEDIUM")}
            >
              Medium
            </button>
          </div>

          <button
            type="button"
            className="jira-btn jira-btn-subtle"
            onClick={onRefreshTasks}
            title="Refresh board"
          >
            ? Refresh
          </button>
        </div>
      </div>

      {/* Board Kanban Columns Grid */}
      <div className="jira-columns-container">
        {COLUMNS.map((col) => {
          const colTasks = projectTasks.filter((t) => t.status === col.id);

          return (
            <div key={col.id} className="jira-column">
              <div className="jira-column-header">
                <span className="jira-column-title">{col.title}</span>
                <span className="jira-column-count">{colTasks.length}</span>
              </div>

              <div className="jira-column-cards">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="jira-card"
                    onClick={() => onSelectTask(task)}
                  >
                    <div className="jira-card-title">{task.title}</div>
                    <div className="jira-card-footer">
                      <div className="jira-card-key-group">
                        <span className="jira-type-icon task-sm">?</span>
                        <span className="jira-card-key">TASK-{task.id}</span>
                      </div>
                      <div className="jira-card-meta-right">
                        {renderPriorityIcon(task.priority)}
                        <div
                          className="jira-card-move-menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {col.id !== "TODO" && (
                            <button
                              type="button"
                              className="jira-move-btn"
                              title="Move to To Do"
                              onClick={() => handleQuickMove(task, "TODO")}
                            >
                              ?
                            </button>
                          )}
                          {col.id === "TODO" && (
                            <button
                              type="button"
                              className="jira-move-btn"
                              title="Move to In Progress"
                              onClick={() => handleQuickMove(task, "IN_PROGRESS")}
                            >
                              ?
                            </button>
                          )}
                          {col.id === "IN_PROGRESS" && (
                            <button
                              type="button"
                              className="jira-move-btn"
                              title="Move to Done"
                              onClick={() => handleQuickMove(task, "DONE")}
                            >
                              ?
                            </button>
                          )}
                          {col.id === "DONE" && (
                            <button
                              type="button"
                              className="jira-move-btn"
                              title="Move back to In Progress"
                              onClick={() => handleQuickMove(task, "IN_PROGRESS")}
                            >
                              ?
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Inline Quick Create Card */}
                {inlineCreateColumn === col.id ? (
                  <div className="jira-inline-create-box">
                    <textarea
                      rows={2}
                      value={inlineTitle}
                      onChange={(e) => setInlineTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      autoFocus
                      className="jira-textarea"
                    />
                    <div className="jira-inline-actions">
                      <button
                        type="button"
                        className="jira-btn jira-btn-primary jira-btn-sm"
                        onClick={() => handleInlineSubmit(col.id)}
                        disabled={creatingInline || !inlineTitle.trim()}
                      >
                        {creatingInline ? "Adding..." : "Add issue"}
                      </button>
                      <button
                        type="button"
                        className="jira-btn jira-btn-subtle jira-btn-sm"
                        onClick={() => {
                          setInlineCreateColumn(null);
                          setInlineTitle("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="jira-add-card-btn"
                    onClick={() => {
                      if (!currentProject) {
                        onOpenCreate();
                      } else {
                        setInlineCreateColumn(col.id);
                        setInlineTitle("");
                      }
                    }}
                  >
                    + Create issue
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
