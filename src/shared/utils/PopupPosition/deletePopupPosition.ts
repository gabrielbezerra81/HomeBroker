export default function deletePopupPosition(id: string) {
  localStorage.removeItem(`@homebroker:${id}Position`);
}
