import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './update.component.html',
})

// Expormos nuestro componente
export class GroupUpdateComponent implements OnInit {

  // Definimos las variables a utilizar
  public objectGroup:       any;
  public loanding:          boolean = false;
  public isSepared:         boolean = false;
  public listGroupsOrigin:  any[] = [];
  public listGroupsDestin:  any[] = [];
  public groupOrigin:       string;
  public postalOrigin:      string;
  public groupDestin:       string;
  public postalDestin:      string;
  public btnOrigin:         boolean = false;
  public btnDestin:         boolean = false;

  // Definimos los servicios que utilizaremos
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<GroupUpdateComponent>,
    private apiMessenger: MessengerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // No utlizamos este metodo
  onSubmit() { }

  ngOnInit(): void {
    this.loanding = true;
    // Obtenemos la información del grupo
    this.apiMessenger.serviceGroupShowGroups(this.data._id).subscribe((e: any) => {
      this.loanding = false;
      if (e.result) {
        // Asignamos la información a una variable
        this.objectGroup = e.data;
        this.isSepared  = e.data.by_separe;
        // Validamos si es por separado la data
        this.listGroupsOrigin = e.data.group_origin;
        this.listGroupsDestin = e.data.group_destin;
      } else {
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    }, (err: any) => {
      this.toastr.warning(err.error.message, 'Advertencia', {
        timeOut: 3000,
        enableHtml: true,
      });
    });
  }

  // Convierte el arreglo a un objeto valido para enviar
  toObject(postal: any, key: string) {
    var object: any = {};
    object[key] = [postal];
    return object;
  }

  // Agregar al arreglo final el grupo al arreglo correspondiente y el código postal
  addToArraGroupOrigin() {
    const grupoOrigen       = this.groupOrigin;
    const postalCodeOrigen  = this.postalOrigin;
    if(!parseInt(postalCodeOrigen)) {
      this.toastr.warning("EL código postal tiene que ser un número", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
      this.postalOrigin = "";
      return;
    }
    // Convertimos en un objeto el arreglo
    let cpsObjectOrigin = this.toObject(postalCodeOrigen, grupoOrigen);
    // Definimos la data a envia
    const data = {
      service_id: this.data._id,
      by_separe: this.isSepared,
      group_origin: [cpsObjectOrigin],
    };
    this.btnOrigin = true;
    // Enviamos la data al servicio
    this.apiMessenger.serviceGroupStore(data).subscribe(
      (e: any) => {
        if (e.result) {
          this.groupOrigin  = '';
          this.postalOrigin = '';
          this.btnOrigin    = false;
          this.toastr.success(e.message, 'Código postal agregado', {
            timeOut: 3000,
            enableHtml: true
          });
        } else {
          this.btnOrigin = false;
          this.toastr.error(e.message, 'Error', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.btnOrigin = false;
        this.toastr.error("Ocurrio un problema al tratar de agregar el código postal", 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }

  // Se encarga de agregar CPs a los grupos destino
  addToArraGroupDestin() {
    const grupoDestino        = this.groupDestin;
    const postalCodeDestino   = this.postalDestin;
    if(!parseInt(postalCodeDestino)) {
      this.toastr.warning("EL código postal tiene que ser un número", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
      this.postalDestin = "";
      return;
    }
    let cpsObjectDestin       = this.toObject(postalCodeDestino, grupoDestino);
    const data  = {
      service_id:   this.data._id,
      by_separe:    this.isSepared,
      group_destin: [cpsObjectDestin],
    };
    this.btnDestin = true;
    // Enviamos la data al servicio
    this.apiMessenger.serviceGroupStore(data).subscribe(
      (e: any) => {
        if (e.result) {
          this.groupDestin = '';
          this.postalDestin = '';
          this.btnDestin = false;
          this.toastr.success(e.message, 'Código postal agregado', {
            timeOut: 3000,
            enableHtml: true
          });
        } else {
          this.btnDestin = false;
          this.toastr.error(e.message, 'Error', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.btnDestin = false;
        this.toastr.error("Ocurrio un problema al tratar de agregar el código postal", 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }
}