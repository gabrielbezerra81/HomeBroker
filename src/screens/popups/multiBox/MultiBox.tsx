import React, { useCallback, useEffect, useMemo, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";

import moment from "moment";

import { RiCloseCircleFill } from "react-icons/ri";
import { AiFillMinusCircle } from "react-icons/ai";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { MultiBoxData, TopSymbols } from "types/multiBox/MultiBoxState";
import { updateBoxAttrAction } from "redux/actions/multiBox/multiBoxActions";
import Tab5 from "./Tab5/Tab5";
import Tab4 from "./tab4/Tab4";
import SymbolCard from "./tab4/SymbolCard";

interface Props {
  multiBox: MultiBoxData;
}

const limitY = 80;

const MultiBox: React.FC<Props> = ({ multiBox }) => {
  const {
    systemReducer: { selectedTab, openedMenus, isOpenLeftUserMenu },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { strikeViewMode } = multiBox;

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

  const handleBoxTabChange = useCallback(
    (e) => {
      const newSelectedTab = e.currentTarget.name.replace("tab", "");

      dispatch(
        updateBoxAttrAction(multiBox.id, {
          activeTab: newSelectedTab,
        }),
      );
    },
    [dispatch, multiBox],
  );

  useEffect(() => {
    const box = document.getElementById(`${multiBox.id}`);

    if (box) {
      const { x, y } = box.getBoundingClientRect();
      setPosition({ x: x - 116, y: y - 85 });
      // box.style.position = "absolute";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topSymbols = useMemo(() => {
    const symbols: TopSymbols[] = multiBox.boxOffers.map((offer) => {
      const [year, month, day] = offer.selectedExpiration
        .split("-")
        .map((value) => Number(value));

      const expirationDate = new Date(year, month - 1, day);

      const dateDiff = moment(expirationDate).diff(new Date(), "days") + "d";

      return {
        qtty: offer.qtty,
        code: offer.selectedCode,
        model: offer.model,
        strike: offer.selectedStrike,
        offerType: offer.offerType === "C" ? "C" : "P",
        viewMode: strikeViewMode,
        expiration: offer.model ? dateDiff : "",
      };
    });

    return symbols;
  }, [multiBox.boxOffers, strikeViewMode]);

  const americanTopSymbols = useMemo(() => {
    return topSymbols.filter(
      (item) => item.model === "AMERICAN" || !item.model,
    );
  }, [topSymbols]);

  const europeanTopSymbols = useMemo(() => {
    return topSymbols.filter((item) => item.model === "EUROPEAN");
  }, [topSymbols]);

  return (
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mcontent"
      position={position}
      onStart={onStartDragging}
      onStop={onStopDragging}
      onDrag={onDrag}
      bounds={bounds}
    >
      <div
        className="multiBox"
        style={
          {
            // ...visibilityClass,
          }
        }
        id={multiBox.id}
      >
        <div className="topSymbolsContainer">
          <div>
            {americanTopSymbols.map((topSymbol, index) => (
              <SymbolCard data={topSymbol} key={index} showQtty />
            ))}
          </div>
          <div>
            {europeanTopSymbols.map((topSymbol, index) => (
              <SymbolCard data={topSymbol} key={index} showQtty />
            ))}
          </div>
        </div>

        {/*minimizedClass  */}
        <div className={`mcontent boxContent `}>
          {multiBox.activeTab === "4" && <Tab4 multiBox={multiBox} />}
          {multiBox.activeTab === "5" && <Tab5 multiBox={multiBox} />}
          <div className="tabButtons">
            <button
              className={`brokerCustomButton ${isSelected(
                "1",
                multiBox.activeTab,
              )}`}
              name="tab1"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "2",
                multiBox.activeTab,
              )}`}
              name="tab2"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "3",
                multiBox.activeTab,
              )}`}
              name="tab3"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "4",
                multiBox.activeTab,
              )}`}
              name="tab4"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "5",
                multiBox.activeTab,
              )}`}
              name="tab5"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default MultiBox;

function isSelected(tabKey: string, activeTab: string) {
  return tabKey === activeTab ? " selected" : "";
}

// const boxIndex = useMemo(() => {
//   return boxesVisibility.findIndex(
//     (boxItem) => boxItem.boxKey === `box${quoteBox.id}`,
//   );
// }, [boxesVisibility]);

// const formattedBox: FormattedBox = useMemo(() => {
//   const box = {} as FormattedBox;

//   Object.keys(quoteBox).forEach((key) => {
//     const parsedKey = key as keyof BoxProps;

//     if (typeof quoteBox[parsedKey] === "number") {
//       box[parsedKey] = formatarNumDecimal(quoteBox[parsedKey], 2, 2);
//     } //
//     else if (parsedKey === "book" && quoteBox.book) {
//       box.book = { buy: [], sell: [] };

//       box.book.buy = quoteBox.book.buy
//         .filter(
//           (bookLine) =>
//             bookLine.price.toString() !== "0.0031415" &&
//             bookLine.qtty.toString() !== "0.0031415",
//         )
//         .map((bookLine) => ({
//           ...bookLine,
//           formattedQtty: formatarQuantidadeKMG(bookLine.qtty),
//           formattedPrice: formatarNumDecimal(bookLine.price),
//         }));
//       box.book.sell = quoteBox.book.sell
//         .filter(
//           (bookLine) =>
//             bookLine.price.toString() !== "0.0031415" &&
//             bookLine.qtty.toString() !== "0.0031415",
//         )
//         .map((bookLine) => ({
//           ...bookLine,
//           formattedQtty: formatarQuantidadeKMG(bookLine.qtty),
//           formattedPrice: formatarNumDecimal(bookLine.price),
//         }));
//     } else {
//       box[parsedKey] = quoteBox[parsedKey] as any;
//     }
//   });
//   return box;
// }, []);

// const sliderBackgroundColor = useMemo(() => {
//   return quoteBox.dayOscilation >= 0 ? "sliderBuyColor" : "sliderSellColor";
// }, []);

// const visibilityClass = useMemo(() => {
//   const shouldShowBox = openedMenus.some(
//     (menuItem) =>
//       menuItem.menuKey === `box${quoteBox.id}` &&
//       menuItem.tabKey === selectedTab,
//   );

//   return shouldShowBox ? {} : { display: "none" };
// }, [openedMenus, selectedTab]);

// const minimizedClass = useMemo(() => {
//   return boxesVisibility[boxIndex]?.visibility ? "" : "hiddenBoxContent";
// }, [boxIndex, boxesVisibility]);

// const handleMinimize = useCallback(() => {
//   const updatedBoxesVisibility = produce(boxesVisibility, (draft) => {
//     draft[boxIndex].visibility = !draft[boxIndex].visibility;
//   });

//   dispatch(
//     updateOneSystemStateAction("boxesVisibility", updatedBoxesVisibility),
//   );
// }, [boxesVisibility, dispatch, boxIndex]);

// const handleClose = useCallback(async () => {
//   try {
//     const shouldDelete = await deleteQuoteBoxAPI(quoteBox.id);

//     if (shouldDelete) {
//       const updatedOpenedMenus = produce(openedMenus, (draft) => {
//         return draft.filter(
//           (menuItem) => menuItem.menuKey !== `box${quoteBox.id}`,
//         );
//       });

//       const updatedBoxesVisibility = produce(boxesVisibility, (draft) => {
//         draft.splice(boxIndex, 1);
//       });

//       const updatedQuoteBoxes = produce(quoteBoxes, (draft) => {
//         const index = draft.findIndex(
//           (boxItem) => boxItem.id === quoteBox.id,
//         );

//         if (index >= 0) draft.splice(index, 1);
//       });

//       dispatch(
//         updateManySystemState({
//           openedMenus: updatedOpenedMenus,
//           boxesVisibility: updatedBoxesVisibility,
//           quoteBoxes: updatedQuoteBoxes,
//         }),
//       );
//     }
//   } catch (error) {}
// }, [boxIndex, boxesVisibility, openedMenus, quoteBoxes, dispatch]);
