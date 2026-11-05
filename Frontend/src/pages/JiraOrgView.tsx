import { useState, type FormEvent } from "react";
import type { Organisation, Project } from "../api/types";
import { organisationApi } from "../api/endpoints";

interface JiraOrgViewProps {
  organisations: Organisation[];
  projects: Project[];
  isAdmin: boolean;
  onRefreshOrgs: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function JiraOrgView({
  organisations,
  projects,
  isAdmin,
  onRefreshOrgs,
  showToast,
}: JiraOrgViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setCreating(true);
    try {
      await organisationApi.create({
        name: name.trim(),
        slug: slug.trim(),
      });
      showToast(`Organisation "${name}" created!`, "success");
      setName("");
      setSlug("");
      setModalOpen(false);
      onRefreshOrgs();
    } catch (err: any) {
      showToast(err.message || "Failed to create organisation", "error");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(org: Organisation) {
    if (
      !window.confirm(
        `Are you sure you want to delete "${org.name}"? All associated projects and issues will be removed.`,
      )
    ) {
      return;
    }

    try {
      await organisationApi.remove(org.id);
      showToast(`Organisation "${org.name}" removed`, "success");
      onRefreshOrgs();
    } catch (err: any) {
      showToast(err.message || "Failed to delete organisation", "error");
    }
  }

  return (
    <div className="jira-org-page">
      <div className="jira-view-header">
        <div>
          <h1 className="jira-view-title">Workspaces & Organisations</h1>
          <p className="jira-view-subtitle">Manage company workspaces, domains, and department boundaries</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="jira-btn jira-btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Create organisation
          </button>
        )}
      </div>

      <div className="jira-table-container">
        {organisations.length === 0 ? (
          <div className="jira-empty-state">
            <p>No organisations found</p>
          </div>
        ) : (
          <table className="jira-table">
            <thead>
              <tr>
                <th>Organisation Name</th>
                <th>Slug / Key</th>
                <th>Projects Count</th>
                <th style={{ width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organisations.map((org) => {
                const orgProjects = projects.filter((p) => p.organisation?.id === org.id);
                return (
                  <tr key={org.id} className="jira-table-row">
                    <td>
                      <div className="jira-proj-cell">
                        <span className="jira-proj-avatar">??</span>
                        <strong>{org.name}</strong>
                      </div>
                    </td>
                    <td>
                      <code className="jira-slug-tag">{org.slug}</code>
                    </td>
                    <td>
                      <span className="jira-badge">{orgProjects.length} projects</span>
                    </td>
                    <td>
                      {isAdmin && (
                        <button
                          type="button"
                          className="jira-icon-btn-danger"
                          title="Delete organisation"
                          onClick={() => handleDelete(org)}
                        >
                          ??
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="jira-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jira-modal-header">
              <h2>New organisation workspace</h2>
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
                  <label>Organisation name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                        );
                      }
                    }}
                    placeholder="e.g. Acme Corp"
                    className="jira-input"
                    required
                  />
                </div>

                <div className="jira-field">
                  <label>URL Slug / Domain *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. acme-corp"
                    className="jira-input"
                    required
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
                  disabled={creating || !name.trim() || !slug.trim()}
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
