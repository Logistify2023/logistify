import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { tap } from 'rxjs/operators';
import { AuthGuard } from './auth.guard';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})

/**
 * Services for Cutomers Modules
*/
export class CustomerService {
  
  // Definimos las variables globales
  urlEndPoint: String = GlobalConstants.apiURL;
  httpOptions = {};

  constructor(
    private http: HttpClient,
    private auth: AuthGuard
  ) {
    // Validamos que exista un token en la cache
    if (!localStorage.getItem('token')) {
      this.auth.closeLocalSession();
    }
    // Definimos nuestro header para usar en nuestras peticiones
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString()
      })
    };
  }

  // AREAS
  getAreas(in_users = false, in_responsable = false, in_members = false, dataDeleted = false): any {
    let included = '';
    if (in_users) {
      included += 'users,';
    }
    if (in_responsable) {
      included += 'responsable,';
    }
    if (in_members) {
      included += 'members,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/areas?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getAreasByID(_id: number, in_users = false, in_responsable = false, in_members = false, dataDeleted = false): any {
    let included = '';
    if (in_users) {
      included += 'users,';
    }
    if (in_responsable) {
      included += 'responsable,';
    }
    if (in_members) {
      included += 'members,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/areas/' + _id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // CUSTOMERS
  getClients(id: number = 0, in_profile = false, in_turn = false, in_customer_type = false, in_credit_card = false, in_credit_card_normal = false, in_users = false,
    in_account = false, is_assigned = false, is_customer = false, in_products = false, in_shipments = false, in_address = false, in_branchsables = false, in_contactsables = false, 
    in_contactsables_address= false, in_customerType = false, additionables = false, additionables_charge = false, dataDeleted = false):  Observable<ApiResponse> {
    let included = '';
    if (in_profile) {
      included += 'profile,';
    } if (in_turn) {
      included += 'turn,';
    } if (in_customer_type) {
      included += 'customer_type,';
    } if (in_credit_card) {
      included += 'creditCards,creditCardDefault,creditCardNormal,credit_cards,credit_card_default,';
    } if (in_credit_card_normal) {
      included += 'credit_card_normal,';
    } if (in_users) {
      included += 'users,';
    } if (in_account) {
      included += 'your_account,your_account.account,';
    } if (is_assigned) {
      included += 'is_assigned,';
    } if (is_customer) {
      included += 'is_customer,';
    } if (in_products) {
      included += 'products,';
    } if (in_shipments) {
      included += 'shipments,';
    } if (in_address) {
      included += 'addressables.address,';
    } if (in_branchsables) {
      included += 'branchsables,branchsables.branch_office,branchsables.branch_office.branch_office_type,';
    } if (in_contactsables) {
      included += 'contactsables.contact,contactsables,';
    } if (in_contactsables_address) {
      included += 'contactsables.contact.addressables.address,';
    } if (in_customerType) {
      included += 'customerType,';
    } if(additionables){
      included += 'additionables,';
    }if(additionables_charge){
      included += 'additionables.additional_charge,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let _id = '';
    if (id != 0) {
      _id = '/' + id;
    }
    return this.http.get<ApiResponse>(this.urlEndPoint + _delete + '/customers' + _id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeCustomer(data: any) {
    return this.http.post(this.urlEndPoint + '/customers', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateCustomer(data: any) {
    return this.http.put(this.urlEndPoint + '/customers/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateChargeCustomer(id: number, data: any){
    return this.http.put(this.urlEndPoint + '/customers/update-charge/' + id, data, this.httpOptions).pipe(tap(() => {},
      (err: any) => {
        if(err.status === 401){
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteCustomers(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/customers/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreCustomers(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/customers/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      }));
  }
  importAddressCustomer(id: number, data: any){
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString()
      })
    };
    return this.http.post(this.urlEndPoint + '/import/customer/address/' + id, data, httpOptions).pipe(tap(() =>{},
      (err: any) => {
        if(err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getInfoCustomer(id: number): any {
    return this.http.get(this.urlEndPoint + '/customers/' + id + '?included=profile.profile_services.service,products,contactsables.contact.addressables.address', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Charges Additionals
  storeChargeService(data: any) {
    return this.http.post(this.urlEndPoint + '/customers/charge', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  showChargeService(id: any) {
    return this.http.get(this.urlEndPoint + '/customers/charge/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateChargeService(id: number, data: any){
    return this.http.put(this.urlEndPoint + '/customers/charge/' + id, data, this.httpOptions).pipe(tap(() => {},
      (err: any) => {
        if(err.status === 401){
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteChargeService(id: any) {
    return this.http.delete(this.urlEndPoint + '/customers/charge/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* PROFILES */
  getClient(id: number): any {
    return this.http.get(this.urlEndPoint + '/profiles/' + id + '?sort=-updated_at&included=customers.your_account,profile_services.service', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getClientsProfiles(_id: number = 0, in_accounts = false, in_services = false, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let included = '';
    if (in_services) {
      included += 'profile_services.type_price,';
    }
    if (in_accounts) {
      included += 'customers.your_account,';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get(this.urlEndPoint + _delete + '/profiles' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeClientProfile(data: any) {
    return this.http.post(this.urlEndPoint + '/profiles', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateClientProfile(data: any) {
    return this.http.put(this.urlEndPoint + '/profiles/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteClientProfile(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/profiles/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreClientProfile(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/profiles/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* CUSTOMER TYPES */
  getClientsTypes(_id: number = 0, in_customers = false, in_accounts = false, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let included = '';
    if (in_customers) {
      included += 'customers,';
    }
    if (in_accounts) {
      included += 'customers.your_account,';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get(this.urlEndPoint + _delete + '/customer-types' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeClientsTypes(data: any) {
    return this.http.post(this.urlEndPoint + '/customer-types', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateClientsTypes(data: any) {
    return this.http.put(this.urlEndPoint + '/customer-types/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteClientsTypes(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/customer-types/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreClientsTypes(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/customer-types/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* TURNS */
  getTurns(_id: number = 0, in_customers = false, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let included = '';
    if (in_customers) {
      included += 'customers.your_account,';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get(this.urlEndPoint + _delete + '/turns' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeTurn(data: any) {
    return this.http.post(this.urlEndPoint + '/turns', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateTurn(data: any) {
    return this.http.put(this.urlEndPoint + '/turns/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteTurns(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/turns/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreTurns(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/turns/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* CONTACTS */
  getContacts(_id: number = 0, in_contactsables = false, in_customers = false, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let included = '';
    if (in_contactsables) {
      included += 'contactsables,';
    }
    if (in_customers) {
      included += 'customers,';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get(this.urlEndPoint + _delete + '/contacts' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeContact(data: any) {
    return this.http.post(this.urlEndPoint + '/contacts', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateContact(data: any) {
    return this.http.put(this.urlEndPoint + '/contacts/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteContact(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/contacts/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreContact(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/contacts/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* BRANCH OFFICES */
  getBrandOffices(_id: number, in_branchsables = false, in_branch_office_type = false, in_address = false, in_customers = false, dataDeleted = false): any {
    let included = '';
    if (in_branchsables) {
      included += 'branchsables,';
    }
    if (in_branch_office_type) {
      included += 'branch_office_type,';
    }
    if (in_address) {
      included += 'addressables,addressables.address,';
    }
    if (in_customers) {
      included += 'customers,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get(this.urlEndPoint + _delete + '/branch-offices' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeBrandOffice(data: any) {
    return this.http.post(this.urlEndPoint + '/branch-offices', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateBrandOffice(data: any) {
    return this.http.put(this.urlEndPoint + '/branch-offices/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteBrandOffice(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/branch-offices/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreBrandOffice(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/branch-offices/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* BRANCH OFFICES TYPES */
  getBrandOfficeType(_id: number = 0, in_branch_offices = false, dataDeleted = false): any {
    let included = '';
    if (in_branch_offices) {
      included += 'branch_offices,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get(this.urlEndPoint + _delete + '/branch-office-types' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeBrandOfficeType(data: any) {
    return this.http.post(this.urlEndPoint + '/branch-office-types', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateBrandOfficeType(data: any) {
    return this.http.put(this.urlEndPoint + '/branch-office-types/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteBrandOfficeType(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/branch-office-types/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreBrandOfficeType(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/branch-office-types/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* COST CENTER */
  getCostsCenter(_id: number = 0, in_customers = false, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let included = '';
    if (in_customers) {
      included += 'customers.your_account,';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get(this.urlEndPoint + _delete + '/costs-center' + id + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeCostsCenter(data: any) {
    return this.http.post(this.urlEndPoint + '/costs-center', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateCostsCenter(data: any) {
    return this.http.put(this.urlEndPoint + '/costs-center/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteCostsCenter(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/costs-center/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreCostsCenter(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/costs-center/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  // VALIDATE RFC
  validateRFC(rfc: string) {
    return this.http.get(this.urlEndPoint + '/customers?filter[rfc]=' + rfc, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  // GET EXECUTIVES
  getExecutives() {
    return this.http.get(this.urlEndPoint + '/roles?included=users,permissions&sort=-updated_at&filter[is_user]=1&filter[to_assign_customers]=YES', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
}