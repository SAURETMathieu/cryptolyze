export type InsertMethodFunctionType<T> = {
  (values: T): Promise<
    | {
        success: boolean;
        message: string;
        data: null;
      }
    | {
        success: boolean;
        message: string;
        data: any;
      }
  >;
};

export type UpdateMethodFunctionType<T> = {
  (
    values: T,
    id?: string | number
  ): Promise<
    | {
        success: boolean;
        message: string;
        data: null;
      }
    | {
        success: boolean;
        message: string;
        data: any;
      }
  >;
};
