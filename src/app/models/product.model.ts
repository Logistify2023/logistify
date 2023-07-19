import { Brand } from "./product-brand.model";
import { Category } from "./product-category.model";
import { MeasureUnit } from "./product-unit.model";

export interface Product {
  id: number,
  key: string,
  name: string,
  slug: string,
  cost_center: string,
  campaing: string,
  description: string,
  existence: number,
  long: number,
  width: number,
  high: number,
  weight: number,
  type: string,
  is_intern: string,
  status: string,
  category_id: number,
  mark_id: number,
  measure_unit_id: number,
  deleted_at: string,
  created_at: string,
  updated_at: string,

  category?: Category,
  mark?: Brand,
  measure_unit?: MeasureUnit,
  suppies?: any[],
  losses?: any[],
  locations?: any[],
  expenses?: any[],
}