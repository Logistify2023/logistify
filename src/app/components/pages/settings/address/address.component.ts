import { MatSort } from '@angular/material/sort';
import { DataTableConstants } from './../../../../common/datatables-constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { AddressCreateComponent } from './create/create.component';
import { AddressDeleteComponent } from './delete/delete.component';
import { AddressDetailsComponent } from './details/details.component';
import { AddressUpdateComponent } from './update/update.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: []
})

export class AddressComponent implements OnInit {

  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public loading          : boolean   = false;
  public showTable        : boolean   = false;
  public dataDeleted      : boolean   = false;
  public displayedColumns : string[]  = ['postal_code', 'settlement', 'settlement_type', 'municipality', 'city', 'zone', 'estado', 'details', 'update', 'delete'];
  public dataSource       : any       = new MatTableDataSource<any>();
  // Definimos las variables para poder filtrar la información
  public state:         string = '';
  public listStates:    any = [];
  public municipality:  string = '';
  public listMunicips:  any = [];
  public settlement:    string = '';
  public listSettlems:  any = [];
  public city:          string = '';
  public listCitys:     any = [];
  public postal_code:   string = '';

  // Definimos los hijos para paginar y ordenar la información
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Definimos los servicios a utilizar en este componente
  constructor(
    private apiAddress: UtilsService,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

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

  // Detecta cuando cambia la información
  changeDeleteData() {
    this.dataDeleted = !this.dataDeleted;
  }

  // Inicia cargando los servicios
  ngOnInit(): void {
    // Obtenemos la lista de códigos postales
    this.getStatesByService();
  }

  // Se encarga de obtener los estados
  getStatesByService() {
    this.apiAddress.getStates().subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
        this.listStates = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener los estados correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }
  
  // Se encarga de obtener los municipios de un estado
  getMuncipalityByService() {
    this.municipality = '';
    this.settlement = '';
    this.apiAddress.getMunicipalities(this.state).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
        this.listMunicips = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener los municipios correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  // Se encarga de obtener las ciudades de un estado del servicio
  getCitysByService() {
    this.city = '';
    this.apiAddress.getCities(this.state).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
        this.listCitys = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las ciudades correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  // Se encarga de obtener los asentamientos de un estado y municipio del servicio
  getSettlementsByService() {
    this.settlement = '';
    this.apiAddress.getSettlements(this.state, this.municipality).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
        this.listSettlems = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las colonias correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  // Se encarga de traer los las colonias mediante el código postal
  getSettlementsByPostalCode() {
    if(!parseInt(this.postal_code)) {
      this.toastr.warning("EL código postal tiene que ser un número", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
      this.postal_code = "";
      return;
    }
    // Para cargar información
    this.showTable = true;
    this.loading = true;
    // Consumimos el servicio web
    this.apiAddress.getAddressByPostalCode(this.postal_code).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
        this.listSettlems = e.data;
        // Asignamos la información a la tabla
        this.processDataForTable(e.data);
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las colonias correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  // Se encarga de obtener la información por los filtros aplicados
  getAddressByFilters() {
    this.showTable = true;
    this.loading = true;
    this.apiAddress.getAddressByFilters(this.state, this.municipality, this.settlement).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
        this.listSettlems = e.data;
        // Asignamos la información a la tabla
        this.processDataForTable(e.data);
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las direcciones correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Se encarga de pasar la data a la tabla correspondiente
  processDataForTable(data: any) {
    // Pasamos la data a la tabla correspondiente
    this.dataSource.data  = data;
    // Asignamos le valor del total de registros
    this.totalResult      = data.length;
    // Hacemos un pequeño retraso para procesar la información
    setTimeout(()=>this.dataSource.sort = this.sort);
    setTimeout(()=>this.dataSource.paginator = this.paginator);
    this.loading = false;
  }

  // Esta se ejecuta cada para resear el compoennete
  resetVariables() {
    this.showTable = false;
    this.state = '';
    this.municipality = '';
    this.postal_code = '';
  }

  // Show details for address
  openModalDetails(id: number) {
    this.dialog.open(AddressDetailsComponent, {
      width: '80vw',
      data: { _id: id },
      disableClose: true
    });
  }

  // Create address
  openModalCreate() {
    const dialogRef = this.dialog.open(AddressCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.resetVariables();
      }
    });
  }

  // Update address
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(AddressUpdateComponent, {
      width: '80vw',
      data: { _id: id },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.resetVariables();
      }
    });
  }

  // Delete address
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(AddressDeleteComponent, {
      data: { _id: id },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resetVariables();
      }
    });
  }
}