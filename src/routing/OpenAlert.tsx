import { Redirect, RouteComponentProps, useLocation } from "@reach/router";
import { Spinner } from "react-bootstrap";
import { listAlertsAPI } from "api/API";
import { getKeycloakAuthDataAPI } from "api/LoginAPI";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useState, useEffect } from "react";
import { openAlertInMultileg } from "modules/multileg/duck/actions/AlertsAction";
import { updateManySystemState } from "redux/actions/system/SystemActions";

import keycloak from "Keycloak";

import { AlertAPI } from "modules/multileg/types/multileg";

const redirectURL =
  // eslint-disable-next-line no-restricted-globals
  location.hostname === "localhost"
    ? "http://localhost:3000/alerta/"
    : "https://homebroker-react.herokuapp.com/alerta/";

// http://localhost:3000/alerta/95
const OpenAlert: React.FC<RouteComponentProps & { id?: string }> = ({ id }) => {
  const dispatch = useDispatchStorePrincipal();
  const dispatchGlobal = useDispatchGlobalStore();

  const {
    systemReducer: { isLogged, authData },
  } = useStateStorePrincipal();

  const routerLocation = useLocation();

  const [fetchingAlerts, setFetchingAlerts] = useState(true);

  const [, code] = routerLocation.href.split("code=");

  // Iniciar keycloak
  useEffect(() => {
    // authData estando null permite que entre apenas 1 vez
    if (!authData) {
      // authData estando truthy impede que execute mais de 1 vez
      dispatch(
        updateManySystemState({
          authData: {},
        }),
      );

      keycloak
        .init({ onLoad: "login-required", redirectUri: redirectURL + id })
        .success((auth) => {
          if (!auth) {
            // window.location.reload();
          } else {
            console.log("Authenticated");
          }
        })
        .error(() => {
          console.log("Authenticated Failed");
        });
    }
  }, [authData, dispatch, id]);

  // Buscar token
  useEffect(() => {
    async function getData() {
      // Verificar pelo code assegura que só seja executado após realizar o login e não ao montar
      if (!isLogged && code) {
        const payload = await getKeycloakAuthDataAPI(redirectURL + id);

        dispatch(updateManySystemState(payload));
      }
    }

    getData();
  }, [code, dispatch, id, isLogged]);

  // Abrir alerta na multileg
  useEffect(() => {
    async function openAlert() {
      if (isLogged && id) {
        const alerts: AlertAPI[] = await listAlertsAPI();

        const alertItem = alerts.find(
          (alertItem) => alertItem.id === Number(id),
        );

        if (alertItem) {
          dispatch(openAlertInMultileg(alertItem));
        }

        setFetchingAlerts(false);
      }
    }

    openAlert();
  }, [dispatch, dispatchGlobal, id, isLogged]);

  if (!isLogged || fetchingAlerts) {
    return (
      <div style={containerStyle}>
        <h5 style={textStyle}>Carregando...</h5>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return <Redirect to="/home" noThrow />;
};

export default OpenAlert;

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  flexDirection: "column",
};

const textStyle: React.CSSProperties = { color: "#ddd", marginBottom: 16 };
