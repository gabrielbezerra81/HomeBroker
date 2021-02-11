import React, { useCallback, useMemo, useState } from "react";
import { Row, Col, Form, InputGroup, Spinner } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import CustomInput from "shared/componentes/CustomInput";
import { BoletaNamespace } from "constants/ActionTypes";
import useStateBoletas from "hooks/useStateBoletas";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import {
  mudarAtivoAction,
  mudarQtdAction,
} from "../duck/actions/boletaActions";
import { pesquisarAtivoOnEnterAction } from "../duck/actions/boletasAPIActions";
import { mostrarErroQtdeOnBlurAction } from "../duck/actions/bookOfertaActions";

interface Props {
  namespace: BoletaNamespace;
}

const BoletaSymbolQttyRow: React.FC<Props> = ({ namespace }) => {
  const dispatch = useDispatchBoletas();

  const { dadosPesquisa, qtde } = useStateBoletas()[namespace];

  const handleQttyChange = useCallback(
    (value) => {
      dispatch(mudarQtdAction(value, namespace));
    },
    [dispatch, namespace],
  );

  const tipoInputQtde = useMemo(() => {
    if (dadosPesquisa.stepQtde === 0.01) {
      return "preco";
    }

    return "quantidade";
  }, [dadosPesquisa.stepQtde]);

  const validationProps = useMemo(() => {
    return {
      dispatch,
      dadosPesquisa,
      qtde,
    };
  }, [dadosPesquisa, dispatch, qtde]);

  return (
    <Row>
      <Col md={2} className="colLabelInput">
        <h6 className="labelInput-verticalAlign">Ativo</h6>
      </Col>
      <Col className="formAtivo colTextInput">
        <InputPesquisa namespace={namespace} />
      </Col>

      <Col className="colTextInput">
        <Form.Group>
          <Form.Label>Qtde</Form.Label>
          <CustomInput
            type={tipoInputQtde}
            step={dadosPesquisa.stepQtde}
            value={qtde}
            onChange={handleQttyChange}
            name="qtde"
            onBlur={() => validacaoQtde(validationProps)}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default BoletaSymbolQttyRow;

interface ValidationProps {
  qtde: any;
  dadosPesquisa: { stepQtde: number };
  dispatch: any;
}

const validacaoQtde = ({ qtde, dadosPesquisa, dispatch }: ValidationProps) => {
  let erro = "";
  if (Number(qtde) % 100 !== 0) {
    erro = "Quantidade deve ser múltiplo de 100";
  }
  if (dadosPesquisa && dadosPesquisa.stepQtde === 100) {
    dispatch(mostrarErroQtdeOnBlurAction(erro));
    return true;
  }

  return false;
};

interface SearchInputProps {
  namespace: BoletaNamespace;
}

const InputPesquisa: React.FC<SearchInputProps> = ({ namespace }) => {
  const boletaState = useStateBoletas()[namespace];

  const dispatch = useDispatchBoletas();

  const { ativo } = boletaState;

  const [searchingAPI, setSearchingAPI] = useState(false);

  const handleSymbolChange = useCallback(
    (event) => {
      dispatch(mudarAtivoAction(event, namespace));
    },
    [dispatch, namespace],
  );

  const handleSearchSymbol = useCallback(async () => {
    setSearchingAPI(true);

    await dispatch(pesquisarAtivoOnEnterAction(namespace));

    setSearchingAPI(false);
  }, [dispatch, namespace]);

  return (
    <InputGroup>
      <Form.Control
        className="textInput"
        type="text"
        placeholder=""
        name="ativo"
        value={ativo}
        onChange={handleSymbolChange}
        onKeyPress={(event: any) => {
          //event.preventDefault();
          if (event.key === "Enter") {
            handleSearchSymbol();
          }
        }}
      />
      <InputGroup.Append>
        <span
          className="appendedSearchIcon divClicavel iconePesquisarBoletas"
          onClick={handleSearchSymbol}
        >
          {searchingAPI ? (
            <Spinner
              className="spinnerBoleta"
              animation="border"
              variant="light"
              size="sm"
            />
          ) : (
            <MDBIcon icon="search" />
          )}
        </span>
      </InputGroup.Append>
    </InputGroup>
  );
};
