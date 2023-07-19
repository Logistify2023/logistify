import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Utils } from '../../../common/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})

// Exportamos el componente para acceder al sistema
export class LoginComponent implements OnInit, OnDestroy {
  
  public loginValid = true;
  public loginSubmitted = false;
  public username = '';
  public password = '';
  public hidePassword = true;
  private _destroySub$ = new Subject<void>();
  private readonly returnUrl: string;
  private snackConfig: any = {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    duration: 3000,
    panelClass: ['mat-snack-bar-success']
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    private _api: ApiService,
    private utils: Utils,
    private toastr: ToastrService,
  ) {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/me-dashboard';
  }

  public ngOnInit(): void {
    this._authService.isAuthenticated$.pipe(
      filter((isAuthenticated: boolean) => isAuthenticated),
      takeUntil(this._destroySub$)
    ).subscribe(_ => this._router.navigateByUrl(this.returnUrl));
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  public onSubmit(): void {
    this.loginValid = true;
    this.loginSubmitted = true;
    // Consumimos el servicio de login
    this._authService.login({email: this.username, password: this.password}).subscribe({
      next: data => {
        if (data.result) {
          let token = data.data;
          // Obtenemos datos del usuario
          localStorage.setItem('STATE', 'true');
          localStorage.setItem('token', token);
          localStorage.setItem('username', data.message.info.username);
          localStorage.setItem('role', data.message.info.roles[0].rol);
          localStorage.setItem('permissions', data.message.permissions);
          localStorage.setItem('user-data', JSON.stringify(data.message.info));
          localStorage.setItem('role-data', JSON.stringify(data.message.info.roles[0]));
          localStorage.setItem('stateAside', 'open');
          localStorage.setItem('avatar', data.message.image);
          // Recargamos la página
          this.reloadPage();
          this.toastr.success('Inicio de sesión correcto.', '', {
            timeOut: 3000,
            enableHtml: true
          });
        }else{
          this.toastr.warning(data.message, 'Las credenciales no son correctas', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      error: err => {
        let message = this.utils.getErrorMessage(err);
        this.loginSubmitted = false;
        this.toastr.warning(message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    });
  }

  // Función que se encarga recargar la pagina
  reloadPage(): void {
    window.location.reload();
  }
}