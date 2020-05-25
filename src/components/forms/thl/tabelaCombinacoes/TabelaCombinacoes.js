/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef } from "react";
import { WindowTable } from "window-table";
import {
  ColunaAcaoUlt,
  ColunaCodigos,
  ColunaMontagem,
  ColunaTextoComum,
  ColunaHeader,
} from "components/forms/thl/tabelaCombinacoes/ColunasTabelaComb";
import {
  DispatchStorePrincipal,
  StateStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";

export default React.memo(({ dataTabela, classeMargemScroll }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const { idCelulaSelecionada, codigoCelulaSelecionada } = reduxState;

  return (
    <WindowTable
      className="tabelaCombinacoes"
      id="tabelaCombinacoes"
      data={dataTabela}
      columns={columns}
      Cell={(props) => {
        const idAnterior =
          props.index > 0 ? dataTabela[props.index - 1].id : -1;
        return Td(props, {
          classeMargemScroll,
          idCelulaSelecionada,
          idAnterior,
          codigoCelulaSelecionada,
        });
      }}
      Header={Thead}
      Row={StripedRow}
      overscanCount={2}
    />
  );
});

const Thead = (props) => {
  return (
    <div
      {...props}
      style={{
        ...props.style,
      }}
      className="thead"
    ></div>
  );
};

const StripedRow = forwardRef((props, ref) => {
  const dispatch = DispatchStorePrincipal();
  const reduxState = StateStorePrincipal().THLReducer;
  const { idCelulaSelecionada, codigoCelulaSelecionada } = reduxState;
  return (
    <div
      {...props}
      tabIndex={0}
      onClick={() =>
        selecionarLinha({
          dispatch,
          id: props.row.id,
          idCelulaSelecionada,
          codigoCelulaSelecionada,
        })
      }
      className={
        props.index % 2 === 0
          ? "linha-par divClicavel tr"
          : "linha-impar divClicavel tr"
      }
    />
  );
});

const Td = (props, layoutProps) => {
  const { row } = props;
  const {
    classeMargemScroll,
    idCelulaSelecionada,
    idAnterior,
    codigoCelulaSelecionada,
  } = layoutProps;

  const linhaSelecionada =
    [row.id, idAnterior].includes(idCelulaSelecionada) &&
    !codigoCelulaSelecionada
      ? " linhaSelecionada"
      : "";

  return (
    <div
      {...props}
      style={{
        ...props.style,
      }}
      className={`${classeMargemScroll}td${linhaSelecionada}`}
    ></div>
  );
};

const columns = [
  {
    key: "estrategia",
    width: 90,
    title: "Estratégia",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "grupo",
    width: 75,
    title: "Grupo",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "acaoUlt",
    width: 85,
    title: "Acão | Ult",
    Component: ColunaAcaoUlt,
    HeaderCell: ColunaHeader,
  },
  {
    key: "spread",
    width: 70,
    title: "Spread",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "codigos",
    width: 220,
    title: "Códigos",
    Component: ColunaCodigos,
    HeaderCell: ColunaHeader,
  },
  {
    key: "montagem",
    width: 170,
    title: "Montagem",
    Component: ColunaMontagem,
    HeaderCell: ColunaHeader,
  },
  {
    key: "desmontagem",
    width: 170,
    title: "Desmontagem",
    Component: ColunaMontagem,
    HeaderCell: ColunaHeader,
  },
  {
    key: "vencimento",
    width: 115,
    title: "Vencimento",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
  {
    key: "prazo",
    width: 60,
    title: "Prazo",
    Component: ColunaTextoComum,
    HeaderCell: ColunaHeader,
  },
];

const selecionarLinha = (props: {
  idCelulaSelecionada: number,
  id: number,
  dispatch: any,
  codigoCelulaSelecionada: string,
}) => {
  const { id, dispatch, idCelulaSelecionada, codigoCelulaSelecionada } = props;
  let novoID = null;
  if (id !== idCelulaSelecionada || codigoCelulaSelecionada) {
    novoID = id;
  }
  dispatch(mudarVariavelTHLAction("codigoCelulaSelecionada", ""));
  dispatch(mudarVariavelTHLAction("idCelulaSelecionada", novoID));
};
