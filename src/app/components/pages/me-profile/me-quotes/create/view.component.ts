import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { Utils } from 'src/app/common/utils';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  templateUrl: './view.component.html'
})

export class MeQuoteViewComponent implements OnInit {

  public quoteDetails: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columsChargesAdd  : string[] = ['service', 'price', 'by_search'];
  columsServicesAdd : string[] = ['service', 'price', 'by_search'];
  columsPackages    : string[] = ['type', 'quantity', 'weight'];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeQuoteViewComponent>,
    private apiShipments: ShipmentsService,
    private api_meProfile: MeProfileService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Obtenemos la información de la cotización
  ngOnInit(): void {
    this.api_meProfile.showMeQuote(this.data._id, true, true, true, true).subscribe((e: any) => {
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