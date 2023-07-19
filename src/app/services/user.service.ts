import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GlobalConstants } from "../common/global-constants";
import { AuthGuard } from './auth.guard';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/**
 * Services for Users or Colabs
*/
export class UserService {

  // Definimos las variables globales
  urlEndPoint: String = GlobalConstants.apiURL;
  sortData: String = "-updated_at";
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

  // MY PROFILE

  // Actualiza el perfil del usuario autenticado
  updateProfile(data: any): any {
    return this.http.post(this.urlEndPoint + '/update-profile', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Actualiza la contraseña del usuario autenticado
  updatePassword(data: any): any {
    return this.http.post(this.urlEndPoint + '/update-password', data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }

  // USERS

  // Obtiene al usuario mediante su slug o ID
  getUserBySlug(slug: string) {
    let included = 'stall,account,areas,permissions,roles,image';
    return this.http.get(this.urlEndPoint + '/users/' + slug + '?sort=-updated_at&included=' + included, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Actualiza la información de un usuario por su ID
  updateUser(data: any, id: number): any {
    return this.http.put(this.urlEndPoint + '/users/' + id, data, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Elimina a un usuario por su ID
  deleteUser(id: any, dataDeleted = false){
    let _delete = '';
    if (dataDeleted) {
      _delete = '/admin';
    }
    return this.http.delete(this.urlEndPoint + _delete + '/users/' + id, this.httpOptions).pipe(tap(() => {},
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Restaura a un usuario que ha sido eliminado
  restoreUser(id: any) {
    return this.http.put(this.urlEndPoint + '/admin/users/' + id, {}, this.httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
  // Actualiza la imagen de un usuario
  updateImageProfile(data: any) {
    // Definimos los headers para pasar una imagen
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString(),
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
      })
    };
    return this.http.post(this.urlEndPoint + '/update-image', data, httpOptions).pipe(tap(() => { },
      (err: any) => {
        if (err.status === 401) {
          this.auth.closeLocalSession();
        }
      })
    );
  }
}