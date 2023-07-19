import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  templateUrl: './details.component.html'
})
export class BranchOfficesDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  columsDetails_Customers: string[] = ['rfc', 'business_name', 'type_custumer', 'status'];
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<BranchOfficesDetailsComponent>,
    private apiCustomer: CustomerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiCustomer.getBrandOffices(this.data._id, true, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
      } else {
        this.toastr.error(e.message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }
}
