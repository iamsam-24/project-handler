import { useState, type FormEvent, type ReactNode } from "react";

import { ApiError } from "../api/client";
import {
  chatSocketUrl,
  membershipApi,
  organisationApi,
  projectApi,
  roleApi,
  taskApi,
} from "../api/endpoints";
import type { TaskPriority, TasksStatus } from "../api/types";
import { readWorkspace, writeWorkspace } from "../lib/workspaceStore";

type Tab = "overview" | "org" | "project" | "tasks" | "team" | "chat";

export function Workspace({
  initialTab = "overview",
  onBack,
}: {
  initialTab?: Tab;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [memory, setMemory] = useState(readWorkspace);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function remember(patch: Partial<typeof memory>) {
    setMemory(writeWorkspace(patch));
  }

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    setError(null);
    setToast(null);
    try {
      await action();
      setToast(success);
    } catch (err) {
      setError(err instanceof ApiError ? softError(err) : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="workspace-shell">
      <header className="workspace-shell__top">
        <div>
          <button type="button" className="text-link" onClick={onBack}>
            ← Back to home
          </button>
          <h1>Workspace</h1>
          <p>Manage organisations, projects, tasks, and team chat.</p>
        </div>
      </header>

      <nav className="workspace-shell__nav">
        {(
          [
            ["overview", "Overview"],
            ["org", "Organisation"],
            ["project", "Projects"],
            ["tasks", "Tasks"],
            ["team", "Team"],
            ["chat", "Chat"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`nav-chip ${tab === id ? "is-active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {(toast || error) && (
        <div className={`banner ${error ? "banner--error" : "banner--ok"}`}>
          {error || toast}
        </div>
      )}

      {tab === "overview" ? (
        <Overview
          memory={memory}
          onOpen={(next) => setTab(next)}
        />
      ) : null}

      {tab === "org" ? (
        <OrgPanel
          busy={busy}
          memory={memory}
          remember={remember}
          run={run}
        />
      ) : null}

      {tab === "project" ? (
        <ProjectPanel
          busy={busy}
          memory={memory}
          remember={remember}
          run={run}
        />
      ) : null}

      {tab === "tasks" ? (
        <TaskPanel busy={busy} memory={memory} run={run} />
      ) : null}

      {tab === "team" ? (
        <TeamPanel
          busy={busy}
          memory={memory}
          remember={remember}
          run={run}
        />
      ) : null}

      {tab === "chat" ? <ChatPanel memory={memory} /> : null}
    </div>
  );
}

function Overview({
  memory,
  onOpen,
}: {
  memory: ReturnType<typeof readWorkspace>;
  onOpen: (tab: Tab) => void;
}) {
  return (
    <div className="overview-grid">
      <article className="soft-card">
        <h2>Organisation</h2>
        <p>{memory.orgName || "Create or open an organisation for your team."}</p>
        <button type="button" className="btn btn--primary" onClick={() => onOpen("org")}>
          Open
        </button>
      </article>
      <article className="soft-card">
        <h2>Projects</h2>
        <p>{memory.projectName || "Spin up a project under your organisation."}</p>
        <button type="button" className="btn btn--primary" onClick={() => onOpen("project")}>
          Open
        </button>
      </article>
      <article className="soft-card">
        <h2>Tasks</h2>
        <p>Create, update, and close work items on a project.</p>
        <button type="button" className="btn btn--primary" onClick={() => onOpen("tasks")}>
          Open
        </button>
      </article>
      <article className="soft-card">
        <h2>Team & chat</h2>
        <p>Add members to an organisation and talk live on a project.</p>
        <div className="row">
          <button type="button" className="btn btn--ghost" onClick={() => onOpen("team")}>
            Team
          </button>
          <button type="button" className="btn btn--primary" onClick={() => onOpen("chat")}>
            Chat
          </button>
        </div>
      </article>
    </div>
  );
}

function OrgPanel({
  busy,
  memory,
  remember,
  run,
}: {
  busy: boolean;
  memory: ReturnType<typeof readWorkspace>;
  remember: (patch: Partial<ReturnType<typeof readWorkspace>>) => void;
  run: (action: () => Promise<unknown>, success: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [lookupId, setLookupId] = useState(memory.orgId);

  return (
    <Section title="Organisation" blurb="Your company or team space.">
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void run(
            () => organisationApi.create({ name: name.trim(), slug: slug.trim() }),
            "Organisation created. Save its link below when you have it, then open projects.",
          ).then(() => remember({ orgName: name.trim() }));
        }}
      >
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Short link (slug)">
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </Field>
        <button className="btn btn--primary" type="submit" disabled={busy}>
          Create organisation
        </button>
      </form>

      <hr className="soft-rule" />

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            const org = await organisationApi.get(lookupId.trim());
            remember({ orgId: org.id, orgName: org.name });
            return org;
          }, `Opened ${lookupId.trim() ? "organisation" : "organisation"}.`);
        }}
      >
        <Field label="Saved organisation link">
          <input
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Paste organisation id from your admin records"
          />
        </Field>
        <div className="row">
          <button className="btn btn--primary" type="submit" disabled={busy || !lookupId.trim()}>
            Open
          </button>
          <button
            className="btn btn--danger"
            type="button"
            disabled={busy || !lookupId.trim()}
            onClick={() =>
              void run(
                () => organisationApi.remove(lookupId.trim()),
                "Organisation removed.",
              ).then(() => {
                remember({ orgId: "", orgName: "" });
                setLookupId("");
              })
            }
          >
            Delete
          </button>
        </div>
      </form>

      {memory.orgName ? (
        <p className="muted">Current: {memory.orgName}</p>
      ) : null}
    </Section>
  );
}

function ProjectPanel({
  busy,
  memory,
  remember,
  run,
}: {
  busy: boolean;
  memory: ReturnType<typeof readWorkspace>;
  remember: (patch: Partial<ReturnType<typeof readWorkspace>>) => void;
  run: (action: () => Promise<unknown>, success: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [orgId, setOrgId] = useState(memory.orgId);
  const [projectId, setProjectId] = useState(memory.projectId);

  return (
    <Section title="Projects" blurb="Workstreams under an organisation.">
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void run(
            () =>
              projectApi.create(orgId.trim(), {
                name: name.trim(),
                description: description.trim(),
              }),
            "Project created. Save its link below when you have it.",
          ).then(() => remember({ orgId: orgId.trim(), projectName: name.trim() }));
        }}
      >
        <Field label="Organisation link">
          <input value={orgId} onChange={(e) => setOrgId(e.target.value)} required />
        </Field>
        <Field label="Project name">
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Description">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Field>
        <button className="btn btn--primary" type="submit" disabled={busy}>
          Create project
        </button>
      </form>

      <hr className="soft-rule" />

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            const project = await projectApi.get(projectId.trim());
            remember({
              projectId: project.id,
              projectName: project.name,
              orgId: project.organisation?.id || memory.orgId,
            });
            return project;
          }, "Project opened.");
        }}
      >
        <Field label="Saved project link">
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Paste project id from your admin records"
          />
        </Field>
        <div className="row">
          <button className="btn btn--primary" type="submit" disabled={busy || !projectId.trim()}>
            Open
          </button>
          <button
            className="btn btn--danger"
            type="button"
            disabled={busy || !projectId.trim()}
            onClick={() =>
              void run(
                () => projectApi.remove(projectId.trim()),
                "Project and its tasks removed.",
              ).then(() => {
                remember({ projectId: "", projectName: "" });
                setProjectId("");
              })
            }
          >
            Delete
          </button>
        </div>
      </form>
    </Section>
  );
}

function TaskPanel({
  busy,
  memory,
  run,
}: {
  busy: boolean;
  memory: ReturnType<typeof readWorkspace>;
  run: (action: () => Promise<unknown>, success: string) => Promise<void>;
}) {
  const [projectId, setProjectId] = useState(memory.projectId);
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TasksStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  return (
    <Section title="Tasks" blurb="Track work on a project.">
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void run(
            () =>
              taskApi.create(projectId.trim(), {
                title: title.trim(),
                status,
                priority,
              }),
            "Task created.",
          );
        }}
      >
        <Field label="Project link">
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
        </Field>
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <div className="two-col">
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as TasksStatus)}>
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
              <option value="FAILED">Failed</option>
            </select>
          </Field>
          <Field label="Priority">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="VERYHIGH">Very high</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </Field>
        </div>
        <button className="btn btn--primary" type="submit" disabled={busy}>
          Add task
        </button>
      </form>

      <hr className="soft-rule" />

      <div className="form-grid">
        <Field label="Task number">
          <input
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            inputMode="numeric"
            placeholder="e.g. 12"
          />
        </Field>
        <div className="row wrap">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={busy || !taskId.trim()}
            onClick={() =>
              void run(async () => {
                const task = await taskApi.get(taskId.trim());
                setTitle(task.title);
                setStatus(task.status);
                setPriority(task.priority);
                return task;
              }, "Task loaded.")
            }
          >
            Load
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={busy || !taskId.trim()}
            onClick={() =>
              void run(
                () =>
                  taskApi.update(taskId.trim(), {
                    title: title.trim(),
                    status,
                    priority,
                  }),
                "Task updated.",
              )
            }
          >
            Save changes
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={busy || !taskId.trim()}
            onClick={() =>
              void run(() => taskApi.remove(taskId.trim()), "Task deleted.").then(() =>
                setTaskId(""),
              )
            }
          >
            Delete
          </button>
        </div>
      </div>
    </Section>
  );
}

function TeamPanel({
  busy,
  memory,
  remember,
  run,
}: {
  busy: boolean;
  memory: ReturnType<typeof readWorkspace>;
  remember: (patch: Partial<ReturnType<typeof readWorkspace>>) => void;
  run: (action: () => Promise<unknown>, success: string) => Promise<void>;
}) {
  const [userId, setUserId] = useState(memory.userId);
  const [orgId, setOrgId] = useState(memory.orgId);
  const [memberId, setMemberId] = useState("");
  const [roleName, setRoleName] = useState("USER_ROLE");

  return (
    <Section title="Team" blurb="Invite people into an organisation.">
      <form
        className="form-grid"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          remember({ userId: userId.trim(), orgId: orgId.trim() });
          void run(
            () =>
              membershipApi.create({
                userId: userId.trim(),
                orgId: orgId.trim(),
              }),
            "Member added.",
          );
        }}
      >
        <Field label="Member user link">
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User id from admin records"
            required
          />
        </Field>
        <Field label="Organisation link">
          <input value={orgId} onChange={(e) => setOrgId(e.target.value)} required />
        </Field>
        <button className="btn btn--primary" type="submit" disabled={busy}>
          Add member
        </button>
      </form>

      <hr className="soft-rule" />

      <div className="form-grid">
        <Field label="Membership number">
          <input
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            inputMode="numeric"
          />
        </Field>
        <div className="row">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={busy || !memberId.trim()}
            onClick={() =>
              void run(() => membershipApi.get(memberId.trim()), "Membership loaded.")
            }
          >
            View
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={busy || !memberId.trim()}
            onClick={() =>
              void run(() => membershipApi.remove(memberId.trim()), "Membership removed.")
            }
          >
            Remove
          </button>
        </div>
      </div>

      <hr className="soft-rule" />

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          void run(
            () => roleApi.create({ nameRole: roleName.trim() }),
            "Role available for new accounts.",
          );
        }}
      >
        <Field label="Starter role name">
          <input value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
        </Field>
        <button className="btn btn--ghost" type="submit" disabled={busy}>
          Add role
        </button>
      </form>
    </Section>
  );
}

function ChatPanel({ memory }: { memory: ReturnType<typeof readWorkspace> }) {
  const [projectId, setProjectId] = useState(memory.projectId);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  function connect() {
    socket?.close();
    const next = new WebSocket(chatSocketUrl(projectId.trim()));
    next.onopen = () => {
      setConnected(true);
      setLines((prev) => [...prev, "Connected"]);
    };
    next.onclose = () => {
      setConnected(false);
      setLines((prev) => [...prev, "Disconnected"]);
    };
    next.onmessage = (event) => {
      setLines((prev) => [...prev, String(event.data)]);
    };
    next.onerror = () => setLines((prev) => [...prev, "Could not stay connected"]);
    setSocket(next);
  }

  return (
    <Section title="Project chat" blurb="Live messages for everyone on the same project.">
      <div className="form-grid">
        <Field label="Project link">
          <input value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        </Field>
        <div className="row">
          <button type="button" className="btn btn--primary" onClick={connect} disabled={connected}>
            Join room
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={!connected}
            onClick={() => socket?.close()}
          >
            Leave
          </button>
        </div>
      </div>

      <div className="chat-log">
        {lines.length === 0 ? <p className="muted">No messages yet.</p> : null}
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} className="chat-line">
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="chat-compose">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && socket?.readyState === WebSocket.OPEN) {
              socket.send(draft.trim());
              setLines((prev) => [...prev, `You: ${draft.trim()}`]);
              setDraft("");
            }
          }}
        />
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            if (!draft.trim() || socket?.readyState !== WebSocket.OPEN) return;
            socket.send(draft.trim());
            setLines((prev) => [...prev, `You: ${draft.trim()}`]);
            setDraft("");
          }}
        >
          Send
        </button>
      </div>
    </Section>
  );
}

function Section({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <header className="panel__header">
        <h2>{title}</h2>
        <p>{blurb}</p>
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function softError(err: ApiError): string {
  if (err.status === 401) return "Session expired. Sign in again.";
  if (err.status === 404) return "That item was not found.";
  if (err.status === 409 || err.body.toLowerCase().includes("already")) {
    return "That name is already taken.";
  }
  return "Request failed. Check the details and try again.";
}
