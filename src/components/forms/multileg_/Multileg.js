import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import {} from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";

class Multileg extends React.Component {
  render() {
    return (
      <DraggableModal
        id="multileg"
        renderModalBody={() => modalBody(this.props)}
        renderDivFiltrarOrdens={true}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
}

const modalBody = props => <div className="bodyMultileg" />;

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(Multileg);
