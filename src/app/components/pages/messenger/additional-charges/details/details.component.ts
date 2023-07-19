import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './details.component.html'
})

export class AdditionalChargesDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  columsDetails_Services: string[] = ['service', 'freight', 'fuel', 'guaranteed_delivery', 'sure', 'international', 'is_ltl', 'multi_piece', 'pickup', 'status'];
  columsDetails_ChargeType: string[] = ['additionable_type', 'additionable_id', 'price', 'created_at', 'updated_at'];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AdditionalChargesDetailsComponent>,
    private apiMessenger: MessengerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.apiMessenger.getAdditionalCharge(this.data._id, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
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