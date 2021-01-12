import { Redirect, RouteComponentProps, useLocation } from "@reach/router";

import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateManySystemState } from "redux/actions/system/SystemActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { keycloakLoginAPI } from "api/LoginAPI";

const redirectURL =
  // eslint-disable-next-line no-restricted-globals
  location.hostname === "localhost"
    ? "http://localhost:3000/logged"
    : "https://homebroker-react.herokuapp.com/logged";

const LoginRedirect: React.FC<RouteComponentProps> = ({ path }) => {
  const routerLocation = useLocation();

  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  const [, code] = routerLocation.href.split("code=");

  useEffect(() => {
    async function login() {
      if (code) {
        const authData = await keycloakLoginAPI(code, redirectURL);

        const { token_type, access_token } = authData;

        dispatch(
          updateManySystemState({
            token: {
              tokenType: token_type,
              accessToken: access_token,
            },
            authData,
            isLogged: true,
          })
        );
      }
    }

    login();
  }, [code, dispatch]);

  if (!isLogged) {
    return null;
  }

  return <Redirect to="/home" noThrow />;
};

export default LoginRedirect;
