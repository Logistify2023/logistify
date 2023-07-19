import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';
import { DataTableConstants } from 'src/app/common/datatables-constants';

@Component({
  selector: 'app-services-fuel',
  templateUrl: './services-fuel.component.html',
  styleUrls: [],
})

// Exportamos el componente
export class ServicesFuelComponent implements OnInit, AfterViewInit {

  // Asignamos y declaramos las varianles a utilizar en este componente
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public paginarColor     = "warn";
  public dataSource       = new MatTableDataSource<any>();
  public updateServiceFuelForm: FormGroup;
  public displayedColumns:      string[] = ['service', 'status', 'created_at', 'updated_at', 'fuel', 'update'];
  public loading:               boolean = true;
  public submittedForm:         boolean = false;
  public errorMessages:         string = '';

  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  // Definimos los servicios a utilizar en este componente
  constructor(
    private apiMessenger: MessengerService,
    private utils: Utils,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { 
    this.updateServiceFuelForm = formBuilder.group({
      fuel: new FormControl('', [Validators.required]),
    });
  }

  // Refrescar la data correspondiente
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Cargamos la información en nuestro componente
  ngOnInit(): void {
    this.loadGridData();
  }

  // Obtenemos la información de nuestro servicio
  loadGridData() {
    this.loading = true;
    let listData = [];
    this.apiMessenger.getServiceFuel(0, false, false, false).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
        for(var item in listData) {
          listData[item].editFuel = false;
        }
        this.totalResult = listData.length;
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

  // Cambia el check para saber cuando editar una fila
  editServiceFuel(item: any) {
    item.editFuel = true;
    this.updateServiceFuelForm.get('fuel')?.setValue('');
  }

  // Cierra el form de la edición de una fila
  cancelEditFuel(item: any) {
    item.editFuel = false;
  }

  // Actualiza el porcentaje en nuestro servicio
  updateServiceFuel(item: any) {
    item.editFuel = false;
    const form = this.updateServiceFuelForm;
    this.submittedForm = true;
    if(form.invalid) {
      this.toastr.warning('Campo no valido', 'Advertencia');
      return;
    }
    // Armamos el objecto a enviar
    var data = {
      id: item.id,
      fuel: form.get('fuel')?.value,
    }
    this.loading = true;
    // Pasamos la data a nuestro servicio
    this.apiMessenger.updateServiceFuel(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true
          });
          this.loadGridData();
        } else {
          this.toastr.error(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}