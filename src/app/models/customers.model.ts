export interface Customer {
  id: number,
  rfc: string,
  business_name: string,
  slug: string,
  cfdi: string,
  has_products: boolean,
  is_distributor: boolean,
  expiration_date: Date,
  additional_days: number,
  by_webservice: boolean,
  type_custumer: string,
  status: string,
  profile_id: number,
  customer_type_id: number,
  turn_id: number,
  deleted_at: string,
  created_at: string,
  updated_at: string,
}