import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

import { ProductsCreateComponent } from './create/create.component';
import { ProductsDetailsComponent } from './details/details.component';
import { ProductsUpdateComponent } from './update/update.component';
import { ProductsRestoreComponent } from './restore/restore.component';
import { ProductsDeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: []
})
export class ProductsComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'type', 'key', 'existence', 'status', 'details', 'update', 'restore', 'delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loading: boolean = true;
  dataDeleted: boolean = false;


  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'location',
    allowSearchFilter: true,
    enableCheckAll: false,
  };
  constructor(private apiProduct: ProductService, public dialog: MatDialog, private toastr: ToastrService) {
    /*

    this.filteredOptions = this.createForm.controls['name'].valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(val => {
        return this.filter(val || '')
      })
    );

    this.filteredOptionsUp = this.updateForm.controls['name'].valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(val => {
        return this.filter(val || '')
      })
    )*/
  }

  // filteredOptions: Observable<any[]>;
  // filteredOptionsUp: Observable<any[]>;

  /*filter(val: string): any[] {
    return this.listProductsServices.filter((s: any) => {
      return s.descripcion_producto.toLowerCase().includes(val.toLowerCase());
    });
  }*/
  selectedProductCreate(i: any) {
    /*this.createForm.get('name')?.setValue(i.descripcion_producto);
    this.createForm.get('key')?.setValue(i.clv_producto);
    this.filteredOptions = of([]);*/
  }
  selectedProductUpdate(i: any) {
    /*this.updateForm.get('name')?.setValue(i.descripcion_producto);
    this.updateForm.get('key')?.setValue(i.clv_producto);
    this.filteredOptionsUp = of([]);*/
  }
  changeDeleteData() {
    this.dataDeleted = !this.dataDeleted;
    this.loadGridData();
  }
  ngOnInit(): void {
    this.loadGridData();

  }


  loadGridData() {
    this.loading = true;
    this.apiProduct.getProducts(false, false, false, false, false, false, false, false, this.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        this.dataSource = new MatTableDataSource(e.data);
      }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(ProductsDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  openModalCreate() {
    const dialogRef = this.dialog.open(ProductsCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(ProductsUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(ProductsRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(ProductsDeleteComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
