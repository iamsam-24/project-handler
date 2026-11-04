import { useCallback } from "react";
import { SylvaHero } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

import type { HeroNavTarget } from "../content/brand";
import { applyProjectCopy } from "../hero/applyProjectCopy";
import { useAuth } from "../auth/AuthContext";

export function HomeHero({
  onNavigate,
}: {
  onNavigate: (target: HeroNavTarget) => void;
}) {
  const { username, logout } = useAuth();

  const applyScene = useCallback(
    (frame: HTMLIFrameElement) => {
      applyProjectCopy(frame, onNavigate);
    },
    [onNavigate],
  );

  return (
    <div className="home-hero">
      <div className="shader-frame">
        <SylvaHero
          variant="living-green"
          headingFont="lexend"
          bodyFont="lexend"
          headingWeight="300"
          bodyWeight="300"
          primaryColor="#ffffff"
          headingSize={63}
          bodySize={16.5}
          headingLetterSpacing={-0.006}
          applyScene={applyScene}
        />
      </div>

      <div className="home-hero__bar">
        <span className="pill pill--on">{username}</span>
        <button type="button" className="btn btn--glass" onClick={() => onNavigate("workspace")}>
          Workspace
        </button>
        <button type="button" className="btn btn--ghost home-hero__logout" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
