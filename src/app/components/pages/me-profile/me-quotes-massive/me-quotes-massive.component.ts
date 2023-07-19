import { MeQuotesMassiveShipmentsComponent } from 'src/app/components/pages/me-profile/me-quotes-massive/shipments/massive_shipments.component';
import { DataTableConstants } from './../../../../common/datatables-constants';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MeQuotesMassiveCreateComponent } from './create/create.component';
import { MeQuotesMassiveDeleteComponent } from './delete/delete.component';
import { MeQuotesMassiveDetailsComponent } from './details/details.component';

@Component({
  selector: 'app-me-quotes-massive',
  templateUrl: './me-quotes-massive.component.html',
  styleUrls: []
})

// Exportamos nuestro compoenente
export class MeQuotesMassiveComponent implements OnInit, AfterViewInit {
  
  // Asignamos y declaramos las varianles a utilizar en este componente
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public loading          : boolean   = true;
  public displayedColumns : string[]  = ['customer', 'products', 'rows', 'transactions', 'progress', 'difference', 'quote_start', 'status', 'details', 'shipments', 'delete'];
  public dataSource       : any       = new MatTableDataSource<any>();

  // Definimos los hijos para paginar y ordenar la información
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos en el constructor los servicio que utilizamos en este compoenete
  constructor(
    private apiMeQuotes: MeProfileService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

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
    this.apiMeQuotes.getMeQuotesMassive(true, true, '-updated_at').subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
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

  // Show details for quote massive 
  openModalCreate() {
    const dialogRef = this.dialog.open(MeQuotesMassiveCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGridData();
      }
    });
  }

  // Show prices for quote massive
  openModalDetails(id: any) {
    const dialogRef = this.dialog.open(MeQuotesMassiveDetailsComponent, {
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

  // Show shipments for one massive
  openModalShipments(id: any) {
    const dialogRef = this.dialog.open(MeQuotesMassiveShipmentsComponent, {
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

  // Delete one quote massive
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(MeQuotesMassiveDeleteComponent, {
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