import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect } from "react";
import BoxUpdateManager from "./BoxUpdateManager";
import MultilegUpdateManager from "./MultilegUpdateManager";
import OrdersUpdateManager from "./OrdersUpdateManager";
import PositionUpdateManager from "./PositionUpdateManager";
import THLUpdateManager from "./THLUpdateManager";

const UpdateManager: React.FC = () => {
  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  const previousIsLogged = usePrevious(isLogged);

  useEffect(() => {
    if (!isLogged && previousIsLogged) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  if (!isLogged) {
    return null;
  }

  return (
    <>
      <MultilegUpdateManager />
      <OrdersUpdateManager />
      <PositionUpdateManager />
      <THLUpdateManager />
      <BoxUpdateManager />
    </>
  );
};

export default UpdateManager;
