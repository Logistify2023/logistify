
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './details.component.html'
})
export class TypePricesDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  columsDetails_ProfileServices: string[] = ['profileService', 'service', 'status'];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TypePricesDetailsComponent>,
    private apiMessenger: MessengerService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiMessenger.getTypePrices(this.data._id, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        this.objectDetails.profile_services.forEach((i: any) => {
          i.profileService = i.profile.profile;
          i.service = (i.service) ? i.service.service : 'N/A';
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
