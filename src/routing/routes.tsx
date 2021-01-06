import React, { useEffect } from "react";

import { Router, Redirect, RouteComponentProps } from "@reach/router";
import TelaLogin from "screens/login/TelaLogin";
import TelaCadastro from "screens/signUp/TelaCadastro";
import TelaPrincipal from "screens/home/TelaPrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import api from "api/apiConfig";
import UpdateManager from "updateManager/UpdateManager";
import LoginRedirect from "screens/login/LoginRedirect";

export const Routes = () => {
  const {
    systemReducer: { token },
  } = useStateStorePrincipal();

  useEffect(() => {
    api.defaults.headers.authorization = `${token.tokenType} ${token.accessToken}`;
  }, [token]);

  return (
    <>
      <Router>
        <TelaLogin path="/" keycloakLogin={false} />
        <TelaLogin path="/keycloak" keycloakLogin />
        <TelaCadastro path="/cadastro" />
        <Home path="/home" />
        <LoginRedirect path="/logged" />
      </Router>
      <UpdateManager />
    </>
  );
};

const Home: React.FC<RouteComponentProps> = ({ path }) => {
  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  if (isLogged) return <TelaPrincipal />;

  return <Redirect to="/" noThrow />;
};

// http://localhost:3000/#state=865f3f41-5470-472c-8217-29b7ec8a9b25&session_state=272b349a-470a-4784-85d7-8d5b78a55fc5&code=319e95d5-bc1f-4125-b064-413671a42086.272b349a-470a-4784-85d7-8d5b78a55fc5.79efd16a-b697-4ee4-be21-383cc53d2917
