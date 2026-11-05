import { useState, type FormEvent } from "react";
import type { Organisation } from "../api/types";
import { membershipApi, roleApi, userApi } from "../api/endpoints";

interface JiraTeamViewProps {
  organisations: Organisation[];
  username: string | null;
  isAdmin: boolean;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function JiraTeamView({
  organisations,
  username,
  isAdmin,
  showToast,
}: JiraTeamViewProps) {
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [orgId, setOrgId] = useState(organisations[0]?.id || "");
  const [addingMember, setAddingMember] = useState(false);

  // Role form
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("ROLE_ADMIN");
  const [addingRole, setAddingRole] = useState(false);

  // User deletion
  const [delUserId, setDelUserId] = useState("");
  const [deletingUser, setDeletingUser] = useState(false);

  async function handleAddMember(e: FormEvent) {
    e.preventDefault();
    if (!userId.trim() || !orgId) return;

    setAddingMember(true);
    try {
      await membershipApi.create({
        userId: userId.trim(),
        orgId,
      });
      showToast("Team member added to organisation!", "success");
      setUserId("");
      setMemberModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to add member", "error");
    } finally {
      setAddingMember(false);
    }
  }

  async function handleAddRole(e: FormEvent) {
    e.preventDefault();
    if (!roleName.trim()) return;

    setAddingRole(true);
    try {
      await roleApi.create({ nameRole: roleName.trim() });
      showToast(`Role "${roleName}" registered!`, "success");
      setRoleModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to add role", "error");
    } finally {
      setAddingRole(false);
    }
  }

  async function handleDeleteUser(e: FormEvent) {
    e.preventDefault();
    if (!delUserId.trim()) return;
    if (!window.confirm(`Permanently delete user account?`)) return;

    setDeletingUser(true);
    try {
      await userApi.remove(delUserId.trim());
      showToast("User account deleted", "success");
      setDelUserId("");
    } catch (err: any) {
      showToast(err.message || "Failed to delete user", "error");
    } finally {
      setDeletingUser(false);
    }
  }

  return (
    <div className="jira-team-page">
      <div className="jira-view-header">
        <div>
          <h1 className="jira-view-title">Team & Access Governance</h1>
          <p className="jira-view-subtitle">Manage team member memberships, organisation assignments, and roles</p>
        </div>
        {isAdmin && (
          <div className="jira-btn-group">
            <button
              type="button"
              className="jira-btn jira-btn-secondary"
              onClick={() => setRoleModalOpen(true)}
            >
              Add system role
            </button>
            <button
              type="button"
              className="jira-btn jira-btn-primary"
              onClick={() => {
                if (organisations.length > 0 && !orgId) {
                  setOrgId(organisations[0].id);
                }
                setMemberModalOpen(true);
              }}
            >
              Add team member
            </button>
          </div>
        )}
      </div>

      <div className="jira-team-grid">
        <div className="jira-card-panel">
          <div className="jira-panel-header">
            <h3>Current User</h3>
          </div>
          <div className="jira-panel-body">
            <div className="jira-user-profile-row">
              <div className="jira-avatar-lg">{username ? username.substring(0, 2).toUpperCase() : "U"}</div>
              <div>
                <strong>{username}</strong>
                <p className="jira-text-muted">Account role: {isAdmin ? "Administrator" : "Standard Member"}</p>
                <span className={`jira-role-pill ${isAdmin ? "admin" : ""}`}>
                  {isAdmin ? "ROLE_ADMIN" : "ROLE_USER"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="jira-card-panel">
            <div className="jira-panel-header">
              <h3>User Account Governance</h3>
            </div>
            <div className="jira-panel-body">
              <p className="jira-text-muted" style={{ marginBottom: "1rem" }}>
                Remove accounts that no longer require system access.
              </p>
              <form onSubmit={handleDeleteUser} className="jira-inline-form">
                <input
                  type="text"
                  value={delUserId}
                  onChange={(e) => setDelUserId(e.target.value)}
                  placeholder="Paste user account ID"
                  className="jira-input flex-1"
                  required
                />
                <button
                  type="submit"
                  className="jira-btn jira-btn-danger"
                  disabled={deletingUser || !delUserId.trim()}
                >
                  {deletingUser ? "Removing..." : "Delete User"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {memberModalOpen && (
        <div className="jira-modal-backdrop" onClick={() => setMemberModalOpen(false)}>
          <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jira-modal-header">
              <h2>Add team member to organisation</h2>
              <button
                type="button"
                className="jira-close-btn"
                onClick={() => setMemberModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="jira-modal-body">
                <div className="jira-field">
                  <label>Organisation workspace *</label>
                  <select
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="jira-select"
                    required
                  >
                    {organisations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="jira-field">
                  <label>User Account ID *</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user identifier"
                    className="jira-input"
                    required
                  />
                </div>
              </div>

              <div className="jira-modal-footer">
                <button
                  type="button"
                  className="jira-btn jira-btn-subtle"
                  onClick={() => setMemberModalOpen(false)}
                  disabled={addingMember}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="jira-btn jira-btn-primary"
                  disabled={addingMember || !userId.trim() || !orgId}
                >
                  {addingMember ? "Adding..." : "Add member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {roleModalOpen && (
        <div className="jira-modal-backdrop" onClick={() => setRoleModalOpen(false)}>
          <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jira-modal-header">
              <h2>Add system role</h2>
              <button
                type="button"
                className="jira-close-btn"
                onClick={() => setRoleModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddRole}>
              <div className="jira-modal-body">
                <div className="jira-field">
                  <label>Role name *</label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. ROLE_ADMIN, ROLE_USER"
                    className="jira-input"
                    required
                  />
                </div>
              </div>

              <div className="jira-modal-footer">
                <button
                  type="button"
                  className="jira-btn jira-btn-subtle"
                  onClick={() => setRoleModalOpen(false)}
                  disabled={addingRole}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="jira-btn jira-btn-primary"
                  disabled={addingRole || !roleName.trim()}
                >
                  {addingRole ? "Saving..." : "Add role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
