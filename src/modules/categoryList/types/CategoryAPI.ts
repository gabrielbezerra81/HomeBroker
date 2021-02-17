export interface CategoryListAPI {
  id: number;
  structure: {
    id: number;
    last?: number;
    components: Array<{
      id: number;
      stock: {
        id: number;
        symbol: string;
      };
    }>;
  };
  group: string;
  configuration: string;
}
