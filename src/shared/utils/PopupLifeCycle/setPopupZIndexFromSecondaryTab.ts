interface PopupProps {
  previousDivkey: string;
  currentDivkey: string;
  divkeyToCheck: string;
  zIndex: number;
  popupVisibility: boolean;
  updateFunction: (...args: any) => any;
}

export default function setPopupZIndexFromSecondaryTab({
  previousDivkey,
  currentDivkey,
  divkeyToCheck,
  popupVisibility,
  zIndex,
  updateFunction,
}: PopupProps) {
  if (
    previousDivkey !== currentDivkey &&
    currentDivkey === divkeyToCheck &&
    popupVisibility
  ) {
    updateFunction(currentDivkey, zIndex, popupVisibility);
  }
}
