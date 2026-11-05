import { useState, type FormEvent } from "react";
import type { Project, Organisation } from "../api/types";
import { projectApi } from "../api/endpoints";

interface JiraProjectsViewProps {
  projects: Project[];
  organisations: Organisation[];
  isAdmin: boolean;
  onSelectProject: (proj: Project) => void;
  onRefreshProjects: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function JiraProjectsView({
  projects,
  organisations,
  isAdmin,
  onSelectProject,
  onRefreshProjects,
  showToast,
}: JiraProjectsViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(organisations[0]?.id || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!selectedOrgId || !name.trim()) {
      showToast("Please provide organisation and project name", "error");
      return;
    }

    setCreating(true);
    try {
      await projectApi.create(selectedOrgId, {
        name: name.trim(),
        description: description.trim() || name.trim(),
      });
      showToast(`Project "${name}" created!`, "success");
      setName("");
      setDescription("");
      setModalOpen(false);
      onRefreshProjects();
    } catch (err: any) {
      showToast(err.message || "Failed to create project", "error");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(proj: Project) {
    if (!window.confirm(`Are you sure you want to delete project "${proj.name}"?`)) return;

    try {
      await projectApi.remove(proj.id);
      showToast(`Project "${proj.name}" deleted`, "success");
      onRefreshProjects();
    } catch (err: any) {
      showToast(err.message || "Failed to delete project", "error");
    }
  }

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="jira-projects-page">
      <div className="jira-view-header">
        <div>
          <h1 className="jira-view-title">Projects</h1>
          <p className="jira-view-subtitle">Manage all software projects and team spaces</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="jira-btn jira-btn-primary"
            onClick={() => {
              if (organisations.length > 0 && !selectedOrgId) {
                setSelectedOrgId(organisations[0].id);
              }
              setModalOpen(true);
            }}
          >
            Create project
          </button>
        )}
      </div>

      <div className="jira-filter-bar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="jira-search-input"
        />
      </div>

      <div className="jira-table-container">
        {filtered.length === 0 ? (
          <div className="jira-empty-state">
            <p>No projects found</p>
          </div>
        ) : (
          <table className="jira-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Organisation</th>
                <th>Type</th>
                <th>Description</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((proj) => (
                <tr key={proj.id} className="jira-table-row">
                  <td onClick={() => onSelectProject(proj)} style={{ cursor: "pointer" }}>
                    <div className="jira-proj-cell">
                      <span className="jira-proj-avatar">??</span>
                      <strong className="jira-proj-title">{proj.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="jira-org-badge">
                      {proj.organisation?.name || "Standard workspace"}
                    </span>
                  </td>
                  <td>
                    <span className="jira-text-muted">Software project</span>
                  </td>
                  <td>
                    <span className="jira-desc-preview">{proj.description}</span>
                  </td>
                  <td>
                    <div className="jira-row-actions">
                      <button
                        type="button"
                        className="jira-btn jira-btn-subtle jira-btn-sm"
                        onClick={() => onSelectProject(proj)}
                      >
                        Open board
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          className="jira-icon-btn-danger"
                          title="Delete project"
                          onClick={() => handleDelete(proj)}
                        >
                          ??
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Project Modal */}
      {modalOpen && (
        <div className="jira-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jira-modal-header">
              <h2>Create project</h2>
              <button
                type="button"
                className="jira-close-btn"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="jira-modal-body">
                <div className="jira-field">
                  <label>Organisation workspace *</label>
                  {organisations.length > 0 ? (
                    <select
                      value={selectedOrgId}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      className="jira-select"
                      required
                    >
                      {organisations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="jira-text-warning">
                      No organisations exist yet. Please create an organisation workspace first.
                    </p>
                  )}
                </div>

                <div className="jira-field">
                  <label>Project name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mobile App, Platform Core"
                    className="jira-input"
                    required
                  />
                </div>

                <div className="jira-field">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the project"
                    className="jira-textarea"
                  />
                </div>
              </div>

              <div className="jira-modal-footer">
                <button
                  type="button"
                  className="jira-btn jira-btn-subtle"
                  onClick={() => setModalOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="jira-btn jira-btn-primary"
                  disabled={creating || !name.trim() || !selectedOrgId}
                >
                  {creating ? "Creating..." : "Create project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
