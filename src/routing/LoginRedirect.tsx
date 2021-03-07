import { Redirect, RouteComponentProps } from "@reach/router";

import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  deslogarUsuarioAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { getKeycloakAuthDataAPI } from "api/LoginAPI";
import { Spinner } from "react-bootstrap";

const redirectURL =
  // eslint-disable-next-line no-restricted-globals
  location.hostname === "localhost"
    ? "http://localhost:3000/logged"
    : "https://homebroker-react.herokuapp.com/logged";

const LoginRedirect: React.FC<RouteComponentProps> = ({ path }) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  useEffect(() => {
    async function login() {
      if (!isLogged) {
        try {
          const payload = await getKeycloakAuthDataAPI(redirectURL);

          dispatch(updateManySystemState(payload));
        } catch (error) {
          dispatch(deslogarUsuarioAction());
          setTimeout(() => {
            alert("Você não tem permissão para acessar esta área.");
          }, 50);
        }
      }
    }

    login();
  }, [dispatch, isLogged]);

  if (!isLogged) {
    return (
      <div style={containerStyle}>
        <h5 style={textStyle}>Carregando...</h5>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return <Redirect to="/home" noThrow />;
};

export default LoginRedirect;

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  flexDirection: "column",
};

const textStyle: React.CSSProperties = { color: "#ddd", marginBottom: 16 };
