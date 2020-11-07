import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect } from "react";
import MultilegUpdateManager from "./MultilegUpdateManager";
import OrdersUpdateManager from "./OrdersUpdateManager";
import PositionUpdateManager from "./PositionUpdateManager";
import THLUpdateManager from "./THLUpdateManager";

const UpdateManager: React.FC = () => {
  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  useEffect(() => {
    if (!isLogged) {
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
    </>
  );
};

export default UpdateManager;
