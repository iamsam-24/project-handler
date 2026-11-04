/** User-facing copy for this project (not the Sylva demo text). */
export const brand = {
  name: "Project2",
  ghost: "PROJECT2",
  homeAria: "Project2 — home",
  dock: ["Home", "Projects", "Tasks", "Chat"] as const,
  headline: ["Run projects", "with your team"],
  lede:
    "Organisations, projects, tasks, and live chat — one workspace for how your team actually ships.",
  aboutLabel: "For teams",
  aboutTitle: "Stay aligned.",
  aboutAria: "About Project2",
  noteLabel: "Workspace",
  noteTitle: "Get to work",
  noteAria: "Open your workspace",
  explore: "Enter workspace",
  playAria: "Continue",
  stats: [
    { label: "Built for", value: "teams" },
    { label: "Track", value: "every task" },
  ] as const,
  scroll: "Continue",
};

export type HeroNavTarget = "home" | "projects" | "tasks" | "chat" | "workspace";
