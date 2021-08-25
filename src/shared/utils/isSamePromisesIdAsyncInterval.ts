import { SetIntervalAsyncTimer } from "set-interval-async/dynamic";

export default function isSamePromisesIdAsyncInterval(
  interval: SetIntervalAsyncTimer,
  stateInterval: SetIntervalAsyncTimer | null,
) {
  const promises = (interval as any).promises;
  const statePromises = (stateInterval as any)?.promises;

  const id = Object.keys(promises)[0] || "";
  const stateId = statePromises ? Object.keys(statePromises)[0] : "";

  const isEqual = id === stateId;

  if (isEqual === false) {
    console.log("not the same timer, preventing a inconsistent state");
  }

  return isEqual;
}
