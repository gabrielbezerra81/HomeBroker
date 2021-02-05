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
import Draggable, { DraggableData } from "react-draggable";
import { ModalHeaderClean } from "shared/componentes/PopupHeader";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import CategoryTable from "./CategoryTable";
import bringToForegroundOnMount from "shared/utils/PopupLifeCycle/bringToForegroundOnMount";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import usePrevious from "hooks/usePrevious";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

interface Category {
  title: string;
  lines: Array<{
    symbol: string;
    price: number;
    oscilation: number;
    yearOscilation: number;
    [key: string]: any;
  }>;
}

const limitY = 80;

const CategoryList: React.FC = () => {
  const {
    systemReducer: { isOpenLeftUserMenu, selectedTab, isOpenCategoryList },
  } = useStateStorePrincipal();

  const dispatchGlobal = useDispatchGlobalStore();
  const {
    zIndex: currentZIndex,
    divkey: currentDivKey,
  } = useStateGlobalStore();

  const masonryRef = useRef<any>(null);

  const previousDivkey = usePrevious(currentDivKey);

  const [categoryList, setCategoryList] = useState<Category[]>(list);

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

  const formattedCategoryList = useMemo(() => {
    return categoryList.map((category) => {
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
  }, [categoryList]);

  // Organizar tabelas com masonry layout
  useEffect(() => {
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
  }, [selectedTab]);

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
          <ModalHeaderClean onClose={onClose}>
            <button className="brokerCustomButton">
              + Incluir nova categoria
            </button>
          </ModalHeaderClean>

          <div className="listHeader">
            <table className="categoryTable">
              <thead>
                <tr>
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
                  key={categoryItem.title}
                  category={categoryItem}
                  order={order}
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

var list: Category[] = [
  {
    title: "ALIMENTOS",
    lines: [
      {
        symbol: "ABEV3",
        price: 12.1,
        oscilation: 3.95,
        yearOscilation: -35.19,
      },
      {
        symbol: "BKBR3",
        price: 9.64,
        oscilation: 9.17,
        yearOscilation: -65.19,
      },
      {
        symbol: "BKER3",
        price: 9.64,
        oscilation: 9.17,
        yearOscilation: -65.19,
      },
      {
        symbol: "MRFG3",
        price: 13.1,
        oscilation: -6.95,
        yearOscilation: 35.19,
      },
    ],
  },
  {
    title: "ENERGIA",
    lines: [
      {
        symbol: "CESP6",
        price: 12.1,
        oscilation: 3.95,
        yearOscilation: -35.19,
      },
      {
        symbol: "CMIG4",
        price: 12.96,
        oscilation: -9.94,
        yearOscilation: 0.93,
      },
      {
        symbol: "CPLE6",
        price: 9.64,
        oscilation: 9.17,
        yearOscilation: -65.19,
      },
      {
        symbol: "ELET6",
        price: 13.1,
        oscilation: -6.95,
        yearOscilation: 35.19,
      },
    ],
  },
  {
    title: "VAREJO",
    lines: [
      {
        symbol: "BTOW3",
        price: 12.1,
        oscilation: -2.95,
        yearOscilation: 33.19,
      },
      {
        symbol: "LAME4",
        price: 12.96,
        oscilation: 1.94,
        yearOscilation: 3.93,
      },
      {
        symbol: "MGLU3",
        price: 9.64,
        oscilation: 1.17,
        yearOscilation: 17.19,
      },
    ],
  },
  {
    title: "VESTUÁRIO",
    lines: [
      {
        symbol: "ABEV3",
        price: 12.1,
        oscilation: 3.95,
        yearOscilation: -35.19,
      },
      //   {
      //     symbol: "BEEF3",
      //     price: 12.96,
      //     oscilation: -9.94,
      //     yearOscilation: 0.93,
      //   },      {
      //     symbol: "ABEV3",
      //     price: 12.1,
      //     oscilation: 3.95,
      //     yearOscilation: -35.19,
      //   },
      //   {
      //     symbol: "BEEF3",
      //     price: 12.96,
      //     oscilation: -9.94,
      //     yearOscilation: 0.93,
      //   },
      //   {
      //     symbol: "BKBR3",
      //     price: 9.64,
      //     oscilation: 9.17,
      //     yearOscilation: -65.19,
      //   },
      //   {
      //     symbol: "MRFG3",
      //     price: 13.1,
      //     oscilation: -6.95,
      //     yearOscilation: 35.19,
      //   },
    ],
  },
  {
    title: "EDUCAÇÃO",
    lines: [
      {
        symbol: "CESP6",
        price: 12.1,
        oscilation: 3.95,
        yearOscilation: -35.19,
      },
      {
        symbol: "CMIG4",
        price: 12.96,
        oscilation: -9.94,
        yearOscilation: 0.93,
      },
      {
        symbol: "CMIG4",
        price: 12.96,
        oscilation: -9.94,
        yearOscilation: 0.93,
      },
      {
        symbol: "CPLE6",
        price: 9.64,
        oscilation: 9.17,
        yearOscilation: -65.19,
      },
      {
        symbol: "ELET6",
        price: 13.1,
        oscilation: -6.95,
        yearOscilation: 35.19,
      },
    ],
  },
  {
    title: "TELECOM",
    lines: [
      {
        symbol: "BTOW3",
        price: 12.1,
        oscilation: -2.95,
        yearOscilation: 33.19,
      },
      {
        symbol: "LAME4",
        price: 12.96,
        oscilation: 1.94,
        yearOscilation: 3.93,
      },
      {
        symbol: "MGLU3",
        price: 9.64,
        oscilation: 1.17,
        yearOscilation: 17.19,
      },
      {
        symbol: "VVAR3",
        price: 13.1,
        oscilation: 2.95,
        yearOscilation: -20.19,
      },
    ],
  },
  {
    title: "SHOPPINGS",
    lines: [
      {
        symbol: "BTOW3",
        price: 12.1,
        oscilation: -2.95,
        yearOscilation: 33.19,
      },
      //   {
      //     symbol: "LAME4",
      //     price: 12.96,
      //     oscilation: 1.94,
      //     yearOscilation: 3.93,
      //   },
      //   {
      //     symbol: "MGLU3",
      //     price: 9.64,
      //     oscilation: 1.17,
      //     yearOscilation: 17.19,
      //   },
      //   {
      //     symbol: "VVAR3",
      //     price: 13.1,
      //     oscilation: 2.95,
      //     yearOscilation: -20.19,
      //   },
    ],
  },
  {
    title: "HEALTH CARE",
    lines: [
      {
        symbol: "BTOW3",
        price: 12.1,
        oscilation: -2.95,
        yearOscilation: 33.19,
      },
      {
        symbol: "LAME4",
        price: 12.96,
        oscilation: 1.94,
        yearOscilation: 3.93,
      },
      {
        symbol: "MGLU3",
        price: 9.64,
        oscilation: 1.17,
        yearOscilation: 17.19,
      },
      {
        symbol: "VVAR3",
        price: 13.1,
        oscilation: 2.95,
        yearOscilation: -20.19,
      },
    ],
  },
  {
    title: "FARMA/COSM/TURISMO",
    lines: [
      {
        symbol: "BTOW3",
        price: 12.1,
        oscilation: -2.95,
        yearOscilation: 33.19,
      },
      {
        symbol: "LAME4",
        price: 12.96,
        oscilation: 1.94,
        yearOscilation: 3.93,
      },
      {
        symbol: "MGLU3",
        price: 9.64,
        oscilation: 1.17,
        yearOscilation: 17.19,
      },
      {
        symbol: "VVAR3",
        price: 13.1,
        oscilation: 2.95,
        yearOscilation: -20.19,
      },
    ],
  },
];
