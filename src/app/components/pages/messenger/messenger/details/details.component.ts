import { Component, Inject, OnInit, ViewChild } from '@angular/core';
// import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';
import { Utils } from 'src/app/common/utils';
import { GlobalConstants } from "../../../../../common/global-constants";
import { FormBuilder } from '@angular/forms';

@Component({
  templateUrl: './details.component.html'
})

export class MessengerDetailsComponent implements OnInit {
  urlEndPoint: String = GlobalConstants.apiURL;
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  errorMessages: string = '';

  columsDetails_CourierTypes: string[] = ['courier_type', 'description', 'status'];
  columsDetails_WebServices: string[] = ['service', 'url', 'host', 'port', 'date', 'user', 'license', 'status'];
  columsDetails_Services: string[] = ['service', 'freight', 'fuel', 'international', 'is_ltl', 'multi_piece', 'status'];

  loadingUploadFile: boolean = false;
  linkExportGroups = "";
  linkExportZones = "";
  linkExportPrices = "";
  linkExportCosts = "";
  id: number = this.data._id;

  listHeadersAdditional: any[] = [];
  listBodyAdditional: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MessengerDetailsComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    public dialog: MatDialog,
    private utils: Utils,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.apiMessenger.getCouriers(this.data._id, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        /* DIAS ADICIONALES */
        if (this.objectDetails.additional) {
          this.objectDetails.additional.data = {};
          if (this.objectDetails.additional.columns) {
            
            let headers: string[] = [];
            this.objectDetails.additional.columns.forEach((item: string) => {
              headers.push(item.toUpperCase());
            });
            this.objectDetails.additional.data.headers = headers;
          }
          let body: any = [];
          this.objectDetails.additional.file.forEach(() => {
            let row: any = [];
            body.push(row);
          });
          this.objectDetails.additional.payload.forEach((payload: any) => {
            Object.values(payload).forEach((i: any) => {
              for (let j = 0; j < body.length; j++) {
                body[j].push(i[j]);
              }
            });
          });
          
          this.objectDetails.additional.data.content = body;
        }
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

  importAdditional(event: any){
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      var formData: any = new FormData();
      formData.append("file", file);
      formData.append("name", this.utils.createRamdomString(8));

      this.loadingUploadFile = true;
      this.apiMessenger.importAdditionaldays(this.data._id, formData).subscribe(
        (e: any) => {
          this.loadingUploadFile = false;
          if (e.result) {
            this.toastr.success(e.message, 'Success', {
              timeOut: 3000,
              enableHtml: true
            });
          } else {
            this.toastr.error(e.message, 'Error', {
              timeOut: 3000,
              enableHtml: true
            });
          }
        },
        (error) => {
          this.loadingUploadFile = false;
          let message = this.utils.getErrorMessage(error);
          this.toastr.error(message, 'Error', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      );
    }
  }
}