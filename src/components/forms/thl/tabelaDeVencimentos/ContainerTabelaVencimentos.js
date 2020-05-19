import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Spinner } from "react-bootstrap";
import { Spin } from "antd";
import { StateStorePrincipal } from "components/redux/StoreCreation";
import TabelaVencimentos from "components/forms/thl/tabelaDeVencimentos/TabelaVencimentos";

export default () => {
  const reduxState = StateStorePrincipal().THLReducer;
  const { carregandoTabelaVencimentos } = reduxState;

  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(false);
  const [startY, setStartY] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  const [selectBloqueado, setSelectBloqueado] = useState(false);

  const onMouseDown = (e) => {
    const container = document.getElementById("scrollTabelaVencimento");
    setMouseDown(true);
    setStartX(e.pageX);
    setStartY(e.pageY);
    setScrollLeft(container.scrollLeft);
    setScrollTop(container.scrollTop);
    container.classList.add("ponteiroDragScroll");
  };

  const onMouseUp = (e) => {
    const thl = document.getElementById("thl");
    const container = document.getElementById("scrollTabelaVencimento");
    setMouseDown(false);
    setSelectBloqueado(false);
    thl.classList.remove("blockSelection");
    container.classList.remove("ponteiroDragScroll");
    container.releasePointerCapture(1);
  };

  const onMouseMove = (e) => {
    if (!mouseDown) return;
    e.preventDefault();

    if (!selectBloqueado) {
      const container = document.getElementById("scrollTabelaVencimento");
      const thl = document.getElementById("thl");
      container.setPointerCapture(1);
      thl.classList.add("blockSelection");
      setSelectBloqueado(true);
    }

    let diferencaXInicial = startX - e.pageX;
    let thresholdX = 3;
    if (diferencaXInicial < 1) {
      diferencaXInicial *= -1;
      thresholdX *= -1;
    }

    let diferencaYInicial = startY - e.pageY;
    let thresholdY = 3;
    if (diferencaYInicial < 1) {
      diferencaYInicial *= -1;
      thresholdY *= -1;
    }

    const container = document.getElementById("scrollTabelaVencimento");

    if (diferencaXInicial > Math.abs(thresholdX)) {
      const x = e.pageX;
      const movimentoX = (x - startX + thresholdX) * 3;
      container.scrollLeft = scrollLeft - movimentoX;
    }

    if (diferencaYInicial > Math.abs(thresholdY)) {
      const y = e.pageY;
      const movimentoY = (y - startY + thresholdY) * 1;
      container.scrollTop = scrollTop - movimentoY;
    }
  };

  return (
    <div className="containerSpinnerVencimentos">
      <Spin
        className="spinnerTabelaVencimentos"
        indicator={
          <Spinner className="asdas" animation="border" variant="light" />
        }
        spinning={carregandoTabelaVencimentos}
      >
        <PerfectScrollbar
          options={{
            maxScrollbarLength: 40,
            minScrollbarLength: 40,
            wheelPropagation: false,
          }}
          id="scrollTabelaVencimento"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseMove={onMouseMove}
        >
          <TabelaVencimentos />
        </PerfectScrollbar>
      </Spin>
    </div>
  );
};
