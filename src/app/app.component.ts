import { Component, HostListener, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { GlobalConstants } from './common/global-constants';
import { MeProfileService } from './services/meProfile.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})

// Exporta el componente principal
export class AppComponent implements AfterViewInit {

  // Variables globales
  public showMenuSidenav    :boolean  = true;
  public isAuthenticated    :boolean  = false;
  public loadNotifications  :boolean  = false;
  public imgProfile         :string   = "assets/img/logistify/user-default.png";
  public userName           :string   = "Logistify";
  public countNotifications = GlobalConstants.countNotifications;

  private _destroySub$      = new Subject<void>();

  // Escucha el evento cuando cambia el tamaño
  @HostListener('window:resize', ['$event'])

  // Valida el tamaño para saber si se muestra el aside
  onResize(event: any) {
    if (window.innerWidth >= 700) {
      this.showMenuSidenav = true;
    }
  }

  // Se encarga de aplicar los servicios principales para este componente
  constructor(
    private _authService: AuthService,
    private _meProfile: MeProfileService,
    private router: Router,
  ) {
    // Valida el ancho de la pantalla
    router.events.subscribe((val) => {
      if (window.innerWidth < 700) {
        this.showMenuSidenav = false;
      }
    });

    if (window.innerWidth >= 700) {
      this.showMenuSidenav = true;
    }
  }

  // Actualiza las notificaciones despues de cargar el componente
  ngAfterViewInit(): void {
    if (this.isAuthenticated) {
      this.getNotifications();
    }
  }

  // Se ejecuta al iniciar este componente
  public ngOnInit(): void {
    // Valida si el usuario esta authenticado
    this._authService.isAuthenticated$.pipe(
      takeUntil(this._destroySub$)
    ).subscribe((isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated);

    // Obtiene la imagen del usuario
    if (localStorage.getItem('avatar')) {
      this.imgProfile = (localStorage.getItem('avatar')) ? localStorage.getItem('avatar')!.toString() : "assets/img/logistify/user-default.png";
    }

    // Obtiene el nombre de usuario
    if (localStorage.getItem('username')) {
      let userName = localStorage.getItem('username')!.toString().toLowerCase();
      this.userName = userName.charAt(0).toUpperCase() + userName.slice(1);
    }
  }

  // Se ejecuta al cerrar este componente
  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  // Controla el panel izquierdo
  openSlideVar() {
    this.showMenuSidenav = !this.showMenuSidenav;
  }

  // Cierra la sesión del usuario
  signOut() {
    this._authService.logout('/login').subscribe();
  }

  // Obtiene todas las notificaciones
  getNotifications() {
    if (!this.loadNotifications) {
      this.loadNotifications = true;
      this._meProfile.getMeNotificationsUnread().subscribe((e: any) => {
        if (e.result) {
          GlobalConstants.countNotifications = e.data.length;
          this.updateNotifications();
        }
        setTimeout(() => {
          this.loadNotifications = false;
        }, 1000);
      });
    }
  }

  // Actualiza las notificaciones
  updateNotifications() {
    this.countNotifications = GlobalConstants.countNotifications;
  }
}