import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: [],
})

export class QuoteMassiveDetailsComponent implements OnInit {
  objectDetails: any = {};
  errorMessages: string = '';
  dataDeleted: boolean = false;
  loading: boolean = false;
  arrayData: any = [];
  serviceSelected: string = '';
  countQuotes: number = 0;
  filterPriceMinActive: boolean = false;
  filterPriceMaxActive: boolean = false;
  constructor(
    private apiShipments: ShipmentsService,
    public dialogRef: MatDialogRef<QuoteMassiveDetailsComponent>,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private utils: Utils,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.apiShipments.showMeQuoteMassive(this.data._id).subscribe((e: any) => {
      if (e.result) {
        // convertir la data a un formato de array correcto
        e.data.data = Object.values(e.data.data)
        e.data.total = [];
        const dataResult: any = [];
        // agregar el atributo checked a lops servicios
        for(let item of e.data.data){
          for(let service in item.services){
            item.services[service].checked = false;
          }
        }
        // agregar un nuevo parámetro a los headers
        const headers = e.data.columns.map((e: any) => ({checked: false, product: e}))
        // caclcular el total por servicio
        for(let i of e.data.data){
          i.services.map((result: any) => {
            const partialResult = dataResult[result.service];
            dataResult[result.service] = partialResult ? partialResult + result.price : result.price;
          });
        }
        // covertir el resultado a un formato de array correcto
        const totals = Object.keys(dataResult).map(totalResult => ({
          product: totalResult,
          total: dataResult[totalResult]
        }));
        // pasamos al array total, la suma  total de todos los precios por servicio
        e.data.total = totals;
        e.data.columns = headers;
        this.objectDetails = e.data;
        this.countQuotes = this.objectDetails.data.length;
      } else {
        this.toastr.error(e.message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error(err.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }
  // obetener y agregar al array los servicios seleccionados
  selectedService(element: any, identify: any){
    this.filterPriceMaxActive = false;
    this.filterPriceMinActive = false;
    for(let i of this.objectDetails.columns){
      i.checked = false;
    }
    this.generateArrayData(element, identify);
  }

  // seleccionar todos los preciois según el servicio seleccionado
  selectedAllServices(item: any){
    this.filterPriceMaxActive = false;
    this.filterPriceMinActive = false;
    for(let head of this.objectDetails.columns){
      if(head.product == item.product){
        head.checked = true;
      }else{
        head.checked = false;
      }
    }
    this.checkedAllServices(item);
  }

  // seleccionar los precios del servicio mas barato
  selectedPriceMin(){
    this.filterPriceMaxActive = false;
    this.filterPriceMinActive = true;
    for(let i of this.objectDetails.columns){
      i.checked = false;
    }
    var totalMin = this.objectDetails.total[0].total;
    var data = this.objectDetails.total;
    let service = this.objectDetails.total[0].product;
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
  // seleccionar los precios del servicio más caro
  selectedPriceMax(){
    this.filterPriceMaxActive = true;
    this.filterPriceMinActive = false;
    for(let i of this.objectDetails.columns){
      i.checked = false;
    }
    var totalMax = this.objectDetails.total[0].total;
    var data = this.objectDetails.total;
    let service = this.objectDetails.total[0].product;
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
  // sleccionar todos los precios
  checkedAllServices(item: any){
    this.arrayData = [];
    this.objectDetails.data.forEach((e: any) =>{
      e.services.forEach((i: any) => {
        if(item.product == i.service){
          i.checked = true;
          if(i.price > 0){
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

  generateArrayData(element: any, identify: any){
    element.checked = true;
    this.arrayData[identify ] = {'identify': identify, 'quote_id': element.quote_id};
    let newArrayPrices = Object.values(this.arrayData);
    let countPricesSelected = newArrayPrices.length;
    // validar que exiten los precios de todlas las cotizaciones
    if(countPricesSelected == this.countQuotes){
      this.errorMessages = '';
    }
    console.log(this.arrayData);
  }

  onSubmit(){
    // convertir a un formato de array normal
    const _shipments = Object.values(this.arrayData);
    var data = {
      id_master: this.data._id,
      shipments: _shipments,
    }
    console.log(data);
    this.apiShipments.storeQuoteMassive(data).subscribe((e: any) => {
        if (e.result) {
          console.log(e);
          console.log(e.data)
          this.toastr.success(e.message, 'Cotización masiva', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Error', {
            timeOut: 3000,
            enableHtml: true
          });
          console.log(e.error);
        }
      },
      (error) => {
        console.log(error);
        let message = this.utils.getErrorMessage(error);
        this.toastr.error(message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
  
    );
  }
}
