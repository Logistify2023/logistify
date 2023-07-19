import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

import { SuppliesCreateComponent } from './create/create.component';
import { SuppliesDetailsComponent } from './details/details.component';
import { SuppliesUpdateComponent } from './update/update.component';
import { SuppliesRestoreComponent } from './restore/restore.component';
import { SuppliesDeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.component.html',
  styleUrls: []
})
export class SuppliesComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['invoice', 'business_name', 'products', 'date', 'amount', 'status', 'details', 'update', 'restore', 'delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loading: boolean = true;
  dataDeleted: boolean = false;


  dropdownSettings: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'business_name',
    allowSearchFilter: true,
    enableCheckAll: false,
  };

  dropdownSettings2: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    allowSearchFilter: true,
    enableCheckAll: false,
  };


  constructor(private apiProduct: ProductService, public dialog: MatDialog, private toastr: ToastrService) {
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
    let listData = [];
    this.apiProduct.getSupplies(true, true, this.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
        listData.forEach((i: any) => {
          i.business_name = (i.provider) ? i.provider.business_name : 'N/A';
          i.products = (i.products.length > 0) ? i.products[0].name : '';
        });
        this.dataSource = new MatTableDataSource(listData);
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
    const dialogRef = this.dialog.open(SuppliesDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  openModalCreate() {
    const dialogRef = this.dialog.open(SuppliesCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(SuppliesUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(SuppliesRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(SuppliesDeleteComponent, {
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
