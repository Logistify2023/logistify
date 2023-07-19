import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/**
 * Services for Address and Image
*/
export class UtilsService {

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
        'Accept': 'application/json',
      })
    };
  }

  // ADDRESS ENDPOINTS

  // Obtiene los asentamientos de acuerdo a un código postal
  getAddressByPostalCode(postal_code: any) {
    return this.http.get(this.urlEndPoint + '/address?filter[postal_code]=' + postal_code, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtien los códigos postales de un estado, municipio y puede ser asentamiento
  getAddressByFilters(state: string, municipality: string, settlement: string = '') {
    let filters = "?filter[state]=" + state + "&filter[municipality]=" + municipality;
    if(settlement == '') {
      filters += "&filter[settlement]=" + settlement;
    }
    return this.http.get(this.urlEndPoint + '/address' + filters, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene todos los estados
  getStates() {
    return this.http.get(this.urlEndPoint + '/address/states', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene todas las ciudades de un estado
  getCities(state: string) {
    return this.http.get(this.urlEndPoint + '/address/citys?state=' + state, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene todos los municipios de un estado
  getMunicipalities(state: string) {
    return this.http.get(this.urlEndPoint + '/address/municipalities?state=' + state, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene todos los asentamientos de un municipio y un estado
  getSettlements(state: string, municipality: string) {
    return this.http.get(this.urlEndPoint + '/address/settlements?state=' + state + '&municipality=' + municipality, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene todos los tipos de asentamientos
  getSettlementsTypes() {
    return this.http.get(this.urlEndPoint + '/address/settlement_types', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene todas los zonas
  getZones() {
    return this.http.get(this.urlEndPoint + '/address/zones', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene las direcciones de acuerdo a un código postal
  getAddressByCp(postal_code: string) {
    return this.http.get(this.urlEndPoint + '/address/cps?codigo_postal=' + postal_code, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene los asentamientos entre un código postal origen y destino
  getAddressBetween(cp_start: string, cp_end: string) {
    return this.http.get(this.urlEndPoint + '/address/between?start=' + cp_start + '&end=' + cp_end, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Se encarga de agregar una nueva dirección
  addressStore(data: any) {
    return this.http.post(this.urlEndPoint + '/address', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Obtiene una dirección por su ID
  addressShow(id: number) {
    return this.http.get(this.urlEndPoint + '/address/' + id + '?included=addressables', this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Actualiza la información de una dirección por su ID
  addressUpdate(id: number, data: any) {
    return this.http.put(this.urlEndPoint + '/address/' + id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Elimina una dirección de la base de datos por su ID
  addressDelete(id: number) {
    return this.http.delete(this.urlEndPoint + '/address/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Se encarga de importar las direcciones nuevas
  addressImportFile(data: any) {
    // Definimos los headers para pasar un archivo en la data
    let httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString()
      })
    };
    return this.http.post(this.urlEndPoint + '/import/address-all', data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  // IMAGE URL

  // Obtiene la url de una imagen de acuerdo a su ID
  getImage(id: number) {
    return this.http.get(this.urlEndPoint + '/images/image/' + id, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        // Validamos la respuesta del servidor
        this.auth.validateResponse(err.status);
        // Valida si no tiene acceso el cliente
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
}