import { useCallback, useState } from "react";

import { useAuth } from "./auth/AuthContext";
import type { HeroNavTarget } from "./content/brand";
import { AuthScreen } from "./pages/AuthScreen";
import { HomeHero } from "./pages/HomeHero";
import { Workspace } from "./pages/Workspace";

type Screen = "home" | "workspace";

function workspaceTabFromHero(target: HeroNavTarget) {
  if (target === "projects") return "project" as const;
  if (target === "tasks") return "tasks" as const;
  if (target === "chat") return "chat" as const;
  return "overview" as const;
}

export function App() {
  const { isAuthenticated } = useAuth();
  const [screen, setScreen] = useState<Screen>("home");
  const [workspaceTab, setWorkspaceTab] = useState<
    "overview" | "org" | "project" | "tasks" | "team" | "chat"
  >("overview");

  const onHeroNavigate = useCallback((target: HeroNavTarget) => {
    if (target === "home") {
      setScreen("home");
      return;
    }
    setWorkspaceTab(workspaceTabFromHero(target));
    setScreen("workspace");
  }, []);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (screen === "workspace") {
    return (
      <Workspace
        key={workspaceTab}
        initialTab={workspaceTab}
        onBack={() => setScreen("home")}
      />
    );
  }

  return <HomeHero onNavigate={onHeroNavigate} />;
}
