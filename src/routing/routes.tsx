import React from "react";
import { Router } from "@reach/router";
import TelaLogin from "screens/login/TelaLogin";
// import TelaCadastro from "screens/signUp/TelaCadastro";
import Home from "modules/home/screens/Home";
import MainManager from "managers";
import LoginRedirect from "routing/LoginRedirect";
import OpenAlert from "./OpenAlert";

export const Routes = () => {
  return (
    <>
      <Router>
        <TelaLogin path="/" keycloakLogin={false} />
        <TelaLogin path="/keycloak" keycloakLogin />
        {/* <TelaCadastro path="/cadastro" /> */}
        <Home path="/home" />
        <LoginRedirect path="/logged" />
        <OpenAlert path="/alerta/:id" />
      </Router>
      <MainManager />
    </>
  );
};

// http://localhost:3000/#state=865f3f41-5470-472c-8217-29b7ec8a9b25&session_state=272b349a-470a-4784-85d7-8d5b78a55fc5&code=319e95d5-bc1f-4125-b064-413671a42086.272b349a-470a-4784-85d7-8d5b78a55fc5.79efd16a-b697-4ee4-be21-383cc53d2917
