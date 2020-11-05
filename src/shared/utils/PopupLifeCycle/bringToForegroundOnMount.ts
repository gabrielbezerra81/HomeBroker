interface PopupProps {
  currentDivKey: string;
  popupDivKey: string;
  currentZIndex: number;
  increaseZIndex: () => any;
}

export default function bringToForegroundOnMount({
  currentDivKey,
  popupDivKey,
  currentZIndex,
  increaseZIndex,
}: PopupProps) {
  if (currentDivKey !== "" && currentDivKey === popupDivKey) {
    const popup = document.getElementById(popupDivKey);

    if (popup) {
      popup.style.zIndex = `${currentZIndex + 1}`;

      increaseZIndex();
    }
  }
}
