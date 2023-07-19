import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: [],
})

// Exportamos nuestro componente
export class InsuranceComponent implements OnInit {

  // Variables a utilizar en este compoenente
  public loading  : boolean = false;
  public showData : boolean = false;
  public sure     : any;
  public listData : any = [];
  
  // Definimos los servicios a utlizar en el componenete
  constructor(
    private _apiCouiers: MessengerService,
    private toastr: ToastrService,
  ) { }

  // No cargamos nada en el compoenente
  ngOnInit(): void { }

  // Hace la peticion para obtener el seguro de cada paquetera
  quoteInsurance(): void {
    this.showData = true;
    if (this.sure < 0) {
      this.toastr.warning("El monto a asegurar debe ser mayor a 0", 'Datos incorrectos', {
        timeOut: 3000,
        enableHtml: true
      });
    }
    this.loading = true;
    this._apiCouiers.storeQuoteInsurance({amount: this.sure}).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        this.listData = e.data;
      } else {
        this.toastr.error(e.message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Limpia todo 
  clearAll() {
    this.sure = null;
    this.showData = false;
  }
}