import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import ReactDOM from "react-dom";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";

import { IoMdAddCircle } from "react-icons/io";

import Draggable, { DraggableData } from "react-draggable";
import { PopupHeader } from "shared/componentes/PopupHeader";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import CategoryTable from "./CategoryTable";
import bringToForegroundOnMount from "shared/utils/PopupLifeCycle/bringToForegroundOnMount";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import usePrevious from "hooks/usePrevious";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

import "../styles/CategoryList.scss";
import {
  addCategoryAction,
  listCategoriesAction,
  updateCategoryListAction,
} from "../duck/actions/categoryListActions";
import api from "api/apiConfig";
import { FiEdit } from "react-icons/fi";

const limitY = 80;

const CategoryList: React.FC = () => {
  const {
    systemReducer: { isOpenLeftUserMenu, selectedTab, isOpenCategoryList },
    categoryListReducer: { categories, removeMode },
  } = useStateStorePrincipal();

  const dispatchGlobal = useDispatchGlobalStore();
  const {
    zIndex: currentZIndex,
    divkey: currentDivKey,
  } = useStateGlobalStore();

  const masonryRef = useRef<any>(null);

  const previousDivkey = usePrevious(currentDivKey);

  const dispatch = useDispatchStorePrincipal();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [bounds, setBounds] = useState<
    | {
        left: number;
        top: number;
      }
    | undefined
  >(undefined);

  const limitX = useMemo(() => {
    return isOpenLeftUserMenu ? 220 : 88;
  }, [isOpenLeftUserMenu]);

  const onStartDragging = useCallback(
    (e, data: DraggableData) => {
      setIsDragging(true);

      if (!bounds) {
        const bound = data.node.getBoundingClientRect();

        setBounds({ left: -1 * bound.x + limitX, top: -1 * bound.y + limitY });
      }
    },
    [bounds, limitX],
  );

  const onStopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback(
    (e, data: DraggableData) => {
      if (!bounds) {
        return;
      }

      setPosition({ x: data.x, y: data.y });
    },
    [bounds],
  );

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenCategoryList"));
  }, [dispatch]);

  const handleAddCategory = useCallback(() => {
    dispatch(addCategoryAction());
  }, [dispatch]);

  const handleToggleRemoveMode = useCallback(() => {
    dispatch(updateCategoryListAction({ removeMode: !removeMode }));
  }, [dispatch, removeMode]);

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

  // Organizar tabelas com masonry layout
  useEffect(() => {
    if (categories.length) {
      const numCols = 3;
      const colHeights = Array(numCols).fill(0);
      const container = ReactDOM.findDOMNode(masonryRef.current) as any;

      // if (container) {
      //   Array.from(container.children).forEach((child: any, i) => {
      //     const order = i % numCols;
      //     child.style.order = order;
      //     colHeights[order] += parseFloat(child.clientHeight);
      //   });
      //   container.style.height = Math.max(...colHeights) + "px";
      // }
    }
  }, [categories.length, selectedTab]);

  // Trazer para primeiro plano ao montar
  useEffect(() => {
    bringToForegroundOnMount({
      popupDivKey: "categoryList",
      currentDivKey,
      currentZIndex,
      increaseZIndex: () =>
        dispatchGlobal(
          aumentarZindexAction("categoryList", currentZIndex, true),
        ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trazer para primeiro plano ao tentar abrir não estando na aba principal
  useEffect(() => {
    setPopupZIndexFromSecondaryTab({
      zIndex: currentZIndex,
      previousDivkey,
      currentDivkey: currentDivKey,
      divkeyToCheck: "categoryList",
      popupVisibility: isOpenCategoryList,
      updateFunction: (...data) =>
        dispatchGlobal(aumentarZindexAction(...data)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDivKey, isOpenCategoryList]);

  // Carregar categorias
  useEffect(() => {
    dispatch(listCategoriesAction());
  }, [dispatch]);

  let order = -1;

  // useEffect(() => {
  //   setInterval(() => {
  //     setCategoryList((oldList) => {
  //       const updatedCategoryList = produce(oldList, (draft) => {
  //         draft[0].lines[0].price = Math.random();
  //         draft[0].lines[1].price = Math.random();
  //         draft[1].lines[0].price = Math.random();
  //         draft[2].lines[0].price = Math.random();
  //         draft[3].lines[0].price = Math.random();
  //       });

  //       return updatedCategoryList;
  //     });
  //   }, 4000);
  // }, []);

  return (
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mheader"
      position={position}
      onStart={onStartDragging}
      onStop={onStopDragging}
      onDrag={onDrag}
      bounds={bounds}
      positionOffset={{ y: 27, x: 4 }}
    >
      <div id="categoryList">
        <div className="mcontent">
          <PopupHeader onClose={onClose}>
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
                  <th></th>
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
                  <th></th>
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
                  <th className="deleteColumnTh"></th>
                  <th>Ativo</th>
                  <th>Preço</th>
                  <th>Oscilação</th>
                  <th>Osc YTD</th>
                </tr>
              </thead>
            </table>
          </div>
          <main ref={masonryRef}>
            {formattedCategoryList.map((categoryItem, index) => {
              order += 1;

              if (order === 3) {
                order = 0;
              }

              return (
                <CategoryTable
                  key={index}
                  category={categoryItem}
                  categoryIndex={index}
                  // order={order}
                />
              );
            })}
          </main>
        </div>
      </div>
    </Draggable>
  );
};

export default CategoryList;
