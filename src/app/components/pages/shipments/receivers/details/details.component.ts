import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ShipmentsService } from 'src/app/services/shipments.service';

@Component({
  selector: 'app-receivers-details',
  templateUrl: './details.component.html'
})
export class ReceiversDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['incidence', 'description', 'status'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ReceiversDetailsComponent>,
    private apiShipments: ShipmentsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiShipments.getReceivers(this.data._id, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        this.objectDetails.full_name = e.data.name + " " + e.data.surname + " " + e.data.lastname;
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
