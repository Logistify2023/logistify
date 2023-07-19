import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

/**
 * Services for Tracking shipments
*/
export class TrackingService {

    // Definimos las variables globales
    urlEndPoint: String = GlobalConstants.apiURL;
    httpOptions = {};
    httpHeadersNoAuth = {};

    constructor(
        private http: HttpClient,
        private auth: AuthGuard,
    ) {
        // Validamos que exista un token en la cache
        if (!localStorage.getItem('token') || !localStorage.getItem('STATE') && localStorage.getItem('STATE') !== "true") {
            this.auth.closeLocalSession();
        }
        // Definimos nuestro header para usar en nuestras peticiones
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            })
        };
    }

    // GET SHIPMENTS FOR TRACK

    // Get all shipments for track
    getTracking(sort = '-updated_at'): any {
        return this.http.get(this.urlEndPoint + '/tracking' + '?sort=' + sort, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                // Validamos la respuesta del servidor
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Show a one shipment for track
    showTrack(id: string): any {
        return this.http.get(this.urlEndPoint + '/tracking/' + id, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                // Validamos la respuesta del servidor
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Show a one shipment for track
    showTrackDetails(guide: string): any {
        return this.http.get(this.urlEndPoint + '/tracking/status/' + guide, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                // Validamos la respuesta del servidor
                this.auth.validateResponse(err.status);
            })
        );
    }
    // Update all tracking for shipments
    storeTracking() {
        return this.http.post(this.urlEndPoint + '/tracking', null, this.httpOptions).pipe(tap(() => { },
            (err: any) => {
                this.auth.validateResponse(err.status);
            })
        );
    }
}