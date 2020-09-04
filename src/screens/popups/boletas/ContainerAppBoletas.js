import React from "react";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import ReduxThunk from "redux-thunk";
import { BoletasReducer } from "redux/reducers/index";
import AppBoletas from "screens/popups/boletas/AppBoletas";
import { GlobalContext } from "redux/StoreCreation";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Responsável por criar uma store individual para cada app que contem as boletas e encapsulá-los.
// Cada appBoleta contem os 12 formularios de compra e venda
class ContainerAppBoletas extends React.Component {
  constructor(props) {
    super(props);

    this.store = createStore(
      BoletasReducer,
      {},
      composeEnhancers(applyMiddleware(ReduxThunk)),
    );
  }
  render() {
    const { props } = this;
    return (
      <Provider store={this.store}>
        <AppBoletas
          appkey={props.index}
          indiceShow={props.indiceShow}
          codigoBook={props.codigoBook}
        />
      </Provider>
    );
  }
}

const mapStateToPropsGlobalStore = (state) => {
  return {
    apps: state.GlobalReducer.apps,
    show: state.GlobalReducer.show,
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
  };
};

export default connect(mapStateToPropsGlobalStore, {}, null, {
  context: GlobalContext,
})(ContainerAppBoletas);
