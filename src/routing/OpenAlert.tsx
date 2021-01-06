import { Redirect, RouteComponentProps, useLocation } from "@reach/router";
import { listAlertsAPI } from "api/API";
import { keycloakLoginAPI } from "api/LoginAPI";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useState, useEffect } from "react";
import { openAlertInMultileg } from "redux/actions/multileg/AlertsAction";
import { updateManySystemState } from "redux/actions/system/SystemActions";

import keycloak from "Keycloak";

import { AlertAPI } from "types/multileg/multileg";

const redirectURL =
  // eslint-disable-next-line no-restricted-globals
  location.hostname === "localhost"
    ? "http://localhost:3000/alerta/"
    : "https://homebroker-react.herokuapp.com/alerta/";

// http://localhost:3000/alerta/95
const OpenAlert: React.FC<RouteComponentProps & { id?: string }> = ({
  path,
  location,
  id,
}) => {
  const routerLocation = useLocation();

  const dispatch = useDispatchStorePrincipal();
  const dispatchGlobal = useDispatchGlobalStore();

  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  const [fetchingAlerts, setFetchingAlerts] = useState(true);

  const [, code] = routerLocation.href.split("code=");

  // Iniciar keycloak
  useEffect(() => {
    keycloak
      .init({ onLoad: "login-required", redirectUri: redirectURL + id })
      .success((auth) => {
        if (!auth) {
          window.location.reload();
        } else {
          console.log("Authenticated");
        }
      })
      .error(() => {
        console.log("Authenticated Failed");
      });
  }, [id]);

  // Buscar token
  useEffect(() => {
    async function login() {
      if (code) {
        const authData = await keycloakLoginAPI(code, redirectURL + id);

        const { token_type, access_token } = authData;

        dispatch(
          updateManySystemState({
            token: {
              tokenType: token_type,
              accessToken: access_token,
            },
            authData,
            isLogged: true,
          }),
        );
      }
    }

    login();
  }, [code, dispatch, id]);

  // Abrir alerta na multileg
  useEffect(() => {
    async function openAlert() {
      if (isLogged && id) {
        const alerts: AlertAPI[] = await listAlertsAPI();

        const alertItem = alerts.find(
          (alertItem) => alertItem.id === Number(id),
        );

        if (alertItem) {
          dispatch(openAlertInMultileg(alertItem, dispatchGlobal));
        }

        setFetchingAlerts(false);
      }
    }

    openAlert();
  }, [dispatch, dispatchGlobal, id, isLogged]);

  if (!isLogged || fetchingAlerts) {
    return null;
  }

  return <Redirect to="/home" noThrow />;
};

export default OpenAlert;
