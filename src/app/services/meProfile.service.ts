import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

/* Export all services for me profile */
export class MeProfileService {

    // URI ROOT
    urlEndPoint: String = GlobalConstants.apiURL;
    // For Headers in request
    httpOptions = {};
    // Fow dowlaod data sin auth
    httpHeadersNoAuth = {};

    // Define client and guard for Auth in constructor
    constructor(
        private http: HttpClient,
        private auth: AuthGuard
    ) {
        if (!localStorage.getItem('token') || !localStorage.getItem('STATE') && localStorage.getItem('STATE') !== "true") {
            this.auth.closeLocalSession();
        }
        // Asignamos los headers que deben estar en las cabezaras
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            })
        };
    }

    /****
     * ME-QUOTES
    ****/

    // Get all quotes
    getMeQuotes(in_user = false, in_customer = false, in_service = false, in_products = false, sort = '-updated_at'): any {
        let included = '';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        } if (in_service) {
          included += 'service,service.courier,';
        } if (in_products) {
          included += 'products';
        }
        return this.http.get(this.urlEndPoint + '/me-quotes' + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get one quote
    showMeQuote(id: number, in_user = false, in_customer = false, in_service = false, in_products = false): any {
        let included = '';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        } if (in_service) {
          included += 'service,service.courier,';
        } if (in_products) {
          included += 'products';
        }
        return this.http.get(this.urlEndPoint + '/me-quotes/' + id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Add one quote
    storeMeQuote(data: any) {
        return this.http.post(this.urlEndPoint + '/me-quotes', data, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Update one quote
    updateMeQuote(id: number, data: any) {
        return this.http.put(this.urlEndPoint + '/me-quotes/' + id, data, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Delete one quote
    deleteMeQuote(id: number) {
        return this.http.delete(this.urlEndPoint  + '/me-quotes/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }

    /****
     * ME-QUOTES-MASSIVES
    ****/

    // Get all quotes massive
    getMeQuotesMassive(in_user = false, in_customer = false, sort = '-updated_at'): any {
        let included = '';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer';
        }
        return this.http.get(this.urlEndPoint + '/me-quotes-massives' + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get one quote massive
    showMeQuoteMassive(id: number): any {
        return this.http.get(this.urlEndPoint + '/me-quotes-massives/' + id, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get shipments for one massive
    showMeQuotesForMassive(id: number, in_user = false, in_customer = false, in_service = false, in_products = false, sort = '-updated_at'): any {
        let included = '';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        } if (in_service) {
          included += 'service,service.courier,';
        } if (in_products) {
          included += 'products';
        }
        return this.http.get(this.urlEndPoint + '/me-quotes-massives/shipments/' + id + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Add one quote massive
    storeMeQuoteMassive(data: any) {
        return this.http.post(this.urlEndPoint + '/me-quotes-massives', data, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Update one quote massive
    updateMeQuoteMassive(id: number, data: any) {
        return this.http.put(this.urlEndPoint + '/me-quotes-massives/' + id, data, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Cancel one quote massive
    cancelQuoteMassive(id: number) {
        return this.http.get(this.urlEndPoint + '/me-quotes-massives/cancel/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Delete one quote massive
    deleteQuoteMassive(id: number) {
        return this.http.delete(this.urlEndPoint + '/me-quotes-massives/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }

    /****
     * ME-SHIPMENTS
    ****/

    // Get all quotes or one quote
    getMeShipments(in_user = false, in_customer = false, in_service = false, in_products = false, sort = '-updated_at'): any {
        let included = 'statuse,';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        } if (in_service) {
          included += 'service,service.courier,';
        } if (in_products) {
          included += 'products';
        }
        return this.http.get(this.urlEndPoint + '/me-shipments' + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Show a one shipment
    showMeShipments(id: number, in_user = false, in_customer = false, in_service = false, in_products = false): any {
        let included = 'statuse,delivery_time,events,incidences,';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        } if (in_service) {
          included += 'service,service.courier,';
        } if (in_products) {
          included += 'products,';
        }
        return this.http.get(this.urlEndPoint + '/me-shipments/' + id + '?included=' + included, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Add one quote
    storeMeShipment(data: any) {
        return this.http.post(this.urlEndPoint + '/me-shipments', data, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Update one quote
    updateMeShipment(id: number, data: any) {
        return this.http.put(this.urlEndPoint + '/me-shipments/' + id, data, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Cancel one shipmete
    cancelMeShipment(id: number) {
        return this.http.get(this.urlEndPoint  + '/me-shipments/cancel-guide/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Delete one quote
    deleteMeShipment(id: number) {
        return this.http.delete(this.urlEndPoint  + '/me-shipments/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }

    /****
     * ME-SHIPMENTS-MASSIVES
    ****/

    // Get all shipments massives
    getMeShipmentsMassive(in_user = false, in_customer = false, sort = '-updated_at'): any {
        let included = '';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        }
        return this.http.get(this.urlEndPoint + '/me-shipments-massives' + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get one shipment massive
    showMeShipmentMassive(id: number, in_user = false, in_customer = false): any {
        let included = '';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        }
        return this.http.get(this.urlEndPoint + '/me-shipments-massives/' + id + '?included=' + included, this.httpOptions).pipe(tap(() =>{},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get shipments for one massive
    showMeShipmentForMassive(id: number, in_user = false, in_customer = false, in_service = false, in_products = false, sort = '-updated_at'): any {
        let included = 'statuse,';
        if (in_user) {
          included += 'user,';
        } if (in_customer) {
          included += 'customer,';
        } if (in_service) {
          included += 'service,service.courier,';
        } if (in_products) {
          included += 'products';
        }
        return this.http.get(this.urlEndPoint + '/me-shipments-massives/shipments/' + id + '?sort=' + sort + '&included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Add one shipment massive
    storeMeShipmentMassive(data: any) {
        return this.http.post(this.urlEndPoint + '/me-shipments-massives', data, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Update a one Shipment massive 
    updateMeShipmentMassive(id: number, data: any) {
        return this.http.put(this.urlEndPoint + '/me-shipments-massives/' + id, data, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Cancel one quote massive
    cancelShipmentMassive(id: number) {
        return this.http.get(this.urlEndPoint + '/me-shipments-massives/cancel/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Delete one shipment massive
    deleteShipmentMassive(id: number) {
        return this.http.delete(this.urlEndPoint + '/me-shipments-massives/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }

    /****
     * ME-PROFILE-SERVICES
    ****/

    // Get me profile user
    getMeProfile(): any {
        let included = 'stall,account,areas,roles,permissions,customers,losses,image';
        return this.http.get(this.urlEndPoint + '/me-profile' + '?included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get me profile customer
    getMeProfileCustomer(): any {
        let included = 'your_account.stall,your_account.account,your_account.areas,your_account.roles,your_account.image,profile,turn,customer_type,is_assigned,is_customer,products,';
        return this.http.get(this.urlEndPoint + '/me-profile-client' + '?included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get mi image url
    getMeImage(): any {
        return this.http.get(this.urlEndPoint + '/me-image', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get array me permission
    getMePermissions(): any {
        return this.http.get(this.urlEndPoint + '/me-permissions', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    getMeLosses(): any {
        let included = "product";
        return this.http.get(this.urlEndPoint + '/me-losses' + '?included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Obtiene solamente los clientes del usuario
    getMeCustomersBasic(): any {
        return this.http.get(this.urlEndPoint + '/me-customers', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Obtiene a loc cliente del usuario
    getMeCustomers(include: boolean = true): any {
        let included = (include) ? "profile,turn,customerType,is_customer,products,contactsables.contact,contactsables,your_account.account" : "";
        return this.http.get(this.urlEndPoint + '/me-customers' + '?included=' + included, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    
    /** UPDATES-PROFILE **/

    // Update data for user
    updateMeProfile(data: any) {
        return this.http.post(this.urlEndPoint + '/update-profile', data, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
                if (err.status === 401) {
                    this.auth.closeLocalSession();
                }
            })
        );
    }
    // Update data for customer
    updateMeProfileClient(data: any) {
        return this.http.post(this.urlEndPoint + '/update-profile-client', data, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
                if (err.status === 401) {
                    this.auth.closeLocalSession();
                }
            })
        );
    }
    // Update me password
    updateMePassword(data: any) {
        return this.http.post(this.urlEndPoint + '/update-password', data, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
                if (err.status === 401) {
                    this.auth.closeLocalSession();
                }
            })
        );
    }
    // Update me image
    updateMeImage(data: any) {
        let httpOptions = {
            headers: new HttpHeaders({
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
            })
        };
        return this.http.post(this.urlEndPoint + '/update-image', data, httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
                if (err.status === 401) {
                    this.auth.closeLocalSession();
                }
            })
        );
    }

    /****
     * ME-NOTIFICATIONS
    ****/

    // Get all notifications
    getMeNotificationsAll(): any {
        return this.http.get(this.urlEndPoint + '/notifications', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get me notifications read
    getMeNotificationsRead(): any {
        return this.http.get(this.urlEndPoint + '/notifications-read', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get me notificacitions unread
    getMeNotificationsUnread(): any {
        return this.http.get(this.urlEndPoint + '/notifications-unread', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Mark all read notifications
    markAllMeNotifications(): any {
        return this.http.get(this.urlEndPoint + '/mark-notifications-read', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Mark read one notification
    markOneMeNotification(uuid: string): any {
        return this.http.get(this.urlEndPoint + '/read-one-notification/' + uuid, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }

    /****
     * ME-DASHBOARD
    ****/

    // Get data master
    getDashboardMaster(start: any, end: any): any {
        let dates       = "date_start=" + start.toISOString().slice(0,10) + '&date_end=' + end.toISOString().slice(0,10);
        let fields      = "id,guide,slug,guide_master,track,identify,origin,destin,packages,numbers,quote_intern,charges,services,datasmonies,dates,booleanstype,ship_type,status,status_id,delivery_time_id,service_id,user_id,customer_id,deleted_at,created_at,updated_at";
        let included    = "statuse,delivery_time,service,service.courier,user,customer,products";
        let filter      = "quote_start";
        let orderBy     = "-updated_at";
        let params      = "?" + dates + "&fields=" + fields + "&included=" + included + "&filter_by=" + filter + "&sort=" + orderBy;
        console.log("params => " + dates);
        return this.http.get(this.urlEndPoint + '/dashboard/master' + params, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get ships for dashboard
    getDashboardShipments(): any {
        return this.http.get(this.urlEndPoint + '/dashboard/shipments', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Get guides
    getDashboardGuides(): any {
        return this.http.get(this.urlEndPoint + '/dashboard/guides', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }


    /****
     * LOGOUT APP
    ****/

    // Salir de la aplicación
    signOutApp() {
        return this.http.get(this.urlEndPoint + '/sign-out', this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Revocar el token de la sesión de la app
    revokeTokenApp() {
        return this.http.post(this.urlEndPoint + '/revoked', null, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Envia una notificación para que se pongan en contacto
    contactUs(data: any) {
        return this.http.post(this.urlEndPoint + '/contact', data, this.httpOptions).pipe(tap(() => {},
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
}