import { Permission } from "./permission"
import { User } from "./user.model"

export interface Role {
  id: number,
  rol: string,
  slug: string,
  description: string,
  full_access: string,
  to_assign_customers: string,
  is_user: boolean,
  can_delete: boolean,
  status: string,
  deleted_at: string,
  created_at: string,
  updated_at: string,

  permissions?: Permission[],
  users?: User[],
}