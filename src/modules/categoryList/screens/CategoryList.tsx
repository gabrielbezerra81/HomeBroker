import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import ReactDOM from "react-dom";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback, useMemo, useRef, useEffect } from "react";

import { IoMdAddCircle } from "react-icons/io";
import PerfectScroll from "react-perfect-scrollbar";
import { Resizable } from "re-resizable";

import { PopupHeader } from "shared/components/PopupHeader";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import CategoryTable from "./CategoryTable";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

import "../styles/CategoryList.scss";
import {
  addCategoryAction,
  listCategoriesAction,
  updateCategoryListAction,
} from "../duck/actions/categoryListActions";
import { FiEdit } from "react-icons/fi";
import DraggablePopup from "shared/components/DraggablePopup/DraggablePopup";

const savedDimensionsPath = "@homebroker:categoryListDimensions";

const CategoryList: React.FC = () => {
  const {
    systemReducer: { selectedTab, isOpenCategoryList },
    categoryListReducer: { categories, removeMode },
  } = useStateStorePrincipal();

  const masonryRef = useRef<any>(null);

  const dispatch = useDispatchStorePrincipal();

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenCategoryList", null, false));
  }, [dispatch]);

  const handleAddCategory = useCallback(() => {
    dispatch(addCategoryAction());
  }, [dispatch]);

  const handleToggleRemoveMode = useCallback(() => {
    dispatch(updateCategoryListAction({ removeMode: !removeMode }));
  }, [dispatch, removeMode]);

  const saveDimensionsOnResizeStop = useCallback(
    (e, d, element: HTMLElement) => {
      const dimensions = {
        height: element.clientHeight,
        width: element.clientWidth,
      };

      localStorage.setItem(savedDimensionsPath, JSON.stringify(dimensions));
    },
    [],
  );

  const formattedCategoryList = useMemo(() => {
    return categories.map((category) => {
      const lines = category.lines.map((lineItem) => {
        const formattedPrice = `R$ ${formatarNumDecimal(lineItem.price)}`;
        const formattedOscilation = `${formatarNumDecimal(
          lineItem.oscilation,
        )}%`;
        const formattedYearOscilation = `${formatarNumDecimal(
          lineItem.yearOscilation,
        )}%`;

        return {
          ...lineItem,
          formattedPrice,
          formattedOscilation,
          formattedYearOscilation,
        };
      });

      return { ...category, lines };
    });
  }, [categories]);

  const popupDimensions = useMemo(() => {
    const dimensions = localStorage.getItem(savedDimensionsPath);

    if (dimensions) {
      return JSON.parse(dimensions) as { width: number; height: number };
    }

    return {
      width: 1080,
      height: 605,
    };
  }, []);

  // Organizar tabelas com masonry layout
  useEffect(() => {
    if (categories.length) {
      const numCols = 3;
      const colHeights = Array(numCols).fill(0);
      const container = ReactDOM.findDOMNode(masonryRef.current) as any;

      if (container) {
        Array.from(container.children).forEach((child: any, i) => {
          const order = i % numCols;

          child.style.order = order;
          colHeights[order] += parseFloat(child.clientHeight);
        });

        container.style.height = Math.max(...colHeights) + "px";
      }
    }
  }, [categories.length, selectedTab]);

  // Carregar categorias
  useEffect(() => {
    dispatch(listCategoriesAction());
  }, [dispatch]);

  const resizableExtraProps = useMemo(() => {
    return { id: "categoryList" };
  }, []);

  return (
    <DraggablePopup
      popupDivKey="categoryList"
      popupVisibility={isOpenCategoryList}
    >
      <Resizable
        defaultSize={popupDimensions}
        minWidth={800}
        minHeight={200}
        maxHeight={1500}
        style={{ position: "absolute" }}
        onResizeStop={saveDimensionsOnResizeStop}
        {...resizableExtraProps}
      >
        <div className="mcontent">
          <PopupHeader
            onClose={onClose}
            headerTitle="Mapa Panorâmico de Ativos"
          >
            <button className="brokerCustomButton" onClick={handleAddCategory}>
              <IoMdAddCircle size={18} fill="#C4C4C4" /> Incluir nova categoria
            </button>

            <button
              className="brokerCustomButton toggleRemoveButton"
              onClick={handleToggleRemoveMode}
            >
              <FiEdit size={18} />
            </button>
          </PopupHeader>

          <div className="listHeader">
            <table className="categoryTable">
              <thead>
                <tr>
                  <th className="deleteColumnTh" />
                  <th>Ativo</th>
                  <th>Preço</th>
                  <th>Oscilação</th>
                  <th>Osc YTD</th>
                </tr>
              </thead>
            </table>
            <table className="categoryTable">
              <thead>
                <tr>
                  <th className="deleteColumnTh" />
                  <th>Ativo</th>
                  <th>Preço</th>
                  <th>Oscilação</th>
                  <th>Osc YTD</th>
                </tr>
              </thead>
            </table>
            <table className="categoryTable">
              <thead>
                <tr>
                  <th className="deleteColumnTh" />
                  <th>Ativo</th>
                  <th>Preço</th>
                  <th>Oscilação</th>
                  <th>Osc YTD</th>
                </tr>
              </thead>
            </table>
          </div>

          <PerfectScroll
            id="categoryListScroll"
            options={{ wheelPropagation: false }}
          >
            <main ref={masonryRef}>
              {/* ref={masonryRef} */}
              {formattedCategoryList.map((categoryItem, index) => {
                return (
                  <CategoryTable
                    key={index}
                    category={categoryItem}
                    categoryIndex={index}
                    order={index % 3}
                  />
                );
              })}
            </main>
          </PerfectScroll>
        </div>
      </Resizable>
    </DraggablePopup>
  );
};

export default CategoryList;
