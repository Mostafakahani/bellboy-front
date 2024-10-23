export type CellTypeEnum = "text" | "text-bold" | "status" | "button" | "modal" | "link";
export type CellData =
  | string // برای text و text-bold
  | boolean // برای status
  | {
      onClick: () => void;
      label: string;
    } // برای button
  | {
      label: string;
    } // برای modal
  | {
      href: string;
      label: string;
    };
export interface BaseCellConfig {
  type: CellTypeEnum;
}

export interface TextCellConfig extends BaseCellConfig {
  type: "text" | "text-bold";
}

export interface StatusCellConfig extends BaseCellConfig {
  type: "status";
  trueText?: string;
  falseText?: string;
}

export interface ButtonCellConfig extends BaseCellConfig {
  type: "button";
  label: string;
}

export interface ModalCellConfig extends BaseCellConfig {
  type: "modal";
  label: string;
}

export interface LinkCellConfig extends BaseCellConfig {
  type: "link";
  label: string;
}

export type CellConfig =
  | TextCellConfig
  | StatusCellConfig
  | ButtonCellConfig
  | ModalCellConfig
  | LinkCellConfig;

export interface Column {
  header: string;
  key: string;
  cellType: CellTypeEnum;
  sortable?: boolean;
}

export interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  className?: string;
  onSort?: (key: string, direction: "asc" | "desc") => void;
}
