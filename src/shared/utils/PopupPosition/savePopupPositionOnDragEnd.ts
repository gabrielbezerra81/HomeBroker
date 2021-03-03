interface Props {
  id: string;
  position: {
    x: number;
    y: number;
  };
}

export default function savePopupPositionOnDragEnd({ id, position }: Props) {
  localStorage.setItem(`@homebroker:${id}Position`, JSON.stringify(position));
}
