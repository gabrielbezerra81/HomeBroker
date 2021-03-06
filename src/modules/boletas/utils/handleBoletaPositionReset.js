// Para boletas que são classes
export function shouldResetBoletaPositionForClass(popupReference) {
  const { shouldResetPosition } = popupReference.state;

  const {
    appProps: { show },
    name,
  } = popupReference.props;

  const boletaVisibility = show[0][name];

  if (!boletaVisibility && !shouldResetPosition) {
    popupReference.setState({ shouldResetPosition: true });
  }

  if (boletaVisibility && shouldResetPosition) {
    popupReference.setState({ shouldResetPosition: false });
  }
}

// Para boletas que são componentes funcionais
export function shouldResetBoletaPositionForFC(popupReference) {}
