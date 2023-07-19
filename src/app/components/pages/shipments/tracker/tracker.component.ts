import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableConstants } from './../../../../common/datatables-constants';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';
import { TrackingComponent } from './track/tracking.component';
import { MeShipmentDetailsComponent } from '../../me-profile/me-shipment/details/details.component';
@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: []
})

// Export component 
export class TrackerComponent implements OnInit, AfterViewInit {

  // Asignamos y declaramos las varianles a utilizar en este componente
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public loading          : boolean   = true;
  public displayedColumns : string[]  = ['guide', 'cliente', 'producto', 'estado', 'created_at', 'updated_at', 'details'];
  public dataSource       : any       = new MatTableDataSource<any>();
  
  // Definimos los hijos para paginar y ordenar la información
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos en el constructor los servicio que utilizamos en este compoenete
  constructor(
    private api_Tracking: TrackingService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  // Iniciamos cargando la información
  ngOnInit(): void {
    this.loadGridData();
  }

  // Despues de cargar todo asignamos el paginador y ordenamiento
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  // Función que permite buscar en toda la información
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  // Función que se encarga de consumir el servicio para traer la información
  loadGridData() {
    this.loading = true;
    let listData = [];
    this.api_Tracking.getTracking('-updated_at').subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
        listData.forEach((i: any) => {
          i.cliente     = i.customer.business_name;
          i.producto    = i.service.service;
          i.peso        = i.quote_intern.weight_search;
          i.estado      = (i.statuse) ? i.statuse.state : "SIN ESTADO";
        });
        // Pasamos la información a la instancia de DataSource
        this.totalResult      = listData.length;
        this.dataSource.data  = listData;
        // Haciendo un pequeño retraso permite que se pueda ordena y paginar la información
        setTimeout(()=>this.dataSource.sort = this.sort);
        setTimeout(()=>this.dataSource.paginator = this.paginator);
      } else {
        this.toastr.warning(e.message, 'Advertencia', {
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

  // Show modal for track
  openModalTrack() {
    const dialogRef = this.dialog.open(TrackingComponent, {
      disableClose: true,
      data: { _id: 1 },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGridData();
      }
    });
  }

  // Show details for one shipmente
  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(MeShipmentDetailsComponent, {
      width: '80vw',
      data: { _id: id },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGridData();
      }
    });
  }

}
