import { DataGridColum } from "./data-grid-colum.model";
import { DataGridRow } from "./data-grid-row.model";

export interface DataGridModel {
  colums: DataGridColum[],
  rows: DataGridRow[],
  rowsPerPage?: number,
}