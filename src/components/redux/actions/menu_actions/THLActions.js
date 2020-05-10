import {
  MUDAR_VARIAVEL_THL,
  MODIFICAR_VARIAVEL_MULTILEG,
} from "constants/MenuActionTypes";
import { travarDestravarClique } from "components/api/API";
import {
  atualizarDivKeyAction,
  aumentarZindexAction,
} from "components/redux/actions/MainAppActions";
import { abrirItemBarraLateralAction } from "components/redux/actions/TelaPrincipalActions";
import {
  adicionarAba,
  modificarAba,
  atualizarCotacaoAction,
  adicionarOferta,
  modificarVariavelMultilegAction,
} from "components/redux/actions/menu_actions/MultilegActions";
import { erro_exportar_ordens_multileg } from "constants/AlertaErros";
import { pesquisaAtivo } from "components/redux/actions/api_actions/MultilegAPIAction";
import { calculoPreco } from "components/forms/multileg_/CalculoPreco";
import { formatarNumero } from "components/redux/reducers/boletas_reducer/formInputReducer";

export const mudarVariavelTHLAction = (nome, valor) => {
  return (dispatch) => {
    dispatch({
      type: MUDAR_VARIAVEL_THL,
      payload: { nome, valor },
    });
  };
};

export const abrirMultilegTHLAction = (props) => {
  // Actions
  return async (dispatch) => {
    travarDestravarClique("travar", "thl");
    let {
      multilegAberto,
      cotacoesMultileg,
      zIndex,
      dispatchGlobal,
      booksSelecionados,
    } = props;
    dispatchGlobal(atualizarDivKeyAction("multileg"));

    if (!multilegAberto) {
      props.multileg.pop();
      dispatch(abrirItemBarraLateralAction(props, "multilegAberto"));
    } else {
      //Traz para primeiro plano se já estiver aberto
      document.getElementById("multileg").style.zIndex = zIndex + 1;
      dispatchGlobal(aumentarZindexAction("multileg", zIndex, true));
    }

    let objMultileg = adicionarAba(props);

    let multileg = objMultileg.abasMultileg;
    const indiceAba = multileg.length - 1;

    try {
      for (const [indiceOferta, book] of booksSelecionados.entries()) {
        const dadosModificados = await modificarAba(
          multileg,
          indiceAba,
          "ativo",
          book.ativo
        );

        multileg = dadosModificados.abasMultileg;

        const retornoPesquisa = await pesquisaAtivo(
          multileg,
          indiceAba,
          cotacoesMultileg
        );

        multileg = retornoPesquisa.multileg;
        cotacoesMultileg = retornoPesquisa.cotacoesMultileg;

        const opcao = multileg[indiceAba].opcoes.filter(
          (opcao) => opcao.symbol === book.ativo
        );

        let tipo = "";
        if (opcao.length > 0) tipo = opcao[0].type.toLowerCase();
        else tipo = "acao";

        //Adicionar oferta
        const dadosMultileg = await adicionarOferta(
          multileg,
          tipo,
          indiceAba,
          cotacoesMultileg
        );
        multileg = dadosMultileg.abasMultileg;
        cotacoesMultileg = dadosMultileg.cotacoesMultileg;

        const ofertaNova = multileg[indiceAba].tabelaMultileg[indiceOferta];

        ofertaNova.qtde = 100;
        ofertaNova.cv = book.tipo;
      }

      let calculo = calculoPreco(
        multileg[indiceAba],
        "ultimo",
        cotacoesMultileg
      ).toFixed(2);
      calculo = formatarNumero(calculo, 2, ".", ",");
      multileg[indiceAba].preco = calculo;
    } catch (erro) {
      console.log(erro);
      alert(erro_exportar_ordens_multileg);
    }
    objMultileg.abasMultileg = multileg;

    dispatch(
      modificarVariavelMultilegAction("multileg", objMultileg.abasMultileg)
    );
    dispatch(
      modificarVariavelMultilegAction("abaSelecionada", objMultileg.abaAtual)
    );
    dispatch(
      modificarVariavelMultilegAction("cotacoesMultileg", cotacoesMultileg)
    );

    atualizarCotacaoAction(dispatch, props, cotacoesMultileg);

    travarDestravarClique("destravar", "thl");
  };
};
