import React, { useEffect } from "react";
import { Router, Redirect, RouteComponentProps } from "@reach/router";
import TelaLogin from "telas/login/TelaLogin";
import TelaCadastro from "telas/cadastro/TelaCadastro";
import TelaPrincipal from "telas/principal/TelaPrincipal";
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
    systemReducer: { logado },
  } = useStateStorePrincipal();

  if (logado) return <TelaPrincipal />;

  return <Redirect to="/" noThrow />;
};
