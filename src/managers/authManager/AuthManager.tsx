import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import qs from "qs";

import moment from "moment";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import api from "api/apiConfig";
import {
  deslogarUsuarioAction,
  updateManySystemState,
} from "redux/actions/system/SystemActions";

const AuthManager = () => {
  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { authData },
  } = useStateStorePrincipal();

  const [requestInterceptor, setRequestInterceptor] = useState(-1);
  const [responseInterceptor, setResponseInterceptor] = useState(-1);
  const [shouldAlertSessionExpired, setShouldAlertSessionExpired] = useState(
    false,
  );
  const [previousShouldAlert, setPreviousShouldAlert] = useState<
    boolean | null
  >(null);

  const updateAuthData = useCallback(
    (data: any) => {
      const { token_type, access_token } = data;

      api.defaults.headers.authorization = `${token_type} ${access_token}`;

      const tokenDate = new Date().getTime();

      const updatedData = { ...data, token_date: tokenDate };

      dispatch(
        updateManySystemState({
          isLogged: true,
          authData: updatedData,
        }),
      );
    },
    [dispatch],
  );

  const handleTokenRefresh = useCallback(async () => {
    try {
      const response = await axios.post(
        `https://auth.rendacontinua.com/auth/realms/auth_sso/protocol/openid-connect/token`,
        qs.stringify({
          grant_type: "refresh_token",
          client_id: "homebroker-react",
          refresh_token: authData?.refresh_token,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      updateAuthData(response.data);
    } catch (error) {
      setShouldAlertSessionExpired(true);
      setPreviousShouldAlert(false);
      dispatch(deslogarUsuarioAction());
    }
  }, [authData, dispatch, updateAuthData]);

  // Verifica se o token está a 40 minutos de expirar. Caso esteja, será renovado.
  useEffect(() => {
    if (authData) {
      const { token_date, expires_in } = authData;

      if (requestInterceptor !== -1) {
        api.interceptors.request.eject(requestInterceptor);
      }

      const interceptor = api.interceptors.request.use(async (config) => {
        const isExpired = isTokenExpired(token_date, expires_in);

        if (isExpired) {
          await handleTokenRefresh();
        }

        return config;
      });

      setRequestInterceptor(interceptor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData, handleTokenRefresh]);

  useEffect(() => {
    if (responseInterceptor !== -1) {
      api.interceptors.response.eject(responseInterceptor);
    }

    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          dispatch(deslogarUsuarioAction());
          setShouldAlertSessionExpired(true);
          setPreviousShouldAlert(false);
        }

        return Promise.reject(error);
      },
    );

    setResponseInterceptor(interceptor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (
      previousShouldAlert !== null &&
      shouldAlertSessionExpired !== previousShouldAlert &&
      shouldAlertSessionExpired
    ) {
      alert("Sua sessão expirou! Faça login novamente.");
    }
  }, [previousShouldAlert, shouldAlertSessionExpired]);

  return null;
};

export default AuthManager;

function isTokenExpired(tokenDate: number, expiresIn: number) {
  const expireDate = new Date(tokenDate);
  expireDate.setSeconds(expireDate.getSeconds() + expiresIn - 2400); // dura 1h, se faltar 40 minutos pra expirar já renova.
  const currentDate = new Date();

  const isExpired = moment(currentDate).isAfter(expireDate, "milliseconds");

  return isExpired;
}
