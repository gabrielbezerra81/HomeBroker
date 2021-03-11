// import { setPointerWhileAwaiting } from "api/API";
// import { error_open_alert } from "constants/AlertaErros";
// import { formatarNumero } from "shared/utils/Formatacoes";
// import { MainThunkAction } from "types/ThunkActions";
// import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
// import {
//   abrirItemBarraLateralAction,
//   sendMultilegToCurrentTabAction,
//   updateManySystemState,
// } from "redux/actions/system/SystemActions";
// import {
//   cond_addMultilegOffer,
//   cond_addMultilegTab,
//   cond_cloneMultilegQuotes,
//   cond_cloneMultilegTabs,
//   updateConditionalMultilegStateAction,
//   cond_updateMultilegTab,
// } from "./ConditionalMultilegActions";
// import { cond_searchMultilegSymbolData } from "./ConditionalMultilegAPIAction";
// import { updateManyConditionalMultilegState } from "./utils";
// import { globalStore } from "redux/StoreCreation";
// import { toast } from "react-toastify";

// export const openAlertInMultileg = (alertItem: AlertAPI): MainThunkAction => {
//   return async (dispatch, getState) => {
//     const {
//       conditionalMultilegReducer: { multileg, cotacoesMultileg },
//       systemReducer: { isOpenConditionalMultileg },
//     } = getState();

//     const { price, param, operator, comment } = alertItem;
//     // multileg[0].isAlertOpen = true;
//     // multileg[0].ativoAtual = alertItem.structure.symbol;

//     dispatch(updateConditionalMultilegStateAction("loadingOffers", true));

//     dispatch(
//       updateManySystemState({
//         multilegButtonsVisibility: false,
//         createAlertButtonVisibility: true,
//       }),
//     );

//     const clonedMultilegTabs = cond_cloneMultilegTabs(multileg);

//     const symbols = alertItem.structure.components.map((component) => {
//       return {
//         symbol: component.stock.symbol,
//         type: component.stock.option ? component.stock.type : undefined,
//         model: component.stock.option ? component.stock.model : undefined,
//         strike: component.stock.strike,
//         qtty: component.qtty,
//       };
//     });

//     if (isOpenConditionalMultileg) {
//       clonedMultilegTabs.pop();
//     }

//     dispatch(sendMultilegToCurrentTabAction());

//     globalStore.dispatch(atualizarDivKeyAction("conditionalMultileg") as any);
//     dispatch(abrirItemBarraLateralAction("isOpenConditionalMultileg", true));

//     // Adicionar aba
//     let result = cond_addMultilegTab(clonedMultilegTabs);

//     let updatedMultilegTabs = result.multilegTabs;
//     let updatedMultilegQuotes = cond_cloneMultilegQuotes(cotacoesMultileg);
//     const tabIndex = updatedMultilegTabs.length - 1;

//     updatedMultilegTabs[tabIndex].isAlertOpen = true;
//     updatedMultilegTabs[tabIndex].param = param;
//     updatedMultilegTabs[tabIndex].operator = operator;
//     updatedMultilegTabs[tabIndex].comment = comment;

//     try {
//       for (const [offerIndex, offer] of symbols.entries()) {
//         //Alterar ativo
//         let updatedData = await cond_updateMultilegTab({
//           multilegTabs: updatedMultilegTabs,
//           tabIndex: tabIndex,
//           attributeName: "ativo",
//           attributeValue: offer.symbol,
//         });

//         updatedMultilegTabs = updatedData.multilegTabs;

//         //Pesquisar ativo
//         updatedData = await cond_searchMultilegSymbolData({
//           multilegTabs: updatedMultilegTabs,
//           tabIndex: tabIndex,
//           multilegQuotes: updatedMultilegQuotes,
//         });

//         updatedMultilegTabs = updatedData.multilegTabs;
//         updatedMultilegQuotes = updatedData.multilegQuotes as any;

//         const options = updatedMultilegTabs[tabIndex].opcoes.filter(
//           (option) => option.symbol === offer.symbol,
//         );
//         let offerType: any = "";
//         if (options.length > 0) offerType = options[0].type.toLowerCase();
//         else offerType = "acao";

//         //Adicionar oferta
//         const multilegDataWithOffer = await cond_addMultilegOffer({
//           multilegTabs: updatedMultilegTabs,
//           offerType,
//           tabIndex: tabIndex,
//           multilegQuotes: updatedMultilegQuotes,
//         });

//         updatedMultilegTabs = multilegDataWithOffer.multilegTabs;
//         updatedMultilegQuotes = multilegDataWithOffer.multilegQuotes;

//         const newOffer =
//           updatedMultilegTabs[tabIndex].tabelaMultileg[offerIndex];

//         newOffer.qtde = offer.qtty;

//         // Temporario, por enquanto as quantidades não estão multiplas de 100
//         if (offer.qtty === 1) {
//           newOffer.qtde = offer.qtty * 100;
//         } else if (offer.qtty === -1) {
//           newOffer.qtde = offer.qtty * 100 * -1;
//         }

//         if (offer.qtty > 0) {
//           newOffer.cv = "compra";
//         } else {
//           newOffer.cv = "venda";
//         }
//       }

//       let tabPrice = price.toFixed(2);

//       tabPrice = formatarNumero(tabPrice, 2, ".", ",");
//       updatedMultilegTabs[tabIndex].preco = tabPrice;
//     } catch (error) {
//       console.log(error);
//       toast.error(error_open_alert);
//       setPointerWhileAwaiting({
//         lockMode: "destravar",
//         id: "menusTelaPrincipal",
//         parentID: "body",
//       });
//     }

//     //Disparar atualizações feitas com objeto multileg
//     result.multilegTabs = updatedMultilegTabs;

//     dispatch(
//       updateManyConditionalMultilegState({
//         multileg: result.multilegTabs,
//         abaSelecionada: result.currentTab,
//         cotacoesMultileg: updatedMultilegQuotes,
//       }),
//     );

//     dispatch(updateConditionalMultilegStateAction("loadingOffers", false));
//   };
// };

export {};
