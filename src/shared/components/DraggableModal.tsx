import React, { useCallback, useState, useEffect } from "react";
import Draggable from "react-draggable";

import ConfigurarStop from "modules/boletas/screens/compra/compra_StartStop/ConfigurarStop";
import ConfigurarStopVenda from "modules/boletas/screens/venda/venda_StartStop/ConfigurarStopVenda";
import FiltrarOrdens from "modules/ordersExec/screens/FiltrarOrdens"; //posicaoFormCompraVenda
import ConfigComplementar from "modules/multileg/screens/ConfigComplementar";
import { Resizable } from "re-resizable";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
// import loadPopupPosition from "shared/utils/PopupPosition/loadPopupPosition";
import savePopupPositionOnDragEnd from "shared/utils/PopupPosition/savePopupPositionOnDragEnd";
import usePrevious from "hooks/usePrevious";
import { useMemo } from "react";

const limitY = 75;

interface Props {
  shouldResetPosition?: boolean;
  id?: string;
  classConfigAberto?: string;
  handle?: string;
  renderModalBody: () => React.ReactNode;
  renderHeader: (resetPosition: () => void) => React.ReactNode;
  renderConfigForm?: () => React.ReactNode;
  renderConfigComplementar?: () => React.ReactNode;
  renderTopPopupComponent?: () => React.ReactNode;
  renderBottomPopupComponent?: () => React.ReactNode;
}

type Bounds = { left: number; top: number };

const DragglableModal: React.FC<Props> = ({
  shouldResetPosition,
  id = "",
  handle = ".mheader",
  classConfigAberto = "",
  renderModalBody,
  renderHeader,
  renderConfigForm,
  renderConfigComplementar,
  renderTopPopupComponent,
  renderBottomPopupComponent,
}) => {
  const {
    systemReducer: { isOpenLeftUserMenu },
  } = useStateStorePrincipal();

  const previousShouldResetPosition = usePrevious(isOpenLeftUserMenu);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState<Bounds | undefined>(undefined);
  const [limitX, setLimitX] = useState(88);

  useEffect(() => {
    let limitX = 88;

    if (isOpenLeftUserMenu) {
      limitX = 220;
    }

    setLimitX(limitX);
  }, [isOpenLeftUserMenu]);

  useEffect(() => {
    if (shouldResetPosition === true && !previousShouldResetPosition) {
      setPosition({ x: 0, y: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldResetPosition]);

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const onStartDragging = useCallback(
    (e, data) => {
      if (!bounds) {
        const bound = data.node.getBoundingClientRect();

        setBounds({
          left: -1 * bound.x + limitX,
          top: -1 * bound.y + limitY,
        });
      }
    },
    [bounds, limitX],
  );

  const onDrag = useCallback((e, data) => {
    e.preventDefault();

    const { x, y } = data;

    setPosition({ x, y });
  }, []);

  const onStopDragging = useCallback(() => {
    savePopupPositionOnDragEnd({
      id,
      position: {
        x: position.x,
        y: position.y,
      },
    });
  }, [id, position.x, position.y]);

  const renderedTopPopup = useMemo(() => {
    if (renderTopPopupComponent) {
      return renderTopPopupComponent();
    }

    if (id === "ordens_execucao") {
      return <RenderFiltrarOrdens />;
    }

    return null;
  }, [id, renderTopPopupComponent]);

  const renderedBottomPopup = useMemo(() => {
    if (renderBottomPopupComponent) {
      return renderBottomPopupComponent();
    }

    return null;
  }, [renderBottomPopupComponent]);

  const renderedHeader = useMemo(
    () => renderHeader(resetPosition),
    [renderHeader, resetPosition],
  );

  const renderedBody = useMemo(() => renderModalBody(), [renderModalBody]);

  const popupContent = useMemo(
    () => (
      <div id={id !== "thl" ? id : ""} className={classConfigAberto}>
        {renderedTopPopup}
        <div className="mcontent">
          {renderedHeader}
          {renderedBody}
        </div>
        {renderedBottomPopup}

        {renderConfigForm && id === "comprastartstop" ? (
          <ConfigurarStop />
        ) : null}
        {renderConfigForm && id === "vendastartstop" ? (
          <ConfigurarStopVenda />
        ) : null}
        {renderConfigComplementar &&
        ["multileg", "conditionalMultileg"].includes(id) ? (
          <ConfigComplementar />
        ) : null}
      </div>
    ),
    [
      classConfigAberto,
      id,
      renderConfigComplementar,
      renderConfigForm,
      renderedBody,
      renderedBottomPopup,
      renderedHeader,
      renderedTopPopup,
    ],
  );

  const resizableProps = useMemo(() => ({ id } as any), [id]);

  return (
    <Draggable
      enableUserSelectHack={false}
      handle={handle}
      position={position}
      defaultPosition={{ x: 0, y: 0 }}
      onStart={onStartDragging}
      onDrag={onDrag}
      onStop={onStopDragging}
      bounds={bounds}
    >
      {id === "thl" ? (
        <Resizable
          defaultSize={defaultSize}
          minWidth="607"
          minHeight="1205"
          maxHeight="1205"
          style={resizableStyle}
          {...resizableProps}
        >
          {popupContent}
        </Resizable>
      ) : (
        popupContent
      )}
    </Draggable>
  );
};

export default DragglableModal;

const RenderFiltrarOrdens = () => {
  const { ordersExecReducer } = useStateStorePrincipal();
  const { filtrarOrdensAberto } = ordersExecReducer;

  if (filtrarOrdensAberto) return <FiltrarOrdens />;
  return <div></div>;
};

const resizableStyle = { position: "absolute" };

const defaultSize = {
  width: 1210,
} as any;

/*
const aplicarPosicao = id => {
  const IDs = [];
  if (IDs.includes(id)) {
    return "posicaoFormCompraVenda";
  } else return "";
};
*/
