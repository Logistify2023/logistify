import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/**
 * Services for Shipments Moduls
*/
export class ShipmentsService {

  // Definimos las variables globales
  urlEndPoint: String = GlobalConstants.apiURL;
  httpOptions = {};

  constructor(
    private http: HttpClient,
    private auth: AuthGuard,
  ) {
    // Validamos que exista un token en la cache
    if (!localStorage.getItem('token')) {
      this.auth.closeLocalSession();
    }
    // Definimos nuestro header para usar en nuestras peticiones
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
        'Content-Type': 'application/json',
      })
    };
  }

  /* CLAIMS */
  getClaims(id = 0, in_shipments = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_shipments) {
      included += 'shipments,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/claims' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeClaims(data: any) {
    return this.http.post(this.urlEndPoint + '/claims', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateClaims(data: any) {
    return this.http.put(this.urlEndPoint + '/claims/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteClaims(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/claims/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreClaims(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/claims/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* INCIDENCES TYPES */
  getIncidencestypes(id = 0, in_incidences = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_incidences) {
      included += 'incidences,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/incidences-types' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeIncidencestypes(data: any) {
    return this.http.post(this.urlEndPoint + '/incidences-types', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateIncidencestypes(data: any) {
    return this.http.put(this.urlEndPoint + '/incidences-types/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteIncidencestypes(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/incidences-types/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreIncidencestypes(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/incidences-types/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* INCIDENCES */
  getIncidences(id = 0, in_incidence_type = false, in_shipments = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_incidence_type) {
      included += 'incidence_type,';
    }
    if (in_shipments) {
      included += 'shipments,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/incidences' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeIncidences(data: any) {
    return this.http.post(this.urlEndPoint + '/incidences', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateIncidences(data: any) {
    return this.http.put(this.urlEndPoint + '/incidences/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteIncidences(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/incidences/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreIncidences(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/incidences/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* EVENTS */
  getEvents(id = 0, in_shipments = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_shipments) {
      included += 'shipments,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/events' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeEvents(data: any) {
    return this.http.post(this.urlEndPoint + '/events', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateEvents(data: any) {
    return this.http.put(this.urlEndPoint + '/events/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteEvents(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/events/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreEvents(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/events/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* DELIVERY TIMES */
  getDeliveryTimes(id = 0, in_shipments = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_shipments) {
      included += 'shipments,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/delivery-times' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeDeliveryTimes(data: any) {
    return this.http.post(this.urlEndPoint + '/delivery-times', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateDeliveryTimes(data: any) {
    return this.http.put(this.urlEndPoint + '/delivery-times/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteDeliveryTimes(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/delivery-times/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreDeliveryTimes(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/delivery-times/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* RECEIVERS */
  getReceivers(id = 0, in_shipments = false, in_addressables = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_shipments) {
      included += 'shipments,';
    }
    if (in_addressables) {
      included += 'addressables,addressables.address,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/receivers' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeReceivers(data: any) {
    return this.http.post(this.urlEndPoint + '/receivers', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateReceivers(data: any) {
    return this.http.put(this.urlEndPoint + '/receivers/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteReceivers(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/receivers/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreReceivers(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/receivers/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* STATUSES */
  getStatus(id = 0, in_shipments = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_shipments) {
      included += 'shipments,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/status' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeStatus(data: any) {
    return this.http.post(this.urlEndPoint + '/status', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateStatus(data: any) {
    return this.http.put(this.urlEndPoint + '/status/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteStatus(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/status/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreStatus(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/status/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* QUOTES */
  getQuote(id = 0, in_user = false, in_customer = false, in_service = false, in_products = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_user) {
      included += 'user,';
    } if (in_customer) {
      included += 'customer,';
    } if (in_service) {
      included += 'service,service.courier,';
    } if (in_products) {
      included += 'products,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/quotes' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getMeQuotes(id = 0, in_user = false, in_customer = false, in_service = false, in_products = false, dataDeleted = false, sort = '-updated_at'): any {
    let included = '';
    if (in_user) {
      included += 'user,';
    } if (in_customer) {
      included += 'customer,';
    } if (in_service) {
      included += 'service,service.courier,';
    } if (in_products) {
      included += 'products,';
    }
    return this.http.get(this.urlEndPoint + '/me-quotes' + '?sort=' + sort + '&perPage=10&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeQuote(data: any) {
    return this.http.post(this.urlEndPoint + '/quotes', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateQuote(data: any) {
    return this.http.put(this.urlEndPoint + '/quotes/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteQuote(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/quotes/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreQuote(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/quotes/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /** QUOTES-MASSIVES */
  getMeQuotesMassive(in_user = false, in_customer = false){
    let included = '';
    if (in_user) {
      included += 'user,';
    } if (in_customer) {
      included += 'customer,';
    }
    return this.http.get(this.urlEndPoint + '/me-quotes-massives' + '?included=' + included, this.httpOptions).pipe(tap(() => {},
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  showMeQuoteMassive(id: number){
    return this.http.get(this.urlEndPoint + '/me-quotes-massives/' + id, this.httpOptions).pipe(tap(() =>{},
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeQuoteMassive(data: any){
    return this.http.post(this.urlEndPoint + '/quotes-massives', data, this.httpOptions).pipe(tap(() => {},
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteQuoteMassive(id: any, dataDeleted = false){
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/quotes-massives/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // aún no funciona
  exportFileMassiveQuote(id: any, packages: number, envelopes: number, multi: number){
    console.log(id);
    const httpOptions = { 
      headers: new HttpHeaders({ 
        // 'Content-Type': 'aapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Type': 'application/json',
        'Accept'      : 'application/octet-stream',
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString()
      }) 
    }; 
    let url = 
      '/export/massive-quote?'+
      'customer_id='+id+
      '&num_packages='+packages+
      '&num_envelopes='+envelopes+
      '&multipieza='+multi
    return  this.http.get(this.urlEndPoint + url, { responseType: 'blob' as 'json' }).pipe(tap(()=>{},
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Pasamos la data a importar
  importQuoteMassive(id: number, data: any){
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString()
      })
    };
    return this.http.post(this.urlEndPoint + '/import/massive-quote/' + id, data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
}