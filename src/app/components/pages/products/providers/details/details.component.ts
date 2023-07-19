import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './details.component.html'
})
export class ProvidersDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  columsDetails_Supplies: string[] = ['invoice', 'date', 'amount', 'product_name', 'status'];
  columsDetails_Addressables: string[] = ['description', 'street', 'suburb', 'outdoor_number', 'interior_number', 'location', 'reference'];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProvidersDetailsComponent>,
    private apiProduct: ProductService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.apiProduct.getProviderByID(this.data._id, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        this.objectDetails.postal_code = (this.objectDetails.addressables) ? this.objectDetails.addressables[0].address.postal_code : 'N/A';
        this.objectDetails.suburb = (this.objectDetails.addressables) ? this.objectDetails.addressables[0].suburb : 'N/A';
        this.objectDetails.location = (this.objectDetails.addressables) ? this.objectDetails.addressables[0].location : 'N/A';
        this.objectDetails.reference = (this.objectDetails.addressables) ? this.objectDetails.addressables[0].reference : 'N/A';
        this.objectDetails.street = (this.objectDetails.addressables) ? this.objectDetails.addressables[0].street : 'N/A';
        this.objectDetails.outdoor_number = (this.objectDetails.addressables) ? this.objectDetails.addressables[0].outdoor_number : 'N/A';
        this.objectDetails.interior_number = (this.objectDetails.addressables) ? this.objectDetails.addressables[0].interior_number : 'N/A';

        this.objectDetails.supplies.forEach((i: any) => {
          i.product_name = (i.products) ? i.products[0].name : 'N/A';
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
