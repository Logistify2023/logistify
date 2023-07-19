import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/**
 * Services for Couriers Modules
*/
export class MessengerService {

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
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
  }

  /* SERVICES */
  getServices(id = 0, in_group = false, in_zone = false, in_price = false, in_cost = false, in_service_type = false, 
              in_setting = false, in_courier_type = false, in_courier = false, in_delivery_days = false, 
              in_profile_services = false, in_service = false, in_type_price = false, in_shipments = false, 
              in_image = false, additionables = false, additionables_additional_charge = false, additional = false, 
              dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_service_type) {
      included += 'service_type,';
    } if (in_group) {
      included += 'group,';
    } if (in_zone) {
      included += 'zone,';
    } if (in_price) {
      included += 'price,';
    } if (in_cost) {
      included += 'cost,';
    } if (in_setting) {
      included += 'setting,';
    } if (in_courier_type) {
      included += 'courier_type,';
    } if (in_courier) {
      included += 'courier,';
    } if (in_delivery_days) {
      included += 'delivery_days,';
    } if (in_profile_services) {
      included += 'profile_services,';
    } if (in_service) {
      included += 'profile_services.service,';
    } if (in_type_price) {
      included += 'profile_services.type_price,';
    } if (in_shipments) {
      included += 'shipments,';
    } if (in_image) {
      included += 'image,';
    }if(additionables){
      included += 'additionables,';
    }if(additionables_additional_charge){
      included += 'additionables.additional_charge,';
    }if(additional){
      included += 'additional,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/services' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=remote,' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeServices(data: any) {
    return this.http.post(this.urlEndPoint + '/services', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateServices(data: any) {
    return this.http.put(this.urlEndPoint + '/services/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteServices(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/services/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreServices(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/services/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  /* SERVICES-CHARGE-PRICE */
  updateChargeService(id: number, data: any){
    return this.http.put(this.urlEndPoint + '/services/update-charge/' + id, data, this.httpOptions).pipe(tap(() => {},
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  /* SERVICES-FUEL */
  getServiceFuel(id = 0, in_service = false, in_fuel = false, dataDeleted = false, sort = '-updated_at'){
    let included = '';
    if (in_service) {
      included += 'service,';
    } if (in_fuel) {
      included += 'fuel,';
    } 
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/services' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  /* SERVICES-GROUP */
  serviceGroupIndex(sort = '-updated_at') {
    return this.http.get(this.urlEndPoint + '/services-group' + '?sort=' + sort, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  serviceGroupShow(id: number) {
    return this.http.get(this.urlEndPoint + '/services-group/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  serviceGroupShowGroups(id: number) {
    return this.http.get(this.urlEndPoint + '/services-group/groups/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  serviceGroupShowGroupOrigin(id: number, group: string) {
    return this.http.get(this.urlEndPoint + '/services-group/groups/origin/' + id + '/' + group, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  serviceGroupShowGroupDestin(id: number, group: string) {
    return this.http.get(this.urlEndPoint + '/services-group/groups/destin/' + id + '/' + group, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  serviceGroupStore(data: any) {
    return this.http.post(this.urlEndPoint + '/services-group', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* QUOTE INSURANSE */
  storeQuoteInsurance(data: any) {
    return this.http.post(this.urlEndPoint + '/couriers/insurance-quote', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  /* SERVICES-FUEL-UPDATE */
  updateServiceFuel(data: any) {
    return this.http.put(this.urlEndPoint + '/services-fuel/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* ZONES */
  importServicesZones(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/service/zones/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  exportServicesZones(_id: number) {
    return this.http.get(this.urlEndPoint + '/export/data/service/zones/' + _id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  /* REMOTES */
  importServicesZonesRemotes(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/service/zones_remotes/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  /* GROUPS */
  importServicesGroups(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/service/groups/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  exportServicesGroups(_id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'application/octet-stream',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.get(this.urlEndPoint + '/export/service/groups/' + _id, { observe: 'response', responseType: 'blob' as 'json' });
  }
  importServicesGroupsSepared(data: any, id: number, group: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    let optionGroup = ''
    if(group == 'GroupsOrigin'){
      optionGroup = '/group_origin/'
    }else if(group == 'GroupsDestin'){
      optionGroup = '/group_destin/'
    }
    return this.http.post(this.urlEndPoint + '/import/service' + optionGroup + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* PRICES */
  importServicesPrices(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/service/prices/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  importServicePrice(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/profile_service/prices/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  exportServicesPrices(_id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'application/octet-stream',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.get(this.urlEndPoint + '/export/service/prices/' + _id, { observe: 'response', responseType: 'blob' });
  }

  /* COSTS */
  importServicesCosts(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/service/costs/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  exportServicesCosts(_id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'application/octet-stream',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.get(this.urlEndPoint + '/export/service/costs/' + _id, { observe: 'response', responseType: 'blob' });
  }

  /* COURIERS */
  getCouriers(id = 0, in_setting = false, in_group = false, in_zone = false, in_remote = false, in_price = false, in_cost = false, in_web_services = false, in_courier_types = false, in_services = false, 
    in_image = false, in_branchsables = false, in_branch_office = false, in_branch_office_type = false, in_chargessables = false, in_additional_charge = false, in_additional_charge_type = false, 
    additional_days = false, additionables = false, additionables_charge = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_setting) {
      included += 'setting,';
    } if (in_group) {
      included += 'group,';
    } if (in_zone) {
      included += 'zone,';
    } if (in_remote) {
      included += 'remote,';
    } if (in_price) {
      included += 'price,';
    } if (in_cost) {
      included += 'cost,';
    } if (in_web_services) {
      included += 'web_services,';
    } if (in_courier_types) {
      included += 'courier_types,';
    } if (in_services) {
      included += 'services,';
    } if (in_image) {
      included += 'image,';
    } if (in_branchsables) {
      included += 'branchsables,';
    } if (in_branch_office) {
      included += 'branchsables.branch_office,';
    } if (in_branch_office_type) {
      included += 'branchsables.branch_office.branch_office_type,';
    } if (in_chargessables) {
      included += 'chargessables,';
    } if (in_additional_charge) {
      included += 'chargessables.additional_charge,';
    } if (in_additional_charge_type) {
      included += 'chargessables.additional_charge.additional_charge_type,';
    }if(additional_days){
      included += 'additional,';
    }if(additionables){
      included += 'additionables,';
    }if(additionables_charge){
      included += 'additionables.additional_charge,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/couriers' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  getCouriersImage(dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/couriers/image' + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  
  storeCouriers(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/couriers', data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {

          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateCouriers(id: string, data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/couriers/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteCouriers(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/couriers/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreCouriers(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/couriers/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* ZONES */
  importCouriersZones(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/courier/zones/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      }));
  }
  exportCouriersZones(_id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'application/octet-stream',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.get(this.urlEndPoint + '/export/courier/zones/' + _id, { observe: 'response', responseType: 'blob' });
  }
  /* REMOTES */
  importCouriersZonesRemotes(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/courier/zones_remotes/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  /* GROUPS */
  importCouriersGroups(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/courier/groups/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  exportCouriersGroups(_id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'application/octet-stream',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.get(this.urlEndPoint + '/export/courier/groups/' + _id, { observe: 'response', responseType: 'blob' as 'json' });
  }

  /* PRICES */
  importCouriersPrices(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/courier/prices/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  exportCouriersPrices(_id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'application/octet-stream',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.get(this.urlEndPoint + '/export/courier/prices/' + _id, { observe: 'response', responseType: 'blob' });
  }

  /* COSTS */
  importCouriersCosts(data: any, id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/courier/costs/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  exportCouriersCosts(_id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'application/octet-stream',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.get(this.urlEndPoint + '/export/courier/costs/' + _id, { observe: 'response', responseType: 'blob' });
  }

  /* ADDITIONAL */
  importAdditionaldays(id: number, data: any){
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/import/courier/additionals/' + id, data, httpOptions).pipe(tap(() =>{},
      (err: any) => {
        if(err.status === 401){
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* COURIERS TYPES */
  getCouriersTypes(id = 0, in_couriers = false, in_services = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_couriers) {
      included += 'couriers,';
    } if (in_services) {
      included += 'services,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/courier-types' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeCouriersTypes(data: any) {
    return this.http.post(this.urlEndPoint + '/courier-types', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateCouriersTypes(data: any) {
    return this.http.put(this.urlEndPoint + '/courier-types/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteCouriersTypes(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/courier-types/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreCouriersTypes(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/courier-types/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* SERVICE TYPES */
  getServiceTypes(id = 0, in_services = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_services) {
      included += 'services,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/service-types' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeServiceTypes(data: any) {
    return this.http.post(this.urlEndPoint + '/service-types', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateServiceTypes(data: any) {
    return this.http.put(this.urlEndPoint + '/service-types/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteServiceTypes(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/service-types/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreServiceTypes(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/service-types/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* DELIVERY DAYS */
  getDeliveryDays(id = 0, in_services = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_services) {
      included += 'services,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/delivery-days' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeDeliveryDays(data: any) {
    return this.http.post(this.urlEndPoint + '/delivery-days', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateDeliveryDays(data: any) {
    return this.http.put(this.urlEndPoint + '/delivery-days/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteDeliveryDays(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/delivery-days/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreDeliveryDays(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/delivery-days/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* ADDITIONAL CHARGE TYPES */
  getAdditionalChargeTypes(id = 0, in_additional_charges = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_additional_charges) {
      included += 'additional_charges,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/additional-charge-types' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeAdditionalChargeTypes(data: any) {
    return this.http.post(this.urlEndPoint + '/additional-charge-types', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateAdditionalChargeTypes(data: any) {
    return this.http.put(this.urlEndPoint + '/additional-charge-types/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteAdditionalChargeTypes(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/additional-charge-types/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreAdditionalChargeTypes(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/additional-charge-types/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* ADDITIONAL CHARGES */
  getAdditionalCharge(id = 0, in_additional_charge_type = false, in_additionables = false, in_couriers = false, in_customers = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_additional_charge_type) {
      included += 'additional_charge_type,';
    }
    if (in_additionables) {
      included += 'additionables,';
    }
    if (in_couriers) {
      included += 'services,';
    }
    if (in_customers) {
      included += 'customers,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/additional-charges' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeAdditionalCharge(data: any) {
    return this.http.post(this.urlEndPoint + '/additional-charges', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateAdditionalCharge(data: any) {
    return this.http.put(this.urlEndPoint + '/additional-charges/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteAdditionalCharge(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/additional-charges/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreAdditionalCharge(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/additional-charges/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* WEB SERVICES */
  getWebServices(id = 0, in_couriers = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_couriers) {
      included += 'courier,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/web-services' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeWebServices(data: any) {
    return this.http.post(this.urlEndPoint + '/web-services', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateWebServices(data: any) {
    return this.http.put(this.urlEndPoint + '/web-services/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteWebServices(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/web-services/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreWebServices(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/web-services/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* TYPE PRICES */
  getTypePrices(id = 0, in_services = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_services) {
      included += 'profile_services,profile_services.service,profile_services.profile,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/type-prices' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeTypePrices(data: any) {
    return this.http.post(this.urlEndPoint + '/type-prices', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateTypePrices(data: any) {
    return this.http.put(this.urlEndPoint + '/type-prices/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteTypePrices(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/type-prices/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreTypePrices(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/type-prices/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* PROFILE SEVICE */
  getProfilesServices(id = 0, customers = false, profile_services = false, profile_services_type_price = false, profile_services_service = false, profile_services_price = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (customers) {
      included += 'customers,';
    }
    if (profile_services) {
      included += 'profile_services,';
    }
    if (profile_services_type_price) {
      included += 'profile_services.type_price,';
    }
    if (profile_services_service) {
      included += 'profile_services.service,';
    }
    if (profile_services_price) {
      included += 'profile_services.price,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/profiles-services' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeProfilesServices(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/profiles-services', data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {

          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateProfilesServices(id: number, data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/profiles-services/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteProfilesServices(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/profiles-services/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreProfilesServices(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/profiles-services/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  addProduct(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/profiles-services/add-product', data, httpOptions).pipe(tap(() => {},
      (err: any) => {
        if(err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateTypePrice(id: number, data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.post(this.urlEndPoint + '/profiles-services/update-product/' + id, data, httpOptions).pipe(tap(() => {},
      (err: any) => {
        if(err.status == 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteProductProfile(id: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      })
    };
    return this.http.delete(this.urlEndPoint + '/profiles-services/delete-product/' + id, httpOptions).pipe(tap(() => {},
      (err: any) => {
        if(err.status == 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
}