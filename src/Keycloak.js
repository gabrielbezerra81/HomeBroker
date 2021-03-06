import Keycloak from "keycloak-js";

//keycloak init options
let initOptions = {
  url: "https://auth.rendacontinua.com/auth",
  realm: "auth_sso",
  clientId: "homebroker-react",
  onLoad: "login-required",
};

let keycloak = Keycloak(initOptions);

export default keycloak;
