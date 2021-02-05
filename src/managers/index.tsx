import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import AuthManager from "managers/authManager/AuthManager";
import React from "react";
import BoxUpdateManager from "./updateManager/BoxUpdateManager";
import MultilegUpdateManager from "./updateManager/MultilegUpdateManager";
import OrdersUpdateManager from "./updateManager/OrdersUpdateManager";
import PositionUpdateManager from "./updateManager/PositionUpdateManager";
import THLUpdateManager from "./updateManager/THLUpdateManager";

const MainManager: React.FC = () => {
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
      <AuthManager />
    </>
  );
};

export default MainManager;
