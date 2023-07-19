import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataTableConstants } from './../../../../../common/datatables-constants';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Utils } from 'src/app/common/utils';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-massive-details',
  templateUrl: './massive_shipments.component.html',
  styleUrls: [],
})

// Exportamos nuestro componente
export class MeQuotesMassiveShipmentsComponent implements OnInit, AfterViewInit {

  // Definimos las variables a utilizar
  public objectMassive      : any = {};
  public loading            : boolean = false;
  public disabledBtnCancel  : boolean   = false;
  public disabledBtnDelete  : boolean   = false;
  // Varibales para la tabla
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public columsShipments  : string[]  = ['producto', 'origen', 'destino', 'piezas', 'peso', 'estado'];
  public objectShipments  : any       = new MatTableDataSource<any>();

  // Definimos los hijos para paginar y ordenar la información
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos los servicios que utilizaremos
  constructor(
    private api_MeProfile: MeProfileService,
    public dialogRef: MatDialogRef<MeQuotesMassiveShipmentsComponent>,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private utils: Utils,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Despues de cargar todo el sistema el paginados y ordenamiento
  ngAfterViewInit() {
    this.objectShipments.paginator = this.paginator;
    this.objectShipments.sort      = this.sort;
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
    this.api_MeProfile.showMeQuotesForMassive(this.data._id, true, true, true, true, '-updated_at').subscribe((e: any) => {
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
          i.estado      = i.status;
        });
        // Pasamos la información a la instancia de DataSource
        this.totalResult          = listData.length;
        this.objectShipments.data = listData;
        console.log(this.totalResult);
        
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
  cancelQuoteMassive(id: number) {
    this.disabledBtnCancel = true;
    this.api_MeProfile.cancelQuoteMassive(id).subscribe(
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

  // Función que permite eliminar un envio masivo
  deleteQuoteMassive(id: number) {
    this.disabledBtnDelete = true;
    this.api_MeProfile.deleteQuoteMassive(id).subscribe(
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
