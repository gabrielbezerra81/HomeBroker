import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React from "react";
import BoxUpdateManager from "./BoxUpdateManager";
import MultilegUpdateManager from "./MultilegUpdateManager";
import OrdersUpdateManager from "./OrdersUpdateManager";
import PositionUpdateManager from "./PositionUpdateManager";
import THLUpdateManager from "./THLUpdateManager";

const UpdateManager: React.FC = () => {
  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

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
