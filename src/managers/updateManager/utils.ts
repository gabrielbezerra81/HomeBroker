interface Params {
  previousUpdateMode: "reactive" | "proactive" | undefined;
  updateMode: "reactive" | "proactive";
  previousUpdateInterval: number | undefined;
  updateInterval: number;
}

export default function checkIfUpdateConfigChanged({
  previousUpdateMode,
  updateMode,
  previousUpdateInterval,
  updateInterval,
}: Params): boolean {
  if (previousUpdateMode === undefined) {
    return false;
  }

  if (previousUpdateMode !== updateMode) {
    return true;
  }

  if (updateMode === "proactive" && previousUpdateInterval === undefined) {
    return false;
  }

  if (updateMode === "proactive" && previousUpdateInterval !== updateInterval) {
    return true;
  }

  return false;
}
