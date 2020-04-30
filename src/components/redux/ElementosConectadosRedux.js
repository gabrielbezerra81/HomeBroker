import React from "react";
import { Provider, connect } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Router, Redirect } from "@reach/router";
import TelaLogin from "components/tela_login/TelaLogin";
import TelaCadastro from "components/tela_login/TelaCadastro";
import {
  StorePrincipalContext,
  globalStore,
  GlobalContext,
  storeAppPrincipal,
  useSelectorStorePrincipal,
  persistor,
} from "components/redux/StoreCreation";
import TelaPrincipal from "components/tela_principal/TelaPrincipal";
import { WrapperAppBoletas } from "components/WrapperAppBoletas";

export const Helper = () => {
  return (
    <Provider store={globalStore} context={GlobalContext}>
      <Provider store={storeAppPrincipal} context={StorePrincipalContext}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <TelaLogin path="/" />
            <TelaCadastro path="/cadastro" />
            <Home path="/home" />
          </Router>
        </PersistGate>
      </Provider>
    </Provider>
  );
};

const Home = ({ path }) => {
  const logado = useSelectorStorePrincipal((state) => {
    return state.telaPrincipalReducer.logado;
  });

  if (logado) return <TelaPrincipal />;

  return <Redirect to="/" noThrow />;
};

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.MainAppReducer.apps,
    show: state.MainAppReducer.show,
    divkey: state.MainAppReducer.divkey,
    zIndex: state.MainAppReducer.zIndex,
  };
};

export const WrapperAppBoletasConectado = connect(
  mapStateToPropsGlobalStore,
  {},
  null,
  {
    context: GlobalContext,
  }
)(WrapperAppBoletas);
