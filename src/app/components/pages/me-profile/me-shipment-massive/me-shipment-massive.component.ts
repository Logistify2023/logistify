import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalConstants } from './../../../../common/global-constants';
import { MeQuotesMassiveCreateComponent } from './../me-quotes-massive/create/create.component';
import { DataTableConstants } from './../../../../common/datatables-constants';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MeShipmentMassiveDeleteComponent } from './delete/delete.component';
import { MeShipmentMassiveDetailsComponent } from './details/details.component';

@Component({
  selector: 'app-me-shipment-massive',
  templateUrl: './me-shipment-massive.component.html',
  styleUrls: []
})

// Exportamos nuestro compoenente
export class MeShipmentMassiveComponent implements OnInit, AfterViewInit {

  // Asignamos y declaramos las varianles a utilizar en este componente
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public urlEndPoint      = GlobalConstants.apiURL;
  public loading          : boolean   = true;
  public displayedColumns : string[]  = ['customer', 'products', 'progress', 'difference', 'updated_at', 'status', 'details', 'zip', 'delete'];
  public dataSource       : any       = new MatTableDataSource<any>();
  public disabledBtnZip     : boolean   = false;

  // Definimos los hijos para paginar y ordenar la información
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos en el constructor los servicio que utilizamos en este compoenete
  constructor(
    private apiMeQuotes: MeProfileService, 
    public dialog: MatDialog,
    private http: HttpClient,
    private toastr: ToastrService
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
    this.apiMeQuotes.getMeShipmentsMassive(true, true, '-updated_at').subscribe((e: any) => {
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

  // Create new shipment massive
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

  // Show details for shipment massive
  openModalDetails(id: any) {
    const dialogRef = this.dialog.open(MeShipmentMassiveDetailsComponent, {
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

  // Se encarga de descargar el ZIP de una guía
  downloadShipmentMassive(id: any, filename: string = "massive-shipment.zip") {
    this.disabledBtnZip = true;
    filename = "massive-shipment-" + id + "-customer.zip";
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/me-shipments-massives/download-zip/' + id, {headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', filename);
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

  // Delete one shipment massive
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(MeShipmentMassiveDeleteComponent, {
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