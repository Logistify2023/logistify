import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, from, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})

// Exportamos nuestro componente
export class AuthService implements OnDestroy {

  // Definimos nuestras variables globales
  urlEndPoint: String = GlobalConstants.apiURL;
  isLogin = false;
  roleAs: string;
  avatar: string;

  /* Esto es del example */
  private user = new BehaviorSubject<UserWithToken | null>(null);
  user$ = this.user.asObservable();
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(Boolean));

  // Asi estaba
  private _authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get isAuthenticated$(): Observable<any> {
    if (localStorage.getItem('token') !== null) {
      console.log('isAuthenticated true');
      this._authSub$.next(true);
    }else{
      console.log('isAuthenticated false');
    }
    return this._authSub$.asObservable();
  }

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  public ngOnDestroy(): void {
    this._authSub$.next(false);
    this._authSub$.complete();
  }

  /* public login(data: any): Observable<void> {
    return this.http.post(this.urlEndPoint + '/sign-in', data).pipe(
      map((t: any) => {
        this.handleSignInResponse(t);
        return t;
      })
    );
  } */

  // Función que nos permite acceder a la API
  public login(data: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      })
    };
    return this.http.post(this.urlEndPoint + '/sign-in', data, httpOptions);
  }

  // Función que permite salir de la aplicación
  public logout(redirect: string): Observable<any> {
    return this.http.get(this.urlEndPoint + '/sign-out', {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')?.toString()
      })
    }).pipe(
      tap(_ => {
        this.isLogin = false;
        localStorage.clear();
        (this._authSub$.next(false), this._router.navigate([redirect]))
      }),
      catchError((err: any) => {
        localStorage.clear();
        (this._authSub$.next(false), this._router.navigate([redirect]))
        throw new Error('Unable to sign out');
      })
    );
  }

  // Valida si el usuario actual tiene una sessión activa correcta con el STATE
  public isLoggedIn() {
    // Obtenemos el STATE
    const loggedIn = (localStorage.getItem('STATE')) ? localStorage.getItem('STATE') : 'false' ;
    //Regresamos verdadero si es true caso contrario regresamos false
    return this.isLogin = ((loggedIn == 'true') ? true : false);
  }

  // Obtiene el rol del usuario de la cache si es que existe
  public getRole() {
    const roleAs = (localStorage.getItem('role')) ? localStorage.getItem('role') : '';
    return this.roleAs = (roleAs) ? roleAs : '';
  }

  // Obtiene todos los permisos que el usuario tenga
  public getPermissions() {
    return (localStorage.getItem('permissions')) ? localStorage.getItem('permissions') : "";
  }

  // Definimos las rutas que todo usuario tendra acceso una vez logueado
  public getRutesByDefect() {
    return [
      '/me-profile',
      '/me-dashboard',
      '/me-notifications',
      '/me-quotes',
      '/me-quotes-massive',
      '/me-shipments',
      '/me-shipments-massive',
    ];
  }

  // AL parecer esta función valida que la función sea correcta la respuesta del servidor
  private handleSignInResponse(t: any): void {
    if (t.result !== true) {
      throw new Error(`We cannot handle the ${t.status} status`);
    }
    this._authSub$.next(true);
  }
}

// Interfaz para validar el token
export interface UserWithToken {
  token: string;
}