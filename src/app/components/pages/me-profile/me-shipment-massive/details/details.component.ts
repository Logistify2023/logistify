import { GlobalConstants } from './../../../../../common/global-constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DataTableConstants } from './../../../../../common/datatables-constants';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: [],
})

// Exportamos este componente
export class MeShipmentMassiveDetailsComponent implements OnInit {

  // Varibales para la tabla
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public urlEndPoint      = GlobalConstants.apiURL;
  public objectShipments  : any       = new MatTableDataSource<any>();
  public objectMassive      : any = {};
  public loading            : boolean = false;
  public disabledBtnCancel  : boolean   = false;
  public disabledBtnPdf     : boolean   = false;
  public disabledBtnDelete  : boolean   = false;
  public disabledBtnZip     : boolean   = false;
  public displayedColumns   : string[] = ['guide', 'producto', 'origen', 'destino', 'piezas', 'peso', 'estado'];
  
  // Definimos los hijos para paginar y ordenar la información
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos los servicios que utilizaremos
  constructor(
    private api_meShipment: MeProfileService,
    public dialogRef: MatDialogRef<MeShipmentMassiveDetailsComponent>,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private utils: Utils,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Despues de cargar todo el sistema el paginados y ordenamiento
  ngAfterViewInit() {
    this.objectShipments.paginator = this.paginator;
    this.objectShipments.sort = this.sort;
  }

  // Función que permite buscar en toda la información
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.objectShipments.filter = filterValue.trim().toLowerCase();
  }

  // Iniciamos cargando toda la información
  ngOnInit(): void {
    this.loading = true;
    let listData = [];
    this.api_meShipment.showMeShipmentForMassive(this.data._id, true, true, true, true, '-updated_at').subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        // Asiganamos la información a cada objecto
        this.objectMassive  = e.data.massive;
        listData            = e.data.shipments;
        listData.forEach((i: any) => {
          i.producto    = i.service.service;
          i.origen      = i.origin.postal_code + '-' + i.origin.state.substr(0, 3) + '-' + i.origin.settlement;
          i.destino     = i.destin.postal_code + '-' + i.destin.state.substr(0, 3) + '-' + i.destin.settlement;
          i.piezas      = i.quote_intern.pieces;
          i.peso        = i.quote_intern.weight_search;
          i.estado      = (i.statuse) ? i.statuse.state : "SIN ESTADO";
        });
        // Pasamos la información a la instancia de DataSource
        this.totalResult          = listData.length;
        this.objectShipments.data = listData;
        
        // Haciendo un pequeño retraso permite que se pueda ordena y paginar la información
        setTimeout(()=>this.objectShipments.sort = this.sort);
        setTimeout(()=>this.objectShipments.paginator = this.paginator);
      } else {
        this.dialogRef.close();
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }
  
  // Función que permite cancelar un envio masivo
  cancelShipmentMassive(id: number) {
    this.disabledBtnCancel = true;
    this.api_meShipment.cancelShipmentMassive(id).subscribe(
      (e: any) => {
        this.disabledBtnCancel = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        }
      },
      (error) => {
        this.disabledBtnCancel = false;
        let message = this.utils.getErrorMessage(error);
        this.toastr.error(message, 'Cancelado', {
          timeOut: 3000,
          enableHtml: true
        });
        this.dialogRef.close(true);
      }
    )
  }

  // Se encarga de descargar el PDF de una guía
  downloadMassivePdf(id: any, filename: string = "massive-shipment.pdf") {
    this.disabledBtnPdf = true;
    filename = "massive-shipment-" + this.objectMassive.customer?.slug + ".pdf";
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/me-shipments-massives/export-pdf/' + id, {headers, responseType: 'blob' as 'json'}).subscribe(
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

  // Función que se encarga de descargar el ZIP del masivo
  downloadMassiveZip(id: any, filezip: string = "massive-zip.zip") {
    this.disabledBtnZip = true;
    filezip = "massive-shipment-" + this.objectMassive.customer?.slug + ".zip";
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/me-shipments-massives/download-zip/' + id, {headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', filezip);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.disabledBtnZip = false;
      },
      (err: any) => {
        this.toastr.warning("No se logro descargar el ZIP, intentalo nuevamenta o refresca la página", 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    )
  }

  // Función que permite eliminar un envio masivo
  deleteShipmentMassive(id: number) {
    this.disabledBtnDelete = true;
    this.api_meShipment.deleteShipmentMassive(id).subscribe(
      (e: any) => {
        this.disabledBtnDelete = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        }
      },
      (error) => {
        this.disabledBtnDelete = false;
        let message = this.utils.getErrorMessage(error);
        this.toastr.error(message, 'Cancelado', {
          timeOut: 3000,
          enableHtml: true
        });
        this.dialogRef.close(true);
      }
    )
  }
}
