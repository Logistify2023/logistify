import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Utils } from 'src/app/common/utils';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DataTableConstants } from './../../../../../common/datatables-constants';
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/common/global-constants';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-receivers-details',
  templateUrl: './details.component.html'
})

// Exportamos nuestro componente
export class MeShipmentDetailsComponent implements OnInit, AfterViewInit {

  // Asignamos y declaramos las varianles a utilizar en este componente
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public urlEndPoint      = GlobalConstants.apiURL;
  public loading          : boolean   = true;
  public disabledBtnPdf   : boolean   = false;
  public disabledBtnGuide : boolean   = false;
  public canceldBtnGuide  : boolean   = false;
  public panelOpenState   : boolean   = false;
  public dataToShip       : any;
  public objectDetails    : any       = {};
  public dataForPackages    : any       = new MatTableDataSource<any>();
  public columnsPackages    : string[] = ['type', 'long', 'width', 'high', 'weight', 'quantity', 'campaign', 'cost_center', 'content'];
  public dataForEvents      : any       = new MatTableDataSource<any>();
  public columnsEvents      : string[] = ['event', 'event_shipment', 'fecha'];
  public dataForIncidences  : any       = new MatTableDataSource<any>();
  public columnsIncidences  : string[] = ['incidence', 'incidence_shipment', 'created'];
  public dataForChargesAdd  : any       = new MatTableDataSource<any>();
  public columsChargesAdd   : string[] = ['service', 'price', 'by_search'];
  public dataForServicesAdd : any       = new MatTableDataSource<any>();
  public columsServicesAdd  : string[] = ['service', 'price', 'by_search'];

  // Definimos los hijos para paginar y ordenar la información de los paquetes
  @ViewChild(MatPaginator, {static: false}) paginatorPackages : MatPaginator;
  @ViewChild(MatSort) sortPackages: MatSort;
  // Definimos los hijos para paginar y ordenar la información de los paquetes
  @ViewChild(MatPaginator, {static: false}) paginatorEvents : MatPaginator;
  @ViewChild(MatSort) sortEvents: MatSort;
  // Definimos los hijos para paginar y ordenar la información de los paquetes
  @ViewChild(MatPaginator, {static: false}) paginatorIncidences : MatPaginator;
  @ViewChild(MatSort) sortIncidences: MatSort;
  // Definimos los hijos para paginar y ordenar la información de los paquetes
  @ViewChild(MatPaginator, {static: false}) paginatorCharges : MatPaginator;
  @ViewChild(MatSort) sortCharges: MatSort;
  // Definimos los hijos para paginar y ordenar la información de los paquetes
  @ViewChild(MatPaginator, {static: false}) paginatorServices : MatPaginator;
  @ViewChild(MatSort) sortServices: MatSort;



  // Definimos los servicios que utilizaremos en este componente
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeShipmentDetailsComponent>,
    private api_meShipment: MeProfileService,
    private http: HttpClient,
    public dialog: MatDialog,
    private utils: Utils,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Despues de cargar todo el sistema el paginados y ordenamiento
  ngAfterViewInit() {
    // Paginas para los packages
    this.dataForPackages.paginator = this.paginatorPackages;
    this.dataForPackages.sort = this.sortPackages;
    // Paginas para los eventos
    this.dataForEvents.paginator = this.paginatorEvents;
    this.dataForEvents.sort = this.sortEvents;
    // Paginas para los incidencias
    this.dataForIncidences.paginator = this.paginatorIncidences;
    this.dataForIncidences.sort = this.sortIncidences;
    // Paginas para los cargos adicionales
    this.dataForChargesAdd.paginator = this.paginatorCharges;
    this.dataForChargesAdd.sort = this.sortCharges;
    // Paginas para los servicios adicionales
    this.dataForServicesAdd.paginator = this.paginatorServices;
    this.dataForServicesAdd.sort = this.sortServices;
  }

  // Cargamos la información del envío
  ngOnInit(): void {
    this.loading = true;
    // Para almacenar a los paquetes
    let listData = [];
    this.api_meShipment.showMeShipments(this.data._id, true, true, true, true).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        // Asignamos la data a la variable general que tendra toda la data
        this.objectDetails = e.data;
        // Ahora asignamos a la varible que almancenara los paquetes
        this.dataForPackages.data = e.data.packages;
        // Ahora asignamos a la varible que almancenara los eventos
        this.dataForEvents.data = e.data.events;
        // Ahora asignamos a la varible que almancenara las incidencias
        this.dataForIncidences.data = e.data.incidences;
        // Ahora asignamos a la varible que almancenara los cargos adicionales
        this.dataForChargesAdd.data = e.data.charges;
        // Ahora asignamos a la varible que almancenara los servicios adicionales
        this.dataForServicesAdd.data = e.data.services;

        // Haciendo un pequeño retraso permite que se pueda ordena y paginar la información
        setTimeout(()=> {
          // Para cargar los ordenamientos de los packages
          this.dataForPackages.sort = this.sortPackages;
          // Para cargar los ordenamientos de los packages
          this.dataForEvents.sort = this.sortEvents;
          // Para cargar los ordenamientos de los packages
          this.dataForIncidences.sort = this.sortIncidences;
          // Para cargar los ordenamientos de los packages
          this.dataForChargesAdd.sort = this.sortCharges;
          // Para cargar los ordenamientos de los packages
          this.dataForServicesAdd.sort = this.sortServices;
        });
        setTimeout(()=> {
          // Para cargar los ordenamientos de los packages
          this.dataForPackages.paginator = this.paginatorPackages;
          // Para cargar los ordenamientos de los packages
          this.dataForEvents.paginator = this.paginatorEvents;
          // Para cargar los ordenamientos de los packages
          this.dataForIncidences.paginator = this.paginatorIncidences;
          // Para cargar los ordenamientos de los packages
          this.dataForChargesAdd.paginator = this.paginatorCharges;
          // Para cargar los ordenamientos de los packages
          this.dataForServicesAdd.paginator = this.paginatorServices;
        });
      } else {
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }
  
  // Se encarga de descargar el PDF de una guía
  downloadQuotePdf(id: any, filename: string = "cotizaciónPdf.pdf") {
    this.disabledBtnPdf = true;
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/quote/export-pdf/' + id, {headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.disabledBtnPdf = false;
      }
    )
  }

  // Se encarga de descargar la guia del envío
  downloadGuidePdf(id: any, filename: string = "guide.pdf") {
    this.disabledBtnGuide = true;
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    try {
      this.http.get(this.urlEndPoint + '/export/data/shipment/download/guide/' + id, {headers, responseType: 'blob' as 'json'}).subscribe(
        (response: any) => {
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          downloadLink.setAttribute('download', filename);
          document.body.appendChild(downloadLink);
          downloadLink.click();
          this.disabledBtnGuide = false;
        }
      )
    } catch (error) {
      this.toastr.warning("No se encotro la guia a descargar", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
    }
  }

  // Función que se encarga de cancelar una guia
  cancelGuide(id: number) {
    this.canceldBtnGuide = true;
    // Enviamos la data
    this.api_meShipment.cancelMeShipment(id).subscribe(
      (e: any) => {
        this.canceldBtnGuide = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.warning(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.toastr.error("No se logro cancelar la guia", 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }
}
