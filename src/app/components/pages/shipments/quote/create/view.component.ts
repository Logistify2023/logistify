import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { Utils } from 'src/app/common/utils';

@Component({
  templateUrl: './view.component.html'
})
export class ViewQuoteComponent implements OnInit {
  quoteDetails: any = {};
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columsChargesAdd:   string[] = ['service', 'price', 'by_search'];
  columsServicesAdd:  string[] = ['service', 'price', 'by_search'];
  columsPackages:     string[] = ['type', 'quantity', 'weight'];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ViewQuoteComponent>,
    private apiShipments: ShipmentsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiShipments.getQuote(this.data._id, false, false, false, false, false).subscribe((e: any) => {
      if (e.result) {
        this.quoteDetails = e.data;
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