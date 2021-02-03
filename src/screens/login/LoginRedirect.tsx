import { Redirect, RouteComponentProps } from "@reach/router";

import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateManySystemState } from "redux/actions/system/SystemActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import keycloak from "Keycloak";
import api from "api/apiConfig";

const redirectURL =
  // eslint-disable-next-line no-restricted-globals
  location.hostname === "localhost"
    ? "http://localhost:3000/logged"
    : "https://homebroker-react.herokuapp.com/logged";

const LoginRedirect: React.FC<RouteComponentProps> = ({ path }) => {
  // const routerLocation = useLocation();

  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  // const [, code] = routerLocation.href.split("code=");

  useEffect(() => {
    async function login() {
      if (!isLogged) {
        keycloak
          .init({ redirectUri: redirectURL, onLoad: "check-sso" })
          .success((auth) => {
            if (!auth) {
              window.location.reload();
            } else {
              console.log("Authenticated");
            }

            if (keycloak.token && keycloak.tokenParsed) {
              const roles = keycloak.tokenParsed.realm_access?.roles || [];

              const data = {
                access_token: keycloak.token || "",
                id_token: keycloak.idToken || "",
                refresh_token: keycloak.refreshToken || "",
                token_type: "bearer",
                expires_in: 3600,
                refresh_expires_in: 1800,
                session_state: "",
                scope: "",
                "not-before-policy": 0,
              };

              api.defaults.headers.authorization = `${data.token_type} ${data.access_token}`;

              dispatch(
                updateManySystemState({
                  token: {
                    tokenType: "bearer",
                    accessToken: keycloak.token,
                  },
                  authData: data,
                  isLogged: true,
                  roles,
                }),
              );
            }
          })
          .error((error) => {
            console.log("Authenticated Failed");
          });
      }

      // if (code) {
      // const authData = await keycloakLoginAPI(code, redirectURL);
      // const { token_type, access_token } = authData;
      // dispatch(
      //   updateManySystemState({
      //     token: {
      //       tokenType: token_type,
      //       accessToken: access_token,
      //     },
      //     authData,
      //     isLogged: true,
      //   }),
      // );
      // }
    }

    login();
  }, [dispatch, isLogged]);

  if (!isLogged) {
    return null;
  }

  return <Redirect to="/home" noThrow />;
};

export default LoginRedirect;
