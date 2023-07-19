import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

import { UnitsCreateComponent } from './create/create.component';
import { UnitsDetailsComponent } from './details/details.component';
import { UnitsUpdateComponent } from './update/update.component';
import { UnitsRestoreComponent } from './restore/restore.component';
import { UnitsDeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: []
})
export class UnitsComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['measure_unit', 'description', 'status', 'details', 'update', 'restore', 'delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loading: boolean = true;
  dataDeleted: boolean = false;

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
    this.apiProduct.getMeasureUnits(this.dataDeleted).subscribe((e: any) => {
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
    const dialogRef = this.dialog.open(UnitsDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  openModalCreate() {
    const dialogRef = this.dialog.open(UnitsCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(UnitsUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(UnitsRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(UnitsDeleteComponent, {
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
