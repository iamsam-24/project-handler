import { useState, useEffect, type FormEvent } from "react";
import { taskApi } from "../api/endpoints";
import type { Task, TaskPriority, TasksStatus } from "../api/types";

interface JiraIssueDetailModalProps {
  task: Task | null;
  isAdmin: boolean;
  onClose: () => void;
  onUpdated: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function JiraIssueDetailModal({
  task,
  isAdmin,
  onClose,
  onUpdated,
  showToast,
}: JiraIssueDetailModalProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TasksStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  if (!task) return null;

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!task || !title.trim()) return;

    setSaving(true);
    try {
      await taskApi.update(task.id, {
        title: title.trim(),
        status,
        priority,
      });
      showToast(`Updated TASK-${task.id}`, "success");
      onUpdated();
      onClose();
    } catch (err: any) {
      showToast(err.message || "Failed to update issue", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!task) return;
    if (!window.confirm(`Delete issue TASK-${task.id}?`)) return;

    setDeleting(true);
    try {
      await taskApi.remove(task.id);
      showToast(`Issue TASK-${task.id} deleted`, "success");
      onUpdated();
      onClose();
    } catch (err: any) {
      showToast(err.message || "Failed to delete issue", "error");
    } finally {
      setDeleting(false);
    }
  }

  const issueKey = `TASK-${task.id}`;

  return (
    <div className="jira-modal-backdrop" onClick={onClose}>
      <div className="jira-issue-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header with Breadcrumb & Close */}
        <div className="jira-issue-modal-header">
          <div className="jira-breadcrumbs">
            <span className="jira-crumb-proj">
              {task.project?.name || "PROJECT"}
            </span>
            <span className="jira-crumb-sep">/</span>
            <span className="jira-crumb-key">{issueKey}</span>
          </div>
          <div className="jira-issue-modal-actions">
            {isAdmin && (
              <button
                type="button"
                className="jira-icon-btn-danger"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete issue"
              >
                ??
              </button>
            )}
            <button type="button" className="jira-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="jira-issue-modal-content">
          <div className="jira-issue-main">
            {/* Title */}
            <div className="jira-issue-title-wrapper">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="jira-issue-title-input"
                required
              />
            </div>

            {/* Description Section */}
            <div className="jira-section">
              <label className="jira-section-title">Description</label>
              <div className="jira-desc-box">
                <p>Task item tracked in {task.project?.name || "project workspace"}.</p>
              </div>
            </div>

            {/* Activity */}
            <div className="jira-section">
              <label className="jira-section-title">Activity</label>
              <div className="jira-activity-log">
                <div className="jira-avatar-sm">U</div>
                <div className="jira-activity-text">
                  Issue created under project <strong>{task.project?.name || "Workspace"}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Details */}
          <div className="jira-issue-sidebar">
            <div className="jira-field">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TasksStatus)}
                className={`jira-status-select status-${status.toLowerCase().replace("_", "-")}`}
              >
                <option value="TODO">TO DO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <div className="jira-field">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="jira-select"
              >
                <option value="VERYHIGH">Highest</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="jira-sidebar-meta">
              <div className="jira-meta-row">
                <span className="jira-meta-label">Project</span>
                <span className="jira-meta-val">{task.project?.name || "Global"}</span>
              </div>
              <div className="jira-meta-row">
                <span className="jira-meta-label">Issue Key</span>
                <span className="jira-meta-val"><code>{issueKey}</code></span>
              </div>
            </div>

            <div className="jira-issue-sidebar-footer">
              <button
                type="submit"
                className="jira-btn jira-btn-primary jira-btn-full"
                disabled={saving || !title.trim()}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
