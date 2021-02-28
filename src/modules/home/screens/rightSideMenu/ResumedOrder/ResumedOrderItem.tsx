import React, { useCallback, useMemo, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import { Order } from "modules/ordersExec/types/ordersExec";
import { updateManyOrdersExecStateAction } from "modules/ordersExec/duck/actions/OrdensExecActions";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { updateOneSystemStateAction } from "redux/actions/system/SystemActions";
import CustomTooltip from "shared/components/CustomTooltip";

interface ResumedOrderItemProps {
  order: Order;
}

const ResumedOrderItem: React.FC<ResumedOrderItemProps> = ({ order }) => {
  const dispatch = useDispatchStorePrincipal();

  const [headerVisible, setHeaderVisible] = useState(false);

  const progress = useMemo(() => {
    const initial = { offerQtty: 0, execQtty: 0 };

    const qttyValues = order.offers.reduce((acc, cur) => {
      return {
        offerQtty: acc.offerQtty + cur.qtdeOferta,
        execQtty: acc.execQtty + cur.qtdeExecutada,
      };
    }, initial);

    return (qttyValues.execQtty / qttyValues.offerQtty) * 100;
  }, [order]);

  const formattedPrices = useMemo(() => {
    const offer = order.offers[0];

    return {
      trigger: formatarNumDecimal(offer.precoDisparo || 0),
      send: formatarNumDecimal(offer.precoEnvio || 0),
      limit: formatarNumDecimal(offer.precoLimite || 0),
      executed: formatarNumDecimal(offer.precoLimite || 0),
    };
  }, [order]);

  const handleHeaderVisibilityChange = useCallback(
    () => setHeaderVisible((oldValue) => !oldValue),
    [],
  );

  const handleClose = useCallback(() => {}, []);

  const handleSearch = useCallback(() => {
    dispatch(updateOneSystemStateAction("isOpenOrdersExec", true));
    dispatch(
      updateManyOrdersExecStateAction({
        ordemAtual: order,
        opcoesOrdemAberto: true,
      }),
    );
  }, [dispatch, order]);

  return (
    <div className="orderContainer">
      <header className="itemHeader" style={{ opacity: headerVisible ? 1 : 0 }}>
        <button onClick={handleSearch}>
          <FiSearch size={20} stroke="#444" />
        </button>

        <button onClick={handleClose}>
          <RiCloseCircleFill size={20} fill="#444" />
        </button>
      </header>
      <button
        className="resumedOrderItem"
        onClick={handleHeaderVisibilityChange}
      >
        <div className="progress" style={{ width: `${progress}%` }}></div>
        <div className="offersContainer">
          {order.offers.map((offerItem, index) => (
            <div className="offer" key={`${offerItem.ativo}${index}`}>
              <div
                className={`offerType ${
                  offerItem.oferta === "C" ? "buyType" : "sellType"
                }`}
              >
                <strong>{offerItem.oferta}</strong>
              </div>
              <span className="symbol">{offerItem.ativo}</span>
              <span>
                {offerItem.qtdeExecutada < 1000
                  ? offerItem.qtdeExecutada
                  : formatarQuantidadeKMG(offerItem.qtdeExecutada)}
              </span>
            </div>
          ))}
        </div>

        <CustomTooltip
          id={order.id}
          content={
            <div>
              <header>
                <span>Preço</span>
              </header>

              <main>
                <div>
                  <span>Disparo</span>
                  <span>{formattedPrices.trigger}</span>
                </div>
                <div>
                  <span>Envio</span>
                  <span>{formattedPrices.send}</span>
                </div>
                <div>
                  <span>Limite</span>
                  <span>{formattedPrices.limit}</span>
                </div>
                <div>
                  <span>Executado</span>
                  <span>{formattedPrices.executed}</span>
                </div>
              </main>
            </div>
          }
        >
          <span>
            R${" "}
            {formatarNumDecimal(
              order.offers[0].precoDisparo || order.offers[0].precoEnvio || 0,
            )}
          </span>
        </CustomTooltip>
      </button>
    </div>
  );
};

export default ResumedOrderItem;
