import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, Row, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { mudarInputHeaderAction } from "components/redux/actions/bookOfertaActions";
import { listarBookOfertaOnEnterAction } from "components/redux/actions/api_actions/bookOfertaAPIActions";

export const ModalHeader = ({
  headerTitle,
  headerClass,
  resetPosition,
  name,
  handleShow,
  ativo,
  close,
  eventSourceCotacao,
}) => (
  <div className={`${headerClass} handle mheader`}>
    <h6 className="mtitle">{headerTitle}</h6>
    <div className="wrapperIconesHeader">
      <Button
        variant="link"
        className="iconesHeader"
        onClick={(event) => {
          event.stopPropagation();
          handleShow(event, ativo);
        }}
        data-name="book"
      >
        <MDBIcon icon="book" size="2x" data-name="book" />
      </Button>

      <Button variant="link" className="iconesHeader">
        <MDBIcon icon="cog" size="2x" />
      </Button>

      <Button
        variant="link"
        className="iconesHeader"
        onClick={() => {
          resetPosition();
          close();
          if (eventSourceCotacao) eventSourceCotacao.close();
        }}
      >
        <span className="fa-stack">
          <MDBIcon icon="circle" className="fa-stack-2x" />
          <MDBIcon
            icon="times"
            className="fa-stack-1x iconeFechar"
            name={name}
          />
        </span>
      </Button>
    </div>
  </div>
);

export const BookHeader = ({ headerClass, resetPosition, close }) => {
  const state = useSelector((state) => state.bookOfertaReducer);
  const { inputHeader, eventSource } = state;
  const dispatch = useDispatch();

  return (
    <div className={`${headerClass} handle mheader`}>
      <Row>
        <Col md={10} className="colInputHeader">
          <Form.Control
            type="text"
            placeholder=""
            className="inputHeader"
            value={inputHeader}
            onChange={(event) =>
              dispatch(mudarInputHeaderAction(event.target.value))
            }
            onKeyPress={(event) => {
              //event.preventDefault();
              if (event.key === "Enter")
                dispatch(
                  listarBookOfertaOnEnterAction(event.target.value, eventSource)
                );
            }}
          />
        </Col>
        <Col md={2} className="wrapperIconesHeader">
          <Button
            variant="link"
            className="iconesHeader"
            onClick={() => {
              close();
              resetPosition();
              if (eventSource) eventSource.close();
            }}
          >
            <span className="fa-stack hoverIconeFechar">
              <MDBIcon icon="circle" className="fa-stack-2x" />
              <MDBIcon
                icon="times"
                className="fa-stack-1x iconeFechar"
                name="book"
              />
            </span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export const ModalHeaderSemBook = ({
  headerTitle,
  headerClass,
  name,
  close,
}) => {
  return (
    <div className={`${headerClass} handle mheader`}>
      <h6 className="mtitle">{headerTitle}</h6>
      <div className="wrapperIconesHeader">
        {/* {headerTitle === "HISTÓRICO DE OPERAÇÕES" ? (
          <Button variant="link" className="iconesHeader">
            <MDBIcon icon="cog" size="2x"></MDBIcon>
          </Button>
        ) : null} */}
        <Button variant="link" className="iconesHeader">
          <MDBIcon icon="cog" size="2x" />
        </Button>

        <Button variant="link" className="iconesHeader" onClick={close}>
          <span className="fa-stack hoverIconeFechar iconesHeader">
            <MDBIcon icon="circle" className="fa-stack-2x" />
            <MDBIcon
              icon="times"
              className="fa-stack-1x iconeFechar"
              name={name}
            />
          </span>
        </Button>
      </div>
    </div>
  );
};

export const ModalHeaderLimpo = ({ funcaoFechar, titulo, name }) => (
  <div className="border-green mheader">
    <h6 className="mtitle">{titulo}</h6>
    <div className="wrapperIconesHeader">
      <Button
        variant="link"
        className="iconesHeader"
        onClick={(event) => funcaoFechar(event)}
        name={name}
      >
        <span className="fa-stack">
          <MDBIcon icon="circle" className="fa-stack-2x" />
          <MDBIcon
            icon="times"
            className="fa-stack-1x iconeFechar"
            name={name}
          />
        </span>
      </Button>
    </div>
  </div>
);
