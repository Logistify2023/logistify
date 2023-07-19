import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { distinctUntilChanged, map, Subscription, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Directive({
  selector: '[appHaveAccess]'
})

/**
 * Directiva HaveAccess
 * Permite validar si el usuario tiene un permiso en la APP
 * Recibe un permiso y lo compara con los permisos que el usuario tiene asigandos
*/
export class HaveAccessDirective implements OnInit, OnDestroy {

  // Definimos un imput con el mismo nombre de nuestro selecto y que sea de con la estuctura de permission
  @Input('appHaveAccess') permission: string;
  
  // Para saber si se debe subscribir o no
  private sub?: Subscription;

  // Definimos los metodos en nuestro constructor con el usuario
  constructor(
    private _authService: AuthService,
    private viewContantainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) { }

  // Inicia una vez cargado la directiva validando al usuario y si tiene el permiso que pasan
  ngOnInit(): void {
    this.sub = this._authService.user$
      .pipe(
        // Validamos al usuario con la función si tiene acceso de acuerdo al permiso pasaod
        map((user) => Boolean(this.havePermissionDirective(this.permission))),
        // Es para indicar que solo cambia cuando los campos sean distintos
        distinctUntilChanged(),
        // Con esto estamos cargando el template si es verdadero, caso contrario lo limpiamos
        tap((hasPermission) => 
          hasPermission
          ? this.viewContantainerRef.createEmbeddedView(this.templateRef)
          : this.viewContantainerRef.clear()
        )
      )
    .subscribe();
  }

  // En caso de ser necesario nos desuscribimos
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // Permite validar si el permiso existe dentro de los permisos que el usuario tenga relacion
  havePermissionDirective(permiso: string): boolean {
    // Validamos si es que no existe un permiso a validar regresamos true
    if (!permiso) {
      // console.log("havePermissionDirective(" + permiso + ")?");
      return true;
    }

    // Obtenemos todos los permisos que este usuario tenga
    const allPermissions = this._authService.getPermissions();
    // Validamos si el permisos es el que tiene acceso a todo
    if (allPermissions == "all") {
      // console.log("havePermissionDirective(all)");
      return true;
    }

    // Obtenemos todos los permisos del usuario
    let arrarPermissions = allPermissions?.split(",");
    // Validamos si el permiso existe dentro de los permisos del usuario
    if (arrarPermissions?.includes(permiso)) {
      // console.log("havePermissionDirective(" + permiso + ") includes");
      return true;
    }

    // En caso de que no, regresamos la login y regresamos falso
    // console.log("havePermissionDirective NON: " + permiso);
    return false;
  }
}