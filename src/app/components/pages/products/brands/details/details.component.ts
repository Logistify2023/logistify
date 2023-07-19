import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './details.component.html'
})
export class BrandsDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  columsDetails_Products: string[] = ['name', 'key', 'existence', 'status'];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<BrandsDetailsComponent>,
    private apiProduct: ProductService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiProduct.getMarks(this.data._id, true, this.data.dataDeleted).subscribe((e: any) => {
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
