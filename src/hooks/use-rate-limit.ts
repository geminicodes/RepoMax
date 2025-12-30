import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAnalysisUsage, getRateLimitSnapshot } from "@/lib/rateLimit";

const UPDATE_EVENT = "repomax:usage:update";

export function emitUsageUpdate() {
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function useRateLimit() {
  const { user, tier } = useAuth();
  const uid = user?.uid ?? null;

  const [used, setUsed] = useState(() => getAnalysisUsage(uid));

  const refresh = useCallback(() => {
    setUsed(getAnalysisUsage(uid));
  }, [uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener(UPDATE_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  // `used` is included so snapshot re-computes on updates, even though it re-reads localStorage internally.
  const snapshot = useMemo(() => getRateLimitSnapshot({ uid, tier }), [uid, tier, used]);

  return { snapshot, refresh };
}

