import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { Utils } from 'src/app/common/utils';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: [],
})

// Exportamos este componente
export class MeQuotesMassiveDetailsComponent implements OnInit {

  // Definimos las variables a utilizar
  objectDetails: any = {};
  errorMessages: string = '';
  dataDeleted: boolean = false;
  loading: boolean = false;
  loanding: boolean = false;
  arrayData: any = [];
  serviceSelected: string = '';
  countQuotes: number = 0;
  filterPriceMinActive: boolean = false;
  filterPriceMaxActive: boolean = false;

  // Definimos los servicios que utilizaremos
  constructor(
    private apiShipments: ShipmentsService,
    private api_MeProfile: MeProfileService,
    public dialogRef: MatDialogRef<MeQuotesMassiveDetailsComponent>,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private utils: Utils,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Iniciamos cargando toda la información
  ngOnInit(): void {
    this.loanding = true;
    this.api_MeProfile.showMeQuoteMassive(this.data._id).subscribe((e: any) => {
      this.loanding = false;
      if (e.result) {
        // convertir la data a un formato de array correcto
        e.data.data = Object.values(e.data.data);
        e.data.total = [];
        const dataResult: any = [];
        // agregar el atributo checked a lops servicios
        for(let item of e.data.data) {
          for(let service in item.services) {
            item.services[service].checked = false;
          }
        }
        // agregar un nuevo parámetro a los headers
        const headers = e.data.columns.map((e: any) => ({checked: false, product: e}));
        // caclcular el total por servicio
        for(let i of e.data.data) {
          i.services.map((result: any) => {
            const partialResult         = dataResult[result.service];
            dataResult[result.service]  = partialResult ? partialResult + result.price : result.price;
          });
        }
        // covertir el resultado a un formato de array correcto
        const totals = Object.keys(dataResult).map(totalResult => ({
          product: totalResult,
          total: dataResult[totalResult],
        }));
        // pasamos al array total, la suma  total de todos los precios por servicio
        e.data.total        = totals;
        e.data.columns      = headers;
        this.objectDetails  = e.data;
        this.countQuotes    = this.objectDetails.data.length;
      } else {
        this.dialogRef.close();
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.loanding = false;
      this.toastr.error(err.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Obtener y agregar al array los servicios seleccionados
  selectedService(element: any, identify: any) {
    this.filterPriceMaxActive = false;
    this.filterPriceMinActive = false;
    for(let i of this.objectDetails.columns) {
      i.checked = false;
    }
    this.generateArrayData(element, identify);
  }

  // Seleccionar todos los precios según el servicio seleccionado
  selectedAllServices(item: any) {
    this.filterPriceMaxActive = false;
    this.filterPriceMinActive = false;
    for(let head of this.objectDetails.columns) {
      if(head.product == item.product) {
        head.checked = true;
      }else{
        head.checked = false;
      }
    }
    this.checkedAllServices(item);
  }

  // Seleccionar los precios del servicio mas barato
  selectedPriceMin() {
    this.filterPriceMaxActive = false;
    this.filterPriceMinActive = true;
    for(let i of this.objectDetails.columns) {
      i.checked = false;
    }
    var totalMin  = this.objectDetails.total[0].total;
    var data      = this.objectDetails.total;
    let service   = this.objectDetails.total[0].product;
    for (var i = 0; i < data.length ; i++) {
      if (data[i].total < totalMin) {
        totalMin = data[i].total;
        service = data[i].product;
      }
    }
    var objectService = {
      product: service,
      total: totalMin,
    }
    this.checkedAllServices(objectService);
  }

  // Seleccionar los precios del servicio más caro
  selectedPriceMax() {
    this.filterPriceMaxActive = true;
    this.filterPriceMinActive = false;
    for(let i of this.objectDetails.columns) {
      i.checked = false;
    }
    var totalMax  = this.objectDetails.total[0].total;
    var data      = this.objectDetails.total;
    let service   = this.objectDetails.total[0].product;
    for (var i = 0; i < data.length ; i++) {
      if (data[i].total > totalMax) {
        totalMax = data[i].total;
        service = data[i].product;
      }
    }
    var objectService = {
      product: service,
      total: totalMax, 
    }
    this.checkedAllServices(objectService);
  }

  // Seleccionar todos los precios
  checkedAllServices(item: any) {
    this.arrayData = [];
    this.objectDetails.data.forEach((e: any) => {
      e.services.forEach((i: any) => {
        if(item.product == i.service) {
          i.checked = true;
          if(i.price > 0) {
            this.generateArrayData(i, e.identify);
            let newArrayPrices = Object.values(this.arrayData);
            let countPricesSelected = newArrayPrices.length;
            // validar que exiten los precios de todlas las cotizaciones
            if(countPricesSelected == this.countQuotes){
              this.errorMessages = '';
            }else{
              this.errorMessages = 'No se obtuvieron todos los precios, por favor selecciona los precios faltantes.'
            }
          }
        }else{
          i.checked = false;
        }
      });
    });
  }

  // Generar un arreglo con la data
  generateArrayData(element: any, identify: any) {
    element.checked = true;
    this.arrayData[identify ] = {'identify': identify, 'quote_id': element.quote_id};
    let newArrayPrices = Object.values(this.arrayData);
    let countPricesSelected = newArrayPrices.length;
    // validar que exiten los precios de todlas las cotizaciones
    if(countPricesSelected == this.countQuotes) {
      this.errorMessages = '';
    }
  }

  // Procesamos las cotizaciones seleccionadas a envios
  onSubmit() {
    this.loading = true;
    // convertir a un formato de array normal
    const _shipments = Object.values(this.arrayData);
    var data = {
      id_master: this.data._id,
      shipments: _shipments,
    }
    this.api_MeProfile.storeMeQuoteMassive(data).subscribe((e: any) => {
      this.loading = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cotización masiva', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Error', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.loading = false;
        let message = this.utils.getErrorMessage(error);
        this.toastr.error(message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }
}
