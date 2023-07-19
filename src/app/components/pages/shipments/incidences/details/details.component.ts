import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ShipmentsService } from 'src/app/services/shipments.service';

@Component({
  selector: 'app-incidences-details',
  templateUrl: './details.component.html'
})
export class IncidencesDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource_IncidencesType = new MatTableDataSource<any>();
  dataSource_Shipments = new MatTableDataSource<any>();

  columsDetails_IncidencesType: string[] = ['incidence_type', 'description', 'status']
  columsDetails_Shipments: string[] = ['guide', 'track', 'status']

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource_IncidencesType.paginator = this.paginator;
    this.dataSource_Shipments.paginator = this.paginator;
  }

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<IncidencesDetailsComponent>,
    private apiShipments: ShipmentsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiShipments.getIncidences(this.data._id, true, true, this.data.dataDeleted).subscribe((e: any) => {
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
