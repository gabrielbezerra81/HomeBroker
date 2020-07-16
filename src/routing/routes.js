import React from "react";
import { Router, Redirect } from "@reach/router";
import TelaLogin from "components/telas/login/TelaLogin";
import TelaCadastro from "components/telas/login/TelaCadastro";
import { useSelectorStorePrincipal } from "redux/StoreCreation";
import TelaPrincipal from "components/telas/principal/TelaPrincipal";

export const Routes = () => {
  return (
    <Router>
      <TelaLogin path="/" />
      <TelaCadastro path="/cadastro" />
      <Home path="/home" />
    </Router>
  );
};

const Home = ({ path }) => {
  const logado = useSelectorStorePrincipal((state) => {
    return state.telaPrincipalReducer.logado;
  });

  if (logado) return <TelaPrincipal />;

  return <Redirect to="/" noThrow />;
};
