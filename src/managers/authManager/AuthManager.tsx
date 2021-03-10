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
import { toast } from "react-toastify";

const AuthManager = () => {
  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { authData, token },
  } = useStateStorePrincipal();

  const [requestInterceptor, setRequestInterceptor] = useState(-1);
  const [responseInterceptor, setResponseInterceptor] = useState(-1);
  const [shouldAlertSessionExpired, setShouldAlertSessionExpired] = useState(
    false,
  );
  const [previousShouldAlert, setPreviousShouldAlert] = useState<
    boolean | null
  >(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

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
      console.log("refreshed");
    } catch (error) {
      console.log(error.response);
      if (authData) {
        const { token_date, expires_in } = authData;

        const isExpired = isTokenExpired(token_date, expires_in, 5);

        if (isExpired) {
          setShouldAlertSessionExpired(true);
          setPreviousShouldAlert(false);
          dispatch(deslogarUsuarioAction());
        }
      }
    }
  }, [authData, dispatch, updateAuthData]);

  // Verifica se o token está a 40 minutos de expirar. Caso esteja, será renovado.
  useEffect(() => {
    if (authData) {
      const { token_date, expires_in } = authData;

      if (requestInterceptor !== -1) {
        api.interceptors.request.eject(requestInterceptor);
      }

      if (timerId) {
        clearInterval(timerId);
      }

      const isExpired = isTokenExpired(token_date, expires_in, 50);

      console.log("isExpired", isExpired);

      if (isExpired) {
        handleTokenRefresh();
      }

      const timer = setInterval(() => {
        const isExpired = isTokenExpired(token_date, expires_in, 50);

        console.log("isExpired", isExpired);

        if (isExpired) {
          // eslint-disable-next-line no-restricted-globals
          if (location.hostname === "localhost") {
            toast.info("isExpired === " + isExpired);
          }
          handleTokenRefresh();
        }
      }, 20000);

      const interceptor = api.interceptors.request.use(async (config) => {
        const isExpired = isTokenExpired(token_date, expires_in, 40);

        if (isExpired) {
          await handleTokenRefresh();
        }

        return config;
      });

      setTimerId(timer);
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

  // Alertar sessão expirada
  useEffect(() => {
    if (
      previousShouldAlert !== null &&
      shouldAlertSessionExpired !== previousShouldAlert &&
      shouldAlertSessionExpired
    ) {
      toast.error("Sua sessão expirou! Faça login novamente.", {
        autoClose: false,
      });
    }
  }, [previousShouldAlert, shouldAlertSessionExpired]);

  // Atualizar token na instãncia do Axios
  useEffect(() => {
    api.defaults.headers.authorization = `${token.tokenType} ${token.accessToken}`;
  }, [token]);

  return null;
};

export default AuthManager;

function isTokenExpired(
  tokenDate: number,
  expiresIn: number,
  minutesLeft: number,
) {
  const expireDate = new Date(tokenDate);

  const secondsLeft = minutesLeft * 60;

  expireDate.setSeconds(expireDate.getSeconds() + expiresIn - secondsLeft); // dura 1h, se faltar 44 minutos pra expirar já renova.
  const currentDate = new Date();

  const isExpired = moment(currentDate).isAfter(expireDate, "milliseconds");

  return isExpired;
}
