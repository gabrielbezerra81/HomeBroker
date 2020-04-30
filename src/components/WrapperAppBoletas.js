import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import ReduxThunk from "redux-thunk";
import rootReducer from "components/redux/reducers/index";
import AppBoletas from "components/AppBoletas";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Responsável por criar uma store individual para cada app que contem as boletas e encapsulá-los.
// Cada appBoleta contem os 12 formularios de compra e venda
export class WrapperAppBoletas extends React.Component {
  constructor(props) {
    super(props);

    this.store = createStore(
      rootReducer,
      {},
      composeEnhancers(applyMiddleware(ReduxThunk))
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
