import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './audit-couriers.component.html',
  styleUrls: [],
})

// Exportamos nuestro componente
export class AuditCouriersComponent implements OnInit {

  // Definimos las variables a utilizar
  public loading      : boolean = false;
  public showData     : boolean = false;
  public id_courier   : number;
  public listData     : any = [];
  public listCouriers : any[] = [];
  public fecha_hoy    = new Date();
  public fecha_ant    = new Date();
  // Declaramos nuestro formulario para obtener la información
  public courierForm = new FormGroup({
    start:      new FormControl<Date | null>(this.fecha_ant),
    end:        new FormControl<Date | null>(this.fecha_hoy),
    id_courier: new FormControl('', [Validators.required]),
  });
  
  // Definimos los servicios a utilizar en nuestro componente
  constructor(
    private _apiCouiers: MessengerService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
  ) { }

  // Inicia nuestro componente
  ngOnInit(): void {
    this.getCouriers();
  }

  // Funcíon que obtiene la data de acuerdo a la mensajera correspondiente
  getCouriers() {    
    this._apiCouiers.getCouriers(0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, ).subscribe((e: any) => {
      if(e.result) {
        this.listCouriers = e.data;
      } else {
        this.toastr.warning("No se logro obtener el listado de mensajerías", 'Recargar pagina', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    });
  }

  // Hace la peticion para obtener la data para auditar a las mensajerías
  getDataForAudit(): void {
    let mensajera = this.courierForm.get('id_courier')?.value;
    let inicio    = this.courierForm.get('start')?.value;
    let termino   = this.courierForm.get('end')?.value;
    let mensaje   = "Debemos de obtener los envios de acuerdo a la mensajería " + mensajera + ", las guias que esten entregadas y no se hayan cobrado o ver si hay ajustes entre las fechas de " + inicio + " y " + termino;
    this.showData = true;
    this.loading  = true;
    this.toastr.info(mensaje, 'Módulo en desarrollo', {
      timeOut: 4000,
      enableHtml: true,
    });
  }
}