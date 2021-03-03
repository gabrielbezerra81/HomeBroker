export default function loadPopupPosition(id: string) {
  const position = localStorage.getItem(`@homebroker:${id}Position`);

  if (position) {
    const parsedPosition = JSON.parse(position) as { x: number; y: number };

    return parsedPosition;
  }

  return { x: 0, y: 0 };
}
