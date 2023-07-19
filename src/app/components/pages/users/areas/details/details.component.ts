import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-status-details',
  templateUrl: './details.component.html'
})

export class AreasDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['courier_type', 'description', 'status'];
  columsDetails_Users: string[] = ['fullname', 'username', 'email', 'phone', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AreasDetailsComponent>,
    private apiCustomer: CustomerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.apiCustomer.getAreasByID(this.data._id, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        this.objectDetails.responsable.forEach((i: any) => {
          i.fullname = i.name + " " + i.lastname + " " + i.surname;
        });
        this.objectDetails.members.forEach((i: any) => {
          i.fullname = i.name + " " + i.lastname + " " + i.surname;
        });
        this.objectDetails.users.forEach((i: any) => {
          i.fullname = i.name + " " + i.lastname + " " + i.surname;
        });
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