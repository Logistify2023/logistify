import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ShipmentsService } from 'src/app/services/shipments.service';

@Component({
  selector: 'app-receivers-details',
  templateUrl: './details.component.html'
})
export class QuoteDetailsComponent implements OnInit {
  urlEndPoint: String = GlobalConstants.apiURL;
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  displayedColumns_Payload: string[] = ['type', 'long', 'width', 'high', 'weight'];
  displayedColumns_Products: string[] = ['key', 'name', 'type', 'existence', 'status'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<QuoteDetailsComponent>,
    private apiShipments: ShipmentsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiShipments.getQuote(this.data._id, true, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        // console.log(this.objectDetails)}
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
