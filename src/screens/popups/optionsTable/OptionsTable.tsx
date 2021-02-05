import React, { useCallback, useMemo } from "react";

import { WindowTable } from "window-table";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import DraggablePopup from "shared/componentes/DraggablePopup/DraggablePopup";
import { ModalHeaderClean } from "shared/componentes/PopupHeader";

interface Option {
  strike: number;
  symbol: string;
  expiration: string;
}

const data: Option[] = [
  {
    strike: 9.57,
    symbol: "ABEVB100",
    expiration: "22/02/2021",
  },
  {
    strike: 11.57,
    symbol: "ABEVE121",
    expiration: "20/05/2022",
  },
  {
    strike: 13.57,
    expiration: "15/07/2022",
    symbol: "ABEVG140",
  },
  {
    strike: 13.57,
    expiration: "15/07/2023",
    symbol: "ABEVG140",
  },
  {
    strike: 13.57,
    expiration: "15/07/2024",
    symbol: "ABEVG140",
  },
  {
    strike: 13.57,
    expiration: "15/07/2025",
    symbol: "ABEVG140",
  },
];

const OptionsTable: React.FC = () => {
  const dispatch = useDispatchStorePrincipal();

  const {
    systemReducer: { isOpenOptionsTable },
  } = useStateStorePrincipal();

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenOptionsTable"));
  }, [dispatch]);

  const columns = useMemo(() => {
    const expirations = data.map((option) => ({
      key: option.expiration,
      title: option.expiration,
      width: 80,
    }));

    return [{ key: "strike", title: "", width: 60 }, ...expirations];
  }, []);

  const tableData = useMemo(() => {
    const tableData: any[] = [];

    return tableData;
  }, []);

  return (
    <DraggablePopup
      popupDivKey="optionsTable"
      popupVisibility={isOpenOptionsTable}
    >
      <div id="optionsTable">
        <div className="mcontent">
          <ModalHeaderClean
            titulo="Carregando simulador"
            onClose={onClose}
          />

          <div>
            <WindowTable
              // className="tabelaCombinacoes"
              // id="optionsTable"
              data={tableData}
              columns={columns}
              // Cell={Td}
              // Header={Thead}
              // Row={StripedRow}
              style={{ height: "200px" }}
            />
          </div>
        </div>
      </div>
    </DraggablePopup>
  );
};

export default OptionsTable;
