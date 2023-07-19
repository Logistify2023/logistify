import { Component, OnInit } from '@angular/core';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: []
})

// Exportamos el componente
export class NotificationsComponent implements OnInit {
  // Permitiran almacenar las notificaciones
  listNotificationsUnread: any = [];
  listNotificationsRead: any = [];
  public loanding : boolean = false;

  // Creamos una instancia de la API
  constructor(private _api: MeProfileService) { }

  // Inicia con la carga de la data
  ngOnInit(): void {
    this.loanding = true;
    this.getNotifications();
  }

  // Obtiene todas las notificaciones del colaborador
  getNotifications() {
    // this.loanding = true;
    this._api.getMeNotificationsAll().subscribe((e: any) => {
      this.loanding = false;
      if (e.result) {
        this.listNotificationsRead = e.data.read;
        this.listNotificationsUnread = e.data.unread;
      }
    });
  }

  // Marca una notificación como leida de acuerdo a su UUID
  markRead(uuid: string) {
    this._api.markOneMeNotification(uuid).subscribe((e: any) => {
      if (e.result) {
        this.getNotifications();
      }
    });
  }

  // Marca como leidas todas las notificaciones del colaborador
  markReadAllUnread() {
    this._api.markAllMeNotifications().subscribe((e: any) => {
      if (e.result) {
        this.getNotifications();
      }
    });
  }
}