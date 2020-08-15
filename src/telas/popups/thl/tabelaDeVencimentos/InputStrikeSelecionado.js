import React from "react";
import { FormControl } from "react-bootstrap";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { mudarVariavelTHLAction } from "redux/actions/thl/THLActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

export default ({ strikeLinha, indiceStrike }) => {
  const {
    THLReducer: { strikeSelecionado, listaStrikes },
  } = useStateStorePrincipal();
  const dispatch = useDispatchStorePrincipal();

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
