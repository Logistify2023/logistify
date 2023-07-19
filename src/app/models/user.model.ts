import { Customer } from "./customers.model";
import { Image } from "./user-image.model";
import { Account } from "./account.model";
import { Area } from "./areas.model";
import { Role } from "./roles.model";
import { Stall } from "./stall.model";
import { Permission } from "./permission";

export interface User {
  id: number,
  name: string,
  lastname: string,
  surname: string,
  username: string,
  slug: string,
  email: string,
  password?: string,
  phone: string,
  email_verified_at: string,
  is_webservices: boolean,
  status: string,
  stall_id: number,
  remember_token: string,
  deleted_at: string,
  created_at: string,
  updated_at: string,

  stall?: Stall,
  account?: Account,
  image?: Image,
  roles?: Role[],
  areas?: Area[],
  customers?: Customer[],
  permissions?: Permission[],
  loggins?: any[],
}
