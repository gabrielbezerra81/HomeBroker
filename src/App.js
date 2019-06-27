import React from "react";
import "./css/App.css";
import { Button } from "react-bootstrap";
import BookOfertas from "././components/forms/BookOfertas"
class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="primary" onClick={this.handleShow}>
            Abrir form
          </Button>
          <BookOfertas
            show={this.state.show}
            close={this.handleClose}
          />
        </header>
      </div>
    );
  }
}
export default App;
