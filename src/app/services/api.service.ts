import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Services for API Service
*/
export class ApiService {

  // Obtenemos el path de la URL
  urlEndPoint: String = GlobalConstants.apiURL;
  // Definimos los headers
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
  };

  // Definimos en el constructor las variables a utilizar
  constructor(
    private http: HttpClient,
    private auth: AuthGuard,
  ) { }

  /**
   * URL´S PARA AUTENTICARNOS EN LA APLICACIÓN ASI COMO OBTENER LA INFORMACIÓN DEL USUARIO
   */
  signIn(data: any) {
    return this.http.post(this.urlEndPoint + '/sign-in', data);
  }
  resetPassword(data: any) {
    return this.http.post(this.urlEndPoint + '/reset-password', data);
  }
  validatePasswordToken(data: string) {
    return this.http.get(this.urlEndPoint + '/change-password-view/' + data).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      }));
  }
  changePassword(data: any, token: string) {
    return this.http.put(this.urlEndPoint + '/change-password/' + token, data);
  }

  /* User */
  getUserProfile(in_stall = false, in_account = false, in_areas = false, in_roles = false, in_customers = false, data = ""): Observable<ApiResponse> {
    let include = '';
    if (in_stall) {
      include += 'stall,';
    }
    if (in_account) {
      include += 'account,';
    }
    if (in_areas) {
      include += 'areas,areas.responsable,';
    }
    if (in_roles) {
      include += 'roles,permissions,roles.permissions,';
    }
    if (in_customers) {
      include += 'customers,';
    }
    // Get Info of me profile API
    return this.http.get<ApiResponse>(this.urlEndPoint + '/me-profile?included=image,' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  meImage(token: string) {
    return this.http.get(this.urlEndPoint + '/me-image', {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    }).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          // this.auth.closeLocalSession();
        }
      })
    );
  }
  getUserById( _id: number, in_stall = false, in_account = false, in_areas = false, in_responsable = false, in_roles = false, 
               in_permissions = false, in_customers = false, in_losses = false, in_shipments = false, in_image = false, dataDeleted = false) {
    let include = '';
    if (in_stall) {
      include += 'stall,';
    }
    if (in_account) {
      include += 'account,';
    }
    if (in_areas) {
      include += 'areas,';
    }
    if (in_responsable) {
      include += 'areas.responsable,';
    }
    if (in_permissions) {
      include += 'permissions,';
    }
    if (in_customers) {
      include += 'customers,';
    }
    if (in_losses) {
      include += 'losses,';
    }
    if (in_roles) {
      include += 'roles,';
    }
    if (in_shipments) {
      include += 'shipments,';
    }
    if (in_image) {
      include += 'image,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete  + '/users/' + _id + '?&included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  // Notifications
  getNotifications() {
    return this.http.get(this.urlEndPoint + '/notifications', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getNotificationsUnread() {
    return this.http.get(this.urlEndPoint + '/notifications-unread', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  markNotificationsRead(uid: string = "") {
    if (uid) {
      return this.http.get(this.urlEndPoint + '/read-one-notification/' + uid, this.httpOptions).pipe(tap(() => { },
        (err: any) => {
          if (err.status === 401) {
            this.auth.closeLocalSession();
          }
        })
      );
    } else {
      return this.http.get(this.urlEndPoint + '/mark-notifications-read', this.httpOptions).pipe(tap(() => { },
        (err: any) => {
          if (err.status === 401) {
            this.auth.closeLocalSession();
          }
        })
      );
    }
  }
  userShipments(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.urlEndPoint + '/me-shipments', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  userQuotes(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.urlEndPoint + '/me-quotes', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  userLosses(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.urlEndPoint + '/me-losses', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  userCustomers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.urlEndPoint + '/me-customers', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  putUser(formData: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString()
      })
    };
    return this.http.post(this.urlEndPoint + '/users', formData, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  isAutenticated() {
    return this.http.post(this.urlEndPoint + '/isAuthenticated', {}).subscribe((e: any) => {
      console.log(e);
      return e;
    });
  }
  getAuthorization() {
    return this.http.post(this.urlEndPoint + '/authorization', {});
  }

  // Colaborators
  getCollaborators(id = 0, in_roles = false, in_areas = false, in_image = false, dataDeleted = false, sort = '-updated_at') {
    let include = '';
    let deleted = '';
    if (dataDeleted) {
      deleted = '/admin';
    }
    if (in_roles) {
      include += 'roles,';
    }
    if (in_areas) {
      include += 'areas,';
    }
    if (in_image) {
      include += 'image,';
    }
    return this.http.get(this.urlEndPoint + ((dataDeleted) ? '/admin' : '') + '/users' + ((id != 0) ? '/' + id : '') + '?sort=' + sort + '&included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  // AREA
  getAreas(dataDeleted = false): Observable<ApiResponse> {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get<ApiResponse>(this.urlEndPoint + _delete + '/areas?included=users,responsable,members&sort=-updated_at', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getUserArea(): any {
    return this.http.get(this.urlEndPoint + '/areas?included=responsable,members&sort=-updated_at', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeUserArea(data: any) {
    return this.http.post(this.urlEndPoint + '/areas', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateUserArea(data: any) {
    return this.http.put(this.urlEndPoint + '/areas/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteUserArea(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/areas/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreUserArea(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/areas/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* SHIPMENTS */
  getShipments(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/shipments', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getShipmentsStatus(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + '/status', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getShipmentsClaims(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + '/claims', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getShipmentsIncidents(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + '/incidences', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getShipmentsEvents(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + '/events', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getShipmentsDeliverys(dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + '/delivery-times', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* PERMISSIONS */
  getPermissions(_id: number = 0, in_roles = false, in_users = false, in_classification = false, dataDeleted = false): Observable<ApiResponse> {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let include = '';
    if (in_roles) {
      include += 'roles,';
    }
    if (in_users) {
      include += 'users,';
    }
    if (in_classification) {
      include += 'classification,';
    }
    let id = '';
    if (_id != 0) {
      id = '/' + _id;
    }
    return this.http.get<ApiResponse>(this.urlEndPoint + _delete + '/permissions' + id + '?sort=-updated_at&included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storePermission(data: any) {
    return this.http.post(this.urlEndPoint + '/permissions', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updatePermission(data: any) {
    return this.http.put(this.urlEndPoint + '/permissions/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deletePermission(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/permissions/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restorePermission(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/permissions/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* CLASSIFICATION */
  getClassifications(in_permissions = false, dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let include = '';
    if (in_permissions) {
      include += 'permissions,';
    }
    return this.http.get(this.urlEndPoint + _delete + '/classifications?sort=-updated_at&included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getClassificationById(_id: number, in_permissions = false, dataDeleted = false): any {
    let include = '';
    if (in_permissions) {
      include += 'permissions,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/classifications/' + _id + '?included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeClassification(data: any) {
    return this.http.post(this.urlEndPoint + '/classifications', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateClassification(data: any) {
    return this.http.put(this.urlEndPoint + '/classifications/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteClassification(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/classifications/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreClassification(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/classifications/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* ROLES */
  getRoles(only_user = false, in_permissions = false, in_users = false, in_classification = false, dataDeleted = false): Observable<ApiResponse> {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let include = '';
    let users = '';
    if (only_user) {
      users = '&filter[is_user]=1'
    }
    if (in_permissions) {
      include += 'permissions,';
    }
    if (in_users) {
      include += 'users,';
    }
    if (in_classification) {
      include += 'permissions.classification,';
    }
    return this.http.get<ApiResponse>(this.urlEndPoint + _delete + '/roles?sort=-updated_at' + users + '&included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getRolById(_id: number, in_permissions = false, in_users = false, in_classification = false, dataDeleted = false): any {
    let include = '';
    if (in_permissions) {
      include += 'permissions,';
    }
    if (in_users) {
      include += 'users,';
    }
    if (in_classification) {
      include += 'permissions.classification,';
    }
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.get(this.urlEndPoint + _delete + '/roles/' + _id + '?included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeRol(data: any) {
    return this.http.post(this.urlEndPoint + '/roles', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateRol(data: any) {
    return this.http.put(this.urlEndPoint + '/roles/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteRol(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/roles/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreRol(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/roles/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  /* STALL */
  getStalls(in_users = false, dataDeleted = false): Observable<ApiResponse> {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let status = '0';
    let include = '';
    if (in_users) {
      include += 'users,';
    }
    return this.http.get<ApiResponse>(this.urlEndPoint + _delete + '/stalls?sort=-updated_at&included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  getStallById(_id: number, in_users = false, dataDeleted = false): any {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    let include = '';
    if (in_users) {
      include += 'users,';
    }
    return this.http.get(this.urlEndPoint + _delete + '/stalls/' + _id + '?included=' + include, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  storeStall(data: any) {
    return this.http.post(this.urlEndPoint + '/stalls', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  updateStall(data: any) {
    return this.http.put(this.urlEndPoint + '/stalls/' + data.id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  deleteStall(id: any, dataDeleted = false) {
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/stalls/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  restoreStall(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/stalls/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
}