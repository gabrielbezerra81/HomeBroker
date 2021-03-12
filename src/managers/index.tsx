import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import AuthManager from "managers/authManager/AuthManager";
import React, { useEffect } from "react";
import BoxUpdateManager from "modules/multiBox/manager/BoxUpdateManager";
import MultilegUpdateManager from "modules/multileg/manager/MultilegUpdateManager";
import OrdersUpdateManager from "../modules/ordersExec/manager/OrdersUpdateManager";
import PositionUpdateManager from "../modules/position/manager/PositionUpdateManager";
import THLUpdateManager from "../modules/thl/manager/THLUpdateManager";
import api from "api/apiConfig";
import CategoryListUpdateManager from "modules/categoryList/manager/CategoryListUpdateManager";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateManySystemState } from "redux/actions/system/SystemActions";
import ConditionalMultilegUpdateManager from "modules/conditionalMultileg/manager/ConditionalMultilegUpdateManager";

const MainManager: React.FC = () => {
  const {
    systemReducer: { isLogged, token, hasAuthorizationHeader },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  useEffect(() => {
    api.defaults.headers.authorization = `${token.tokenType} ${token.accessToken}`;

    dispatch(updateManySystemState({ hasAuthorizationHeader: true }));
  }, [dispatch, token]);

  if (!isLogged || !token || !hasAuthorizationHeader) {
    return null;
  }

  return (
    <>
      <AuthManager />
      <MultilegUpdateManager />
      <OrdersUpdateManager />
      <PositionUpdateManager />
      <THLUpdateManager />
      <BoxUpdateManager />
      <CategoryListUpdateManager />
      <ConditionalMultilegUpdateManager />
    </>
  );
};

export default MainManager;
