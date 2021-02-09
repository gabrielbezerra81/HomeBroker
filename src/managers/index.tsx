import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import AuthManager from "managers/authManager/AuthManager";
import React, { useEffect } from "react";
import BoxUpdateManager from "modules/multiBox/manager/BoxUpdateManager";
import MultilegUpdateManager from "modules/multileg/manager/MultilegUpdateManager";
import OrdersUpdateManager from "../modules/ordersExec/manager/OrdersUpdateManager";
import PositionUpdateManager from "../modules/position/manager/PositionUpdateManager";
import THLUpdateManager from "../modules/thl/manager/THLUpdateManager";
import api from "api/apiConfig";

const MainManager: React.FC = () => {
  const {
    systemReducer: { isLogged, token },
  } = useStateStorePrincipal();

  useEffect(() => {
    api.defaults.headers.authorization = `${token.tokenType} ${token.accessToken}`;
  }, [token]);

  if (!isLogged || !token || !api.defaults.headers.authorization) {
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
