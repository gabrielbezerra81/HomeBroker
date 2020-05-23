import React from "react";
import { FormControl } from "react-bootstrap";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";

export default ({ strikeLinha, indiceStrike }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const dispatch = DispatchStorePrincipal();
  const { strikeSelecionado, listaStrikes } = reduxState;

  if (Number(strikeSelecionado) === Number(strikeLinha)) {
    return (
      <div style={{ padding: "5px 0", width: "45px", textAlignLast: "end" }}>
        <FormControl
          as="select"
          value={strikeSelecionado}
          className="textInput"
          onChange={(e) =>
            dispatch(
              mudarVariavelTHLAction("strikeSelecionado", e.target.value)
            )
          }
        >
          <option value=""></option>
          {listaStrikes.map((strike, indice) => (
            <option key={`strikeInteiro:${strike}`} value={strike}>
              {strike}
            </option>
          ))}
        </FormControl>
      </div>
    );
  }

  return <div>{strikeLinha}</div>;
};
