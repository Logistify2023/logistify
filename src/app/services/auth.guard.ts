import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  // Definimos las variables para utilizar en esta función
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private toastr: ToastrService,
  ) {}

  /**
   * DEFINIMOS LA LOGICA PARA CADA UNO DE LOS GUARDS(GUARDIAS) QUE ANGULAR MANEJA
   * ESTO PARA SABER SI UN USUARIO ESTA ACTIVO Y TIENE PERMISO PARA VISUALLIZAR UN
   * COMPONENTE EN LA APLICACIÓN.
   * 
   * REVISAR QUE MAGIA SE PUEDE HACER CON TODOS ESTOS GUARDS
  */

  // Permite validar si se muestra some en la aplicación
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    // Valida si el usuario esta logeado y despues si tiene permiso
    return Boolean (this.checkUserLogin()) ? this.hasPermission(route, state.url) : false;
  }

  // Permite validar los hijos si tambien se puede mostrar
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    // Pasamos todo a la función CanActivate para que se enarge de validar
    return Boolean (this.canActivate(next, state));
  }

  // Permite validar si un usuario puede avandanor una pagina de la aplicación
  canDeactivate(
    component: unknown,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      // Esta logica falta pulirla pasando el componete para validar si lo puede dejar o no
      return Boolean (this.canActivate(next, state));
    }

  // Permite validar si un usuario puede visualizar algo en la aplicación
  canLoad(
    route: Route | ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean
  {
    // Valida si el usuario esta activo y si tiene permiso para visualizar
    return Boolean (this.checkUserLogin()) ? this.hasPermission(route, null) : false;
  }

  /**
   * Guarda que permite validar si un usuario tiene una sesíon valida 
   * De acuerdo a la función de isLogginIn() valida que el STATE global se 'true'
   * caso contrario lo redirige al Login para que inicie sesión
   * @returns boolean
   */
  public checkUserLogin(): boolean {
    // Validamos si el usuario esta logueado
    if (this._authService.isLoggedIn()) {
      console.log("Usuario logueado correctamente :)");
      return true;
    }
    // En caso de que no entre en ninguno lo redirigimos al login y regresamos false con una alerta
    console.log("Usuario no ha iniciado sesión :(");
    this._router.navigate(['/login']);
    this.toastr.warning("La sesión a caducado, vuelve a iniciar sesión", 'Sesión caducada', {
      timeOut: 5000,
      enableHtml: true
    });
    return false;
  }

  /**
   * Guarda que permite validar si un usuario tiene permiso
   * De acuerdo al permiso que se le pase valida si tiene o no permiso
   * caso contrario muestra una alerta
   * @param route 
   * @param url 
   * @returns boolean
   */
  public hasPermission(route: Route | ActivatedRouteSnapshot, url: string | null): boolean {
    // Obtenemos el permiso si es que existe
    let permiso = route.data?.['canView'];

    // Validamos si hay una url y que sea de las que se permiten
    if(url) {
      let routesProfile = this._authService.getRutesByDefect();
      // Validamos si la URL pertence a una de las que son por defecto
      if(routesProfile.includes(url)) {
        console.log("hasPermission(URL) => " + url + " is valid");
        return true;
      }
    }

    // Validamos si es que no existe un permiso a validar regresamos true
    if (!permiso) {
      console.log("hasPermission(" + permiso + ") no existe");
      return true;
    }

    // Obtenemos todos los permisos que este usuario tenga
    let allPermissions = this._authService.getPermissions();

    // Validamos si el permisos es el que tiene acceso a todo
    if(allPermissions == "all") {
      console.log("hasPermission(all)");
      return true;
    }

    // Obtenemos todos los permisos del usuario en un arreglo
    let arrarPermissions = allPermissions?.split(",");
    // Validamos si el permiso existe dentro de los permisos del usuario
    if(arrarPermissions?.includes(permiso)) {
      console.log("hasPermission(" + permiso + ") includes OK");
      return true;
    }

    // En caso de que no, regresamos al login y regresamos falso ya que no tiene permiso
    console.log("hasPermission(" + permiso + ") FALSE");
    this.toastr.error("No estas autorizado para realizar esta acción", 'No autorizado', {
      timeOut: 5000,
      enableHtml: true
    });
    return false;
  }

  // Cierra la sesión con la API ya que no tiene un token valido
  public closeLocalSession() {
    console.log('Función que debe cerrar sesión, no hay token valido');
    // this._authService.logout('/login').subscribe();
  }

  // Función que valida el estado de la respuesta a cualquier petición realizada al servidor
  public validateResponse(status: number) {
    console.log("LLega a validateResponse(status: number) in AuthGuard");
    // Validamos si es correcta
    if (status === 200 || status === 201) {
      console.log("Respuesta correcta del servidor");
    }

    // Valida si es un error del cliente
    if (status === 422) {
      console.log("Error del cliente 422");
    }

    // Valida si es una respuesta incorrecta
    if (status === 400) {
      console.log("Error en el cliente 400");
    }

    // Valida si no reconoce al usuario
    if (status === 401) {
      console.log("No se reconoce al cliente 401");
    }

    // Valida si el cliente no tiene permiso
    if (status === 403) {
      console.log("No tiene permiso el cliente 403");
    }

    // Valida si hay un error en el servidor
    if (status === 500 || status == 501 || status == 502 || status == 503) {
      console.log("Error en el servidor 50*");
    }
  }
}

// Exportamos la función que valida los permisos del usuario logueado
export function hasPermissionExport(permiso: string) {
  // Aplicamos la logica
  return () => {

    // Validamos si es que no existe un permiso a validar regresamos true
    if (!permiso) {
      console.log("hasPermissionExport(" + permiso + ") no existe");
      return true;
    }

    // Obtenemos todos los permisos que este usuario tenga
    let allPermissions = inject(AuthService).getPermissions();
  
    // Validamos si el permisos es el que tiene acceso a todo
    if(allPermissions == "all") {
      console.log("hasPermissionExport(all)");
      return true;
    }

    // Obtenemos todos los permisos del usuario en forma de arreglo 
    let arrarPermissions = allPermissions?.split(",");
    // Validamos si el permiso existe dentro de los permisos del usuario
    if(arrarPermissions?.includes(permiso)) {
      console.log("hasPermissionExport(" + permiso + ") includes OK");
      return true;
    }

    // En caso de que no, regresamos la login y regresamos falso
    console.log("hasPermissionExport(" + permiso + ") FALSE");
    inject(ToastrService).error("No estas autorizado para realizar esta acción", 'No autorizado', {
      timeOut: 5000,
      enableHtml: true
    });
    return false;
  }
}