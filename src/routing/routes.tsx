import React, { useEffect, useState } from "react";

import qs from "qs";

import {
  Router,
  Redirect,
  RouteComponentProps,
  useLocation,
} from "@reach/router";
import TelaLogin from "screens/login/TelaLogin";
import TelaCadastro from "screens/signUp/TelaCadastro";
import TelaPrincipal from "screens/home/TelaPrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import api from "api/apiConfig";
import UpdateManager from "updateManager/UpdateManager";
import { useKeycloak } from "@react-keycloak/web";

import axios from "axios";

export const Routes = () => {
  const {
    systemReducer: { token },
  } = useStateStorePrincipal();

  const { keycloak } = useKeycloak();

  useEffect(() => {
    api.defaults.headers.authorization = `${token.tokenType} ${token.accessToken}`;
  }, [token]);

  useEffect(() => {
    keycloak.init({ onLoad: "login-required" });
  }, [keycloak]);

  return (
    <>
      <Router>
        <TelaLogin path="/" />
        <TelaCadastro path="/cadastro" />
        <Home path="/home" />
        <Logged path="/logged" />
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

const Logged: React.FC<RouteComponentProps> = ({ path }) => {
  const [fetchingAPI, setFetchingAPI] = useState(true);

  const routerLocation = useLocation();

  const [, code] = routerLocation.href.split("code=");

  console.log(code);

  useEffect(() => {
    if ("") {
      axios
        .post(
          `https://auth.rendacontinua.com/auth/realms/auth_sso/protocol/openid-connect/token`,
          qs.stringify({
            code,
            redirect_uri: "http://localhost:3000/home",
            grant_type: "authorization_code",
            client_id: "broker_react",
            client_secret: "367afb37-8884-42c3-b5b6-b455b9b7db59",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log("error", error.response);
          setFetchingAPI(false);
        })
        .finally(() => {
          setFetchingAPI(false);
        });
    }
  }, [code]);

  if (fetchingAPI) {
    return null;
  }

  return <Redirect to="/" noThrow />;
};

// http://localhost:3000/#state=865f3f41-5470-472c-8217-29b7ec8a9b25&session_state=272b349a-470a-4784-85d7-8d5b78a55fc5&code=319e95d5-bc1f-4125-b064-413671a42086.272b349a-470a-4784-85d7-8d5b78a55fc5.79efd16a-b697-4ee4-be21-383cc53d2917
