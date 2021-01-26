export interface MultiBoxData {
  id: string;
  activeTab: "1" | "2" | "3" | "4" | "5";
  minimized: boolean;
}

export default interface MultiBoxState {
  boxes: Array<MultiBoxData>;
}
