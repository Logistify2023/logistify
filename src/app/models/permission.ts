export interface Permission {
  id: number,
  permission: string,
  slug: string,
  description: string,
  can_delete: boolean,
  status: string,
  classification_id: number,
  deleted_at: string,
  created_at: string,
  updated_at: string,

  classification?: any,
  roles?: any[],
  users?: any[],
}