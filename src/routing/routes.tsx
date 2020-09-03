import React, { useEffect } from "react";
import { Router, Redirect, RouteComponentProps } from "@reach/router";
import TelaLogin from "screens/login/TelaLogin";
import TelaCadastro from "screens/signUp/TelaCadastro";
import TelaPrincipal from "screens/home/TelaPrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import api from "api/apiConfig";

export const Routes = () => {
  const {
    systemReducer: { token },
  } = useStateStorePrincipal();

  useEffect(() => {
    api.defaults.headers.authorization = `${token.tokenType} ${token.accessToken}`;
  }, [token]);

  return (
    <Router>
      <TelaLogin path="/" />
      <TelaCadastro path="/cadastro" />
      <Home path="/home" />
    </Router>
  );
};

const Home: React.FC<RouteComponentProps> = ({ path }) => {
  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  if (isLogged) return <TelaPrincipal />;

  return <Redirect to="/" noThrow />;
};
