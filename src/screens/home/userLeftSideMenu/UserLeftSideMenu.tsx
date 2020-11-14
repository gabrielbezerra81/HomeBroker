import React, { useCallback, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { FaCaretDown } from "react-icons/fa";
import { getDiaSemana, getDiaEMes } from "shared/utils/Formatacoes";
import { MDBIcon } from "mdbreact";
import { Radio, Select } from "antd";
import {
  deslogarUsuarioAction,
  updateOneSystemStateAction,
} from "redux/actions/system/SystemActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { RadioChangeEvent } from "antd/lib/radio";

const UserLeftSideMenu: React.FC = () => {
  const {
    systemReducer: {
      isOpenLeftUserMenu,
      connectedUser,
      updateMode,
      updateInterval,
      isLeftSideMenuConfigOpen,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const handleLogout = useCallback(() => {
    dispatch(deslogarUsuarioAction());
  }, [dispatch]);

  const handleChangeIsConfigOpen = useCallback(() => {
    dispatch(
      updateOneSystemStateAction(
        "isLeftSideMenuConfigOpen",
        !isLeftSideMenuConfigOpen,
      ),
    );
  }, [dispatch, isLeftSideMenuConfigOpen]);

  const handleChangeUpdateMode = useCallback(
    (e: RadioChangeEvent) => {
      dispatch(updateOneSystemStateAction("updateMode", e.target.value));
    },
    [dispatch],
  );

  const handleChangeUpdateInterval = useCallback(
    (value: any) => {
      dispatch(updateOneSystemStateAction("updateInterval", value));
    },
    [dispatch],
  );

  const date = useMemo(() => {
    return { weekDay: getDiaSemana(), monthDay: getDiaEMes() };
  }, []);

  const visibilityClass = useMemo(() => {
    if (isOpenLeftUserMenu) return " visible";
    return " hide";
  }, [isOpenLeftUserMenu]);

  const expandedConfigMenu = useMemo(() => {
    if (isLeftSideMenuConfigOpen) return "expandedConfig";
    return "";
  }, [isLeftSideMenuConfigOpen]);

  return (
    <div className={`divMenuLateral${visibilityClass}`}>
      <div className="itemMenuLateral">
        <h6>MENU</h6>
      </div>
      <div className="itemMenuLateral">
        <Row>
          <Col>
            <h6>{connectedUser}</h6>
          </Col>
        </Row>
      </div>
      <div
        className="divClicavel itemMenuLateral"
        onClick={handleLogout}
        tabIndex={0}
      >
        <div className="flexCenterCenter">
          <MDBIcon icon="power-off" className="iconeDeslogar" />
          <h6 className="textoLogout">LOGOUT</h6>
        </div>
        <div className="flexCenterCenter">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusConectado"
          />
          <h6 className="textoConectado">CONECTADO</h6>
        </div>
      </div>
      <div className="itemMenuLateral">
        <h6>
          {date.weekDay}
          <br /> {date.monthDay}
        </h6>
      </div>
      <div className={`updateModeSelector ${expandedConfigMenu}`}>
        <button onClick={handleChangeIsConfigOpen}>
          Configurações
          <FaCaretDown size={14} />
        </button>

        <main>
          <Radio.Group value={updateMode} onChange={handleChangeUpdateMode}>
            <Radio value={"reactive"}>Reativa</Radio>
            <Radio value={"proactive"}>Pro Ativa</Radio>
          </Radio.Group>

          <Select
            size="small"
            dropdownClassName="updateIntervalDropdown"
            value={updateMode === "reactive" ? "" : updateInterval}
            className="updateIntervalSelect"
            suffixIcon={<FaCaretDown />}
            onChange={handleChangeUpdateInterval}
            disabled={updateMode === "reactive"}
          >
            <Select.Option value={3000}>3s</Select.Option>
            <Select.Option value={5000}>5s</Select.Option>
            <Select.Option value={10000}>10s</Select.Option>
            <Select.Option value={20000}>20s</Select.Option>
            <Select.Option value={30000}>30s</Select.Option>
            <Select.Option value={60000}>60s</Select.Option>
          </Select>

          {/* <Select.Option value=""></Select.Option>
            <Select.Option value={3000}>3s</Select.Option>
            <Select.Option value={5000}>5s</Select.Option>
            <Select.Option value={10000}>10s</Select.Option>
            <Select.Option value={20000}>20s</Select.Option>
            <Select.Option value={30000}>30s</Select.Option>
            <Select.Option value={60000}>60s</Select.Option> */}
        </main>
      </div>
    </div>
  );
};

export default UserLeftSideMenu;

// 3s, 5s, 10s, 20s, 30s, 60s

// const LogoutItem = (props: any) => {
//   if (props.isLogged) {
//     return (
//       <div
//         className="divClicavel itemMenuLateral"
//         onClick={() => props.deslogarUsuarioAction()}
//         tabIndex={0}
//       >
//         <div className="flexCenterCenter">
//           <MDBIcon icon="power-off" className="iconeDeslogar" />
//           <h6 className="textoLogout">LOGOUT</h6>
//         </div>
//         <div className="flexCenterCenter">
//           <MDBIcon
//             icon="circle"
//             className="iconeStatusCirculo iconeStatusConectado"
//           />
//           <h6 className="textoConectado">CONECTADO</h6>
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <div
//         tabIndex={0}
//         className="divClicavel itemMenuLateral"
//         onClick={() => props.deslogarUsuarioAction()}
//       >
//         <Row className="botaoDeslogar">
//           <Col className="colLogout">
//             {/* md={"0"} */}
//             <MDBIcon icon="power-off" className="iconeDeslogar" />
//           </Col>
//           <Col md={3} className="colLogout">
//             <h6>LOGIN</h6>
//           </Col>
//         </Row>
//         <Row>
//           <Col className="colLogout">
//             {/* md={"0"} */}
//             <MDBIcon
//               icon="circle"
//               className="iconeStatusCirculo iconeStatusDesconectado"
//             />
//           </Col>
//           <Col md={4} className="colLogout">
//             <h6 className="textoConectado">DESCONECTADO</h6>
//           </Col>
//         </Row>
//       </div>
//     );
//   }
// };
