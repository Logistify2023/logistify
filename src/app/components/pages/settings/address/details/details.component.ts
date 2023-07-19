import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GlobalConstants } from './../../../../../common/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableConstants } from './../../../../../common/datatables-constants';
import { UtilsService } from 'src/app/services/utils.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: [],
})

// Exportamos este componente
export class AddressDetailsComponent implements OnInit {

  // Varibales para la tabla
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public urlEndPoint      = GlobalConstants.apiURL;
  public displayedColumns   : string[] = ['street', 'suburb', 'location', 'reference', 'interior_number', 'outdoor_number', 'status'];
  public objectAddresses  : any       = new MatTableDataSource<any>();
  public objectDetails: any = {};
  
  // Definimos las variables a utilizar
  errorMessages: string = '';
  dataDeleted: boolean = false;
  loading: boolean = false;
  arrayData: any = [];
  serviceSelected: string = '';
  countQuotes: number = 0;
  filterPriceMinActive: boolean = false;
  filterPriceMaxActive: boolean = false;

  // Definimos los hijos para paginar y ordenar la información
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos los servicios que utilizaremos
  constructor(
    private apiAddress: UtilsService,
    public dialogRef: MatDialogRef<AddressDetailsComponent>,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Despues de cargar todo el sistema el paginados y ordenamiento
  ngAfterViewInit() {
    this.objectAddresses.paginator = this.paginator;
    this.objectAddresses.sort = this.sort;
  }

  // Función que permite buscar en toda la información
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.objectAddresses.filter = filterValue.trim().toLowerCase();
  }

  // Iniciamos cargando toda la información
  ngOnInit(): void {
    this.loading = true;
    let listData = [];
    this.apiAddress.addressShow(this.data._id).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        // Asignamos la información de la dirección
        this.objectDetails  = e.data;
        // Pasamos la información de las direcciones asociadas a la direccion
        listData            = e.data.addressables;
        // Pasamos la información a la instancia de DataSource
        this.totalResult          = listData.length;
        this.objectAddresses.data = listData;
        
        // Haciendo un pequeño retraso permite que se pueda ordena y paginar la información
        setTimeout(()=>this.objectAddresses.sort = this.sort);
        setTimeout(()=>this.objectAddresses.paginator = this.paginator);
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
}