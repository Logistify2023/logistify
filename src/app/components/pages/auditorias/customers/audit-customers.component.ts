import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './audit-customers.component.html',
  styleUrls: [],
})

// Exportamos nuestro componente
export class AuditCustomersComponent implements OnInit {

  // Definimos las variables a utilizar en nuestro componente
  public loading        : boolean = false;
  public showData       : boolean = false;
  public id_customer    : number;
  public customer       : any;
  public listData       : any = [];
  public listCustomers  : any[] = [];
  public fecha_hoy      = new Date();
  public fecha_ant      = new Date();
  // Definimos los valores de nuestro formulario
  public customerForm = new FormGroup({
    start: new FormControl<Date | null>(this.fecha_ant),
    end: new FormControl<Date | null>(this.fecha_hoy),
    id_customer: new FormControl('', [Validators.required]),
  });
  
  // Definimos los servicio a utilizar en el componente
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private meProfile: MeProfileService,
  ) { }

  // Inicia nuestro componente
  ngOnInit(): void {
    this.getCustomers();
  }

  // Función que obtiene a todos los clientes
  getCustomers() {    
    this.meProfile.getMeCustomers().subscribe((e: any) => {
      if(e.result) {
        this.listCustomers = e.data;
      } else {
        this.toastr.warning("No se logro obtener el listado de clientes", 'Recargar pagina', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    });
  }

  // Función que hace la petición al servicio para obtener al cliente correspondiente y su información
  getDataForAudit(): void {
    let cliente = this.customerForm.get('id_customer')?.value;
    let inicio  = this.customerForm.get('start')?.value;
    let termino = this.customerForm.get('end')?.value;
    let mensaje = "Debemos de obtener los envios de acuerdo al cliente " + cliente + ", las guias que esten entregadas y no se hayan cobrado entre las fechas de " + inicio + " y " + termino;
    this.showData = true;
    this.loading = true;
    this.toastr.info(mensaje, 'Módulo en desarrollo', {
      timeOut: 4000,
      enableHtml: true,
    });
  }
}