import { Component, OnInit, ViewChild } from '@angular/core';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { ReceiversCreateComponent } from './create/create.component';
import { ReceiversDetailsComponent } from './details/details.component';
import { ReceiversUpdateComponent } from './update/update.component';
import { ReceiversRestoreComponent } from './restore/restore.component';
import { ReceiversDeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-receivers',
  templateUrl: './receivers.component.html',
  styleUrls: []
})
export class ReceiversComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['business_name', 'full_name', 'email', 'phone', 'status', 'details', 'update', 'restore', 'delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadGridData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loading: boolean = true;
  dataDeleted: boolean = false;

  /*columsDetails_Shipments: DataGridColum[] = [{
    textField: 'Tipo envío',
    dataField: 'courier_type',
    isSort: true,
  }, {
    textField: 'Descripción',
    dataField: 'description',
    isSort: false
  }, {
    textField: 'Estado',
    dataField: 'status',
    isSort: true,
  }]*/

  constructor(private apiShipments: ShipmentsService, public dialog: MatDialog, private toastr: ToastrService) {
  }

  changeDeleteData() {
    this.dataDeleted = !this.dataDeleted;
    this.loadGridData();
  }
  ngOnInit(): void {
    this.loadGridData();
  }
  loadGridData() {
    let listData = [];
    this.loading = true;
    this.apiShipments.getReceivers(0, false, false, this.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
        listData.forEach((e: any) => {
          e.full_name = e.name + " " + e.surname + " " + e.lastname;
        });
        this.dataSource = new MatTableDataSource(listData);
        this.dataSource.data = listData;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = listData.length;
        });
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


  /* ACTIONS */
  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(ReceiversDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  openModalCreate() {
    const dialogRef = this.dialog.open(ReceiversCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(ReceiversUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(ReceiversRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(ReceiversDeleteComponent, {
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
