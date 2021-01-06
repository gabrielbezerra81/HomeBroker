import { Redirect, RouteComponentProps, useLocation } from "@reach/router";
import qs from "qs";
import axios from "axios";

import React, { useEffect, useState } from "react";
import api from "api/apiConfig";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateManySystemState } from "redux/actions/system/SystemActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

const LoginRedirect: React.FC<RouteComponentProps> = ({ path }) => {
  const [fetchingAPI, setFetchingAPI] = useState(true);

  const routerLocation = useLocation();

  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isLogged },
  } = useStateStorePrincipal();

  const [, code] = routerLocation.href.split("code=");

  useEffect(() => {
    if (code) {
      axios
        .post(
          `https://auth.rendacontinua.com/auth/realms/auth_sso/protocol/openid-connect/token`,
          qs.stringify({
            code,
            redirect_uri: "http://localhost:3000/logged",
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
          const authData = response.data;

          const { token_type, access_token } = authData;

          api.defaults.headers.authorization = `${token_type} ${access_token}`;

          dispatch(
            updateManySystemState({
              token: {
                tokenType: token_type,
                accessToken: access_token,
              },
              authData,
              isLogged: true,
            }),
          );
        })
        .catch((error) => {
          console.log("error", error.response);
          setFetchingAPI(false);
        })
        .finally(() => {
          setFetchingAPI(false);
        });
    }
  }, [code, dispatch]);

  if (fetchingAPI || !isLogged) {
    return null;
  }

  return <Redirect to="/home" noThrow />;
};

export default LoginRedirect;
