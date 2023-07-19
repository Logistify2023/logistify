import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';
import { GroupUpdateComponent } from './update/update.component';
import { GroupDetailsComponent } from './details/details.component';
import { DataTableConstants } from 'src/app/common/datatables-constants';

@Component({
  selector: 'app-services-group',
  templateUrl: './services-group.component.html',
  styleUrls: [],
})

// Exportamos nuestro componente
export class ServicesGroupComponent implements OnInit, AfterViewInit {

  // Definimos las variables a utilizar
  // Asignamos y declaramos las varianles a utilizar en este componente
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public paginarColor     = "warn";
  public dataSource       = new MatTableDataSource<any>();
  public displayedColumns:  string[] = ['service', 'status', 'created_at', 'updated_at', 'details', 'add'];
  public loading:           boolean = true;
  public submittedForm:     boolean = false;
  public errorMessages:     string = '';

  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos los servicios a utilizar en el componente
  constructor(
    private apiMessenger: MessengerService,
    private utils: Utils,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

  // Actualizar los datos correctamente
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Cargamos la data en el compoenente
  ngOnInit(): void {
    this.loadGridData();
  }

  // Obtenemos la información del servicio
  loadGridData() {
    this.loading = true;
    let listData = [];
    this.apiMessenger.serviceGroupIndex().subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
        this.totalResult     = listData.length;
        this.dataSource.data = listData;
        setTimeout(()=>this.dataSource.sort = this.sort);
        setTimeout(()=>this.dataSource.paginator = this.paginator);
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

  // Carga los detalles del producto
  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(GroupDetailsComponent, {
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

  // Carga el para agregar cps al producto
  openModalUpdate(id: any) {
    const dialogRef = this.dialog.open(GroupUpdateComponent, {
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