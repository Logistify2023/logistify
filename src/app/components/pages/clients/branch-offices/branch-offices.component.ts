import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

import { BranchOfficesCreateComponent } from './create/create.component';
import { BranchOfficesDetailsComponent } from './details/details.component';
import { BranchOfficesUpdateComponent } from './update/update.component';
import { BranchOfficesRestoreComponent } from './restore/restore.component';
import { BranchOfficesDeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-branch-offices',
  templateUrl: './branch-offices.component.html',
  styleUrls: []
})
export class BranchOfficesComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['branch_office', 'branch_office_type_name', 'status', 'details', 'update', 'restore', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loading: boolean = true;
  dataDeleted: boolean = false;

  constructor(private apiCustomer: CustomerService, public dialog: MatDialog, private toastr: ToastrService) {
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
    this.apiCustomer.getBrandOffices(0, false, true, false, false, this.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
        listData.forEach((i: any) => {
          i.branch_office_type_name = (i.branch_office_type) ? i.branch_office_type.branch_type : '';
        });
        this.dataSource = new MatTableDataSource(listData);
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

  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(BranchOfficesDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  openModalCreate() {
    const dialogRef = this.dialog.open(BranchOfficesCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(BranchOfficesUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(BranchOfficesRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(BranchOfficesDeleteComponent, {
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
