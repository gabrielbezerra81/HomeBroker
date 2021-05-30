import isSamePromisesIdAsyncInterval from "./isSamePromisesIdAsyncInterval";

export default function shouldDispatchAsyncUpdate(
  interval: any,
  stateInterval: any,
) {
  if (stateInterval) {
    // when interval is cancelled, a new one is started right after. this check ensures that the last promise
    // of the old interval only dispatches if interval_ordersExec variable has not been updated in redux yet
    const isTheSamePromise = isSamePromisesIdAsyncInterval(
      interval,
      stateInterval,
    );

    if (isTheSamePromise === false) {
      return false;
    }
  }

  const shouldDispatch =
    !stateInterval || (!!stateInterval && stateInterval.stopped === false);

  return shouldDispatch;
}
