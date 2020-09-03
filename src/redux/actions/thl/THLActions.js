import { setPointerWhileAwaiting } from "api/API";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "redux/actions/GlobalAppActions";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import {
  addMultilegTab,
  updateMultilegTab,
  updateMultilegQuotesAction,
  addMultilegOffer,
  updateMultilegStateAction,
  cloneMultilegQuotes,
} from "redux/actions/multileg/MultilegActions";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import { searchMultilegSymbolData } from "redux/actions/multileg/MultilegAPIAction";
import { calculoPreco } from "telas/popups/multileg_/CalculoPreco";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";
import { updateManyTHLState, updateOneTHLState } from "./utils";
import { getReducerStateStorePrincipal } from "hooks/utils";
import { updateManyMultilegState } from "../multileg/utils";

export const mudarVariavelTHLAction = (nome, valor) => {
  return (dispatch) => {
    dispatch(updateOneTHLState({ attributeName: nome, attributeValue: valor }));
  };
};

export const mudarVariaveisTHLAction = (payload) => {
  return (dispatch) => {
    dispatch(updateManyTHLState(payload));
  };
};

export const abrirMultilegTHLAction = (props) => {
  // Actions
  return async (dispatch, getState) => {
    setPointerWhileAwaiting("travar", "thl", "body");

    const { token } = getReducerStateStorePrincipal(getState(), "principal");
    const {
      eventSourceCotacao,
      setIntervalCotacoesMultileg,
    } = getReducerStateStorePrincipal(getState(), "multileg");

    let {
      isOpenMultileg,
      x, //cotacoesMultileg
      zIndex,
      dispatchGlobal,
      booksSelecionados,
    } = props;

    dispatchGlobal(atualizarDivKeyAction("multileg"));

    if (!isOpenMultileg) {
      props.multileg.pop();
      dispatch(abrirItemBarraLateralAction(props, "isOpenMultileg"));
    } else {
      //Traz para primeiro plano se já estiver aberto
      document.getElementById("multileg").style.zIndex = zIndex + 1;
      dispatchGlobal(aumentarZindexAction("multileg", zIndex, true));
    }

    let result = addMultilegTab(props.multileg);

    let multileg = result.multilegTabs;
    let updatedMultilegQuotes = cloneMultilegQuotes(x);
    const indiceAba = multileg.length - 1;

    try {
      for (const [indiceOferta, book] of booksSelecionados.entries()) {
        const dadosModificados = await updateMultilegTab({
          multilegTabs: multileg,
          tabIndex: indiceAba,
          attributeName: "ativo",
          attributeValue: book.ativo,
        });

        multileg = dadosModificados.multilegTabs;

        const data = await searchMultilegSymbolData({
          multilegTabs: multileg,
          tabIndex: indiceAba,
          multilegQuotes: updatedMultilegQuotes,
        });

        multileg = data.multilegTabs;
        updatedMultilegQuotes = data.multilegQuotes;

        const opcao = multileg[indiceAba].opcoes.filter(
          (opcao) => opcao.symbol === book.ativo,
        );

        let tipo = "";
        if (opcao.length > 0) tipo = opcao[0].type.toLowerCase();
        else tipo = "acao";

        //Adicionar oferta
        const dadosMultileg = await addMultilegOffer({
          multilegTabs: multileg,
          offerType: tipo,
          tabIndex: indiceAba,
          multilegQuotes: updatedMultilegQuotes,
        });
        multileg = dadosMultileg.multilegTabs;
        updatedMultilegQuotes = dadosMultileg.multilegQuotes;

        const ofertaNova = multileg[indiceAba].tabelaMultileg[indiceOferta];

        ofertaNova.qtde = 100;
        ofertaNova.cv = book.tipo;
      }

      let calculo = calculoPreco(
        multileg[indiceAba],
        "ultimo",
        updatedMultilegQuotes,
      ).toFixed(2);

      calculo = formatarNumero(calculo, 2, ".", ",");
      multileg[indiceAba].preco = calculo;
    } catch (erro) {
      console.log(erro);
      alert(erro_exportar_ordens_multileg);
    }
    result.multilegTabs = multileg;

    dispatch(
      updateManyMultilegState({
        multileg: result.multilegTabs,
        abaSelecionada: result.currentTab,
        cotacoesMultileg: updatedMultilegQuotes,
      }),
    );

    updateMultilegQuotesAction({
      dispatch,
      multilegQuotes: updatedMultilegQuotes,
      eventSourceMultilegQuotes: eventSourceCotacao,
      setIntervalMultilegQuotes: setIntervalCotacoesMultileg,
      token,
    });

    setPointerWhileAwaiting("destravar", "thl", "body");
  };
};
