import { useState } from "react";

import { ApiError } from "../api/client";

export function useAsyncAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  async function run<T>(action: () => Promise<T>): Promise<T | undefined> {
    setBusy(true);
    setError(null);
    try {
      const value = await action();
      setResult(value);
      return value;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? `${err.status}: ${err.body || err.message}`
          : err instanceof Error
            ? err.message
            : "Unexpected error";
      setError(message);
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, result, setResult, run };
}
