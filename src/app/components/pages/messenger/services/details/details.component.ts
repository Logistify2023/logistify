import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';
import { GlobalConstants } from "../../../../../common/global-constants";

@Component({
  templateUrl: './details.component.html'
})
export class ServicesDetailsComponent implements OnInit {
  urlEndPoint: String = GlobalConstants.apiURL;
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  updatePriceChargeForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  columsDetails_Services: string[] = ['service', 'freight', 'fuel', 'guaranteed_delivery', 'sure', 'international', 'is_ltl', 'multi_piece', 'pickup', 'status'];
  columsDetails_AdditionalCharge: string[] = ['charge', 'price', 'status', 'update'];

  loadingUploadFile: boolean = false;
  linkExportGroups = "";
  linkExportZones = "";
  linkExportPrices = "";
  linkExportCosts = "";

  exportZonesAvailable = true;
  exportGroupsAvailable = true;
  exportPricesAvailable = true;
  exportCostsAvailable = true;
  id: number = this.data._id;

  listHeadersOrigin: any[] = [];
  listBodyOrigin: any[] = [];
  listHeadersDestin: any[] = [];
  listBodyDestin: any[] = [];

  groups_tab: boolean = true;
  groups_origin_tab: boolean = false;
  groups_destin_tab: boolean = false;

  buttonGroups: string = 'Groups';
  buttonGroupsOrigin: string = 'GroupsOrigin';
  buttonGroupsDestin: string = 'GroupsDestin';

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ServicesDetailsComponent>,
    private apiMessenger: MessengerService,
    public dialog: MatDialog,
    private utils: Utils,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
      this.updatePriceChargeForm = formBuilder.group({
        price: new FormControl('', [Validators.required]),
      })
  }

  ngOnInit(): void {
    this.apiMessenger.getServices(this.data._id, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        for(var item in this.objectDetails.additionables){
          this.objectDetails.additionables[item].editPrice = false;
        }
        let delivery_days: string = '';
        this.objectDetails.delivery_days.forEach((i: any) => {
            delivery_days += i.day + ', ';
        });
        this.objectDetails.guaranteed_delivery = (this.objectDetails.guaranteed_delivery) ? 'Si' : 'No';
        this.objectDetails.multi_piece = (this.objectDetails.multi_piece) ? 'Si' : 'No';
        this.objectDetails.international = (this.objectDetails.international) ? 'Si' : 'No';
        this.objectDetails.pickup = (this.objectDetails.pickup) ? 'Si' : 'No';
        this.objectDetails.is_ltl = (this.objectDetails.is_ltl) ? 'Si' : 'No';
        this.objectDetails.courier_type_stg = (this.objectDetails.courier_type) ? this.objectDetails.courier_type.courier_type : 'N/A';
        this.objectDetails.service_type_stg = (this.objectDetails.service_type) ? this.objectDetails.service_type.service_type : 'N/A';
        this.objectDetails.courier_stg = (this.objectDetails.courier) ? this.objectDetails.courier.courier : 'N/A';
        this.objectDetails.days = delivery_days;

        /* Groups */
        if (this.objectDetails.group) {
          if(this.objectDetails.group.by_separe == 1){
            this.groups_tab = false;
            this.groups_origin_tab = true;
            this.groups_destin_tab = true;
          
            // grupos de origen
            if(this.objectDetails.group.group_origin){
              this.objectDetails.group.group_origin.forEach((item: string) => {
                this.listHeadersOrigin.push(item);
              });

              this.objectDetails.group.file_origin.forEach((file: any) => {
                this.listBodyOrigin.push(Object.values(file));
              });
            }
            // grupos de destino
            if(this.objectDetails.group.group_destin){
              this.objectDetails.group.group_destin.forEach((item: string) => {
                this.listHeadersDestin.push(item);
              });
          
              this.objectDetails.group.file_destin.forEach((file: any) => {
                this.listBodyDestin.push(Object.values(file));
              });
            }
            // console.log(this.listHeadersOrigin)
          }else{
            this.objectDetails.group.data = {};
            let headers: string[] = [];
            if(this.objectDetails.group.group_origin){
              this.objectDetails.group.group_origin.forEach((item: string) => {
                headers.push(item);
              });
              this.objectDetails.group.data.headers = headers;
            }
            // console.log(headers)}
            let body: any = [];
            if(this.objectDetails.group.file_origin){
              this.objectDetails.group.file_origin.forEach((file: any) => {
                body.push(Object.values(file));
              });
              this.objectDetails.group.data.content = body;
            }
            // console.log('grupos' + this.objectDetails.group.data);
            // console.log(this.listHeadersOrigin)
          }
        }

        /* Zones */
        if (this.objectDetails.zone) {
          this.objectDetails.zone.data = {};
          if (this.objectDetails.zone.group_destin) {
            let headers: string[] = [];
            headers.push('ID');
            this.objectDetails.zone.group_destin.forEach((item: string) => {
              headers.push(item.toUpperCase());
            });
            this.objectDetails.zone.data.headers = headers;
          }
          let body: any = [];
          this.objectDetails.zone.group_origin.forEach((i: any) => {
            let row: any = [];
            row.push(i.toUpperCase());
            body.push(row);
          });
          this.objectDetails.zone.payload.forEach((payload: any) => {
            Object.values(payload).forEach((i: any) => {
              for (let j = 0; j < body.length; j++) {
                body[j].push(i[j]);
              }
            });
          });
          this.objectDetails.zone.data.content = body;
          //console.log(this.objectDetails.zone.data);
        }
        /* ZonesRemotes */
        if (this.objectDetails.remote) {
          this.objectDetails.remote.data = {};
          let headers: string[] = [];
          headers.push('Zonas remotas');
          this.objectDetails.remote.data.headers = headers;
          if (this.objectDetails.remote.file) {
            let body: any = [];
            this.objectDetails.remote.file.forEach((item: any) => {
              body.push(Object.values(item)[0]);
            });
            this.objectDetails.remote.data.content = body;
          }
          // console.log(this.objectDetails.remote.data);
        }

        /* Precios */
        if (this.objectDetails.price) {
          this.objectDetails.price.data = {};
          if (this.objectDetails.price.file) {
            let headers: string[] = [];
            let body: any = [];
            headers.push(' ');
            this.objectDetails.price.zones.forEach((item: any) => {
              headers.push(item);
            });

            for (let i = 0; i < this.objectDetails.price.kg.length; i++) {
              let row: any = [];
              row.push(this.objectDetails.price.kg[i]);
              let t = 0;
              Object.values(this.objectDetails.price.file[i]).forEach((file: any) => {
                if (t > 0) {
                  row.push(file);
                }
                t++;
              });

              body.push(row);
            }
            this.objectDetails.price.data.content = body;
            this.objectDetails.price.data.headers = headers;
          }
          //console.log(this.objectDetails.price.data);
        }

        /* Costos */
        if (this.objectDetails.cost) {
          this.objectDetails.cost.data = {};
          if (this.objectDetails.cost.file) {
            let headers: string[] = [];
            let body: any = [];
            headers.push(' ');
            this.objectDetails.cost.zones.forEach((item: any) => {
              headers.push(item);
            });

            for (let i = 0; i < this.objectDetails.cost.kg.length; i++) {
              let row: any = [];
              row.push(this.objectDetails.cost.kg[i]);
              let t = 0;
              Object.values(this.objectDetails.cost.file[i]).forEach((file: any) => {
                if (t > 0) {
                  row.push(file);
                }
                t++;
              });
              body.push(row);
            }
            this.objectDetails.cost.data.content = body;
            this.objectDetails.cost.data.headers = headers;
          }
          //console.log(this.objectDetails.cost.data);
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

  /* Couries Zones */
  importZones(event: any) {
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
      this.apiMessenger.importServicesZones(formData, this.data._id).subscribe(
        (e: any) => {
          this.loadingUploadFile = false;
          if (e.result) {
            this.toastr.success(e.message, 'Gastos', {
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
  importZonesRemotes(event: any) {
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
      this.apiMessenger.importServicesZonesRemotes(formData, this.data._id).subscribe(
        (e: any) => {
          this.loadingUploadFile = false;
          if (e.result) {
            this.toastr.success(e.message, 'Gastos', {
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

  /* Couries Groups */
  importGroups(event: any, group: any) {
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
      let url;
      if(group == 'Groups'){
        url = this.apiMessenger.importServicesGroups(formData, this.data._id);
      }else{
        url = this.apiMessenger.importServicesGroupsSepared(formData, this.data._id, group);    
      }

      url.subscribe(
        (e: any) => {
          this.loadingUploadFile = false;
          if (e.result) {
            this.toastr.success(e.message, 'Gastos', {
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
  /* Couries Prices */
  importPrices(event: any) {
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
      this.apiMessenger.importServicesPrices(formData, this.data._id).subscribe(
        (e: any) => {
          this.loadingUploadFile = false;
          if (e.result) {
            this.toastr.success(e.message, 'Gastos', {
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
  /* Couries Costs */
  importCosts(event: any) {
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
      this.apiMessenger.importServicesCosts(formData, this.data._id).subscribe(
        (e: any) => {
          this.loadingUploadFile = false;
          if (e.result) {
            this.toastr.success(e.message, 'Gastos', {
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

  // actualizar el precio de loas  cargois adicionales
  editPriceAdditionalCharge(item: any){
    item.editPrice = true;
  }

  updatePriceAdditionalCharge(item: any){
    item.editPrice = false;
    this.submittedForm = true;
    const form = this.updatePriceChargeForm;
    if (form.invalid) {
      this.toastr.error('El campo precio es requerido');
      return;
    }
    const data = {
      price: form.get('price')?.value,
    }

    this.apiMessenger.updateChargeService(item.id, data).subscribe((e: any) =>{
      this.submittedForm = false;
      if(e.result){
        this.toastr.success(e.message, 'Actualizado exitosamente', {
          timeOut: 3000,
          enableHtml: true
        });
        this.ngOnInit();
        this.updatePriceChargeForm.get('price')?.setValue('');
      }else{
        this.toastr.error(e.message, 'Error al actualizar', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    })
  }
}
