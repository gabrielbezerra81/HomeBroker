/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useMemo } from "react";
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
  const reduxState = StateStorePrincipal("thl");
  const dispatch = DispatchStorePrincipal();
  const { idCelulaSelecionada, codigoCelulaSelecionada } = reduxState;

  const StripedRow = useMemo(
    () =>
      forwardRef((props, ref) => {
        const id = props.row ? props.row.id : -1;
        const linhaSelecionada =
          id === idCelulaSelecionada && !codigoCelulaSelecionada
            ? " linhaSelecionada"
            : "";

        const paridade = props.index % 2 === 0 ? "linha-par" : "linha-impar";

        return (
          <div
            {...props}
            tabIndex={0}
            onClick={() => {
              selecionarLinha({
                dispatch,
                id: id,
                idCelulaSelecionada,
                codigoCelulaSelecionada,
              });
            }}
            className={`divClicavel tr ${paridade}${linhaSelecionada}`}
          />
        );
      }),
    [idCelulaSelecionada, codigoCelulaSelecionada]
  );

  const Td = useMemo(
    () => (props) => {
      return (
        <div
          {...props}
          style={{
            ...props.style,
          }}
          className={`${classeMargemScroll}td`}
        ></div>
      );
    },
    [classeMargemScroll]
  );

  return (
    <WindowTable
      className="tabelaCombinacoes"
      id="tabelaCombinacoes"
      data={dataTabela}
      columns={columns}
      Cell={Td}
      Header={Thead}
      Row={StripedRow}
      overscanCount={2}
    />
  );
});

const Thead = (props) => <div {...props} className="thead"></div>;

const columns = [
  {
    key: "estrategia",
    width: 95,
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
    width: 96,
    title: "Acão | Ult",
    Component: ColunaAcaoUlt,
    HeaderCell: ColunaHeader,
  },
  {
    key: "spread",
    width: 75,
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
    width: 160,
    title: "Montagem",
    Component: ColunaMontagem,
    HeaderCell: ColunaHeader,
  },
  {
    key: "desmontagem",
    width: 160,
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
    width: 70,
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
