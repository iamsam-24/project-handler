import { useState, useEffect, type FormEvent } from "react";
import { taskApi } from "../api/endpoints";
import type { Project, TaskPriority, TasksStatus } from "../api/types";

interface JiraCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: Project | null;
  onIssueCreated: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function JiraCreateModal({
  isOpen,
  onClose,
  currentProject,
  onIssueCreated,
  showToast,
}: JiraCreateModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TasksStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSelectedProjectId(currentProject?.id || "");
  }, [currentProject?.id, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedProjectId || !title.trim()) {
      showToast("Please choose a project and enter an issue summary", "error");
      return;
    }

    setBusy(true);
    try {
      await taskApi.create(selectedProjectId, {
        title: title.trim(),
        status,
        priority,
      });
      showToast("Issue created successfully!", "success");
      setTitle("");
      setStatus("TODO");
      setPriority("MEDIUM");
      onClose();
      onIssueCreated();
    } catch (err: any) {
      showToast(err.message || "Failed to create issue", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="jira-modal-backdrop" onClick={onClose}>
      <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jira-modal-header">
          <h2>Create issue</h2>
          <button type="button" className="jira-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="jira-modal-body">
            <div className="jira-field">
              <label>Project *</label>
              {currentProject ? (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="jira-select"
                  required
                >
                  <option value={currentProject.id}>
                    {currentProject.name}
                  </option>
                </select>
              ) : (
                <p className="jira-text-warning">
                  Choose an organisation and then a project from the workspace context first.
                </p>
              )}
            </div>

            <div className="jira-field">
              <label>Issue type</label>
              <div className="jira-issue-type-badge">
                <span className="jira-type-icon task">?</span>
                <span>Task</span>
              </div>
            </div>

            <div className="jira-divider" />

            <div className="jira-field">
              <label>Summary *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="jira-input"
                required
                autoFocus
              />
            </div>

            <div className="jira-form-row">
              <div className="jira-field flex-1">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TasksStatus)}
                  className="jira-select"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="jira-field flex-1">
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
            </div>
          </div>

          <div className="jira-modal-footer">
            <button
              type="button"
              className="jira-btn jira-btn-subtle"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="jira-btn jira-btn-primary"
              disabled={busy || !title.trim() || !selectedProjectId}
            >
              {busy ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
