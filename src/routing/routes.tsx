import React from "react";
import { Router, Redirect, RouteComponentProps } from "@reach/router";
import TelaLogin from "components/telas/login/TelaLogin";
import TelaCadastro from "components/telas/cadastro/TelaCadastro";
import TelaPrincipal from "components/telas/principal/TelaPrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

export const Routes = () => {
  return (
    <Router>
      <TelaLogin path="/" />
      <TelaCadastro path="/cadastro" />
      <Home path="/home" />
    </Router>
  );
};

const Home: React.FC<RouteComponentProps> = ({ path }) => {
  const { logado } = useStateStorePrincipal("principal");

  if (logado) return <TelaPrincipal />;

  return <Redirect to="/" noThrow />;
};
