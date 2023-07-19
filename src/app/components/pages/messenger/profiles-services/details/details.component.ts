import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';
import { GlobalConstants } from "../../../../../common/global-constants";

@Component({
  templateUrl: './details.component.html'
})
export class ProfilesServicesDetailsComponent implements OnInit {
  urlEndPoint: String = GlobalConstants.apiURL;
  formService: FormGroup;
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  columsDetails_Customers: string[] = ['business_name', 'type_custumer', 'status'];
  displayedColumns: string[] = ['Services', 'status', 'type_price', 'porcentaje'];
  loadingUploadFile:      boolean = false;
  loading:                boolean = true;
  submittedForm:          boolean = false;
  dataDeleted:            boolean = false;
  listTypePrices:         any[] = [];
  listServices:           any[] = [];
  allServices:            any[] = [];
  serviceProfile:         any[] = [];
  listServiceContentFile: any[] = [];
  dataPriceService:       any = {};
  fileRequired      = false;
  hiddenForm        = true;
  isChangePrice     = false;
  urlIdService      = true;
  urlIdRegister     = true;
  errorMessages:  string = '';
  actionService?: string;
  idService:      number;
  service_file?:  any;
  // id_service:     number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProfilesServicesDetailsComponent>,
    private apiMessenger: MessengerService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private utils: Utils,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    this.formService = formBuilder.group({
      service_id: new FormControl('', [Validators.required]),
      type_price_id: new FormControl('', [Validators.required]),
      porcentaje: new FormControl('', []),
      status: new FormControl('', []),
    });
  }
  
  ngOnInit(): void {
    this.hiddenForm = true;
    this.apiMessenger.getTypePrices(0, false, false).subscribe((e: any) => {
      this.listTypePrices = e.data;
    });
    this.apiMessenger.getServices(0).subscribe((e: any) => {
      this.allServices = e.data;
    });

    this.loading = true
    this.apiMessenger.getProfilesServices(this.data._id, true, true, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        this.objectDetails = e.data;
        let array_service: any[] = [];
        e.data.profile_services.forEach((i: any) => {
          if(i.type_price.is_file == 1){
            array_service.push(i);
          }
        });
        array_service.filter((item, index)=>{
            return array_service.indexOf(item) === index;
        });
        this.listServiceContentFile = array_service;
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

  defineActionService(){
    this.hiddenForm = false;
    this.isChangePrice = false;
    this.formService.get('service_id')?.setValue('');
    this.formService.get('type_price_id')?.setValue('');
    this.formService.get('porcentaje')?.setValue('');
    if(this.actionService == 'createService') {
      this.listServices = this.allServices;
    }else{
      this.apiMessenger.getProfilesServices(this.data._id, true, true, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
        if (e.result) {
          this.listServices = e.data.profile_services;
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

  changeService(){
    const servicio = this.formService.get('service_id')?.value;
    var filterService = this.objectDetails.profile_services.filter(function(service: any) {
      return service.id === servicio;
    });
    if(this.actionService == 'editService' || this.actionService == 'deleteService') {
      filterService.forEach((i: any) =>{
        this.formService.get('type_price_id')?.setValue(i.type_price_id);
        this.formService.get('porcentaje')?.setValue(i.percentaje);
        this.formService.get('status')?.setValue((i.status == 'DISPONIBLE') ? true : false)
      })
      this.changeTypePrice();
    }else{
      this.formService.get('type_price_id')?.setValue('');
      this.isChangePrice = false;
    }
  }

  changeTypePrice() {
    this.isChangePrice = true;
    this.apiMessenger.getTypePrices(this.formService.get('type_price_id')?.value, false, false).subscribe((e: any) => {
      this.fileRequired = (e.data.is_file) ? true : false;
      if(this.fileRequired){
        if(this.actionService == 'editService' || this.actionService == 'deleteService') {
          this.urlIdService = true;
          this.urlIdRegister = false;
          this.idService = this.formService.get('service_id')?.value;
        }else{
          this.urlIdRegister = true;
          this.urlIdService = false;
          this.idService = this.formService.get('service_id')?.value;
        }
      }
    });
  }

  filedata: any;
  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = () => {
      //this.previewImagePath = reader.result as string;
    };
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.filedata = file;
    }
  }

  submitService(){
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.formService;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    let url;
    var formData: any = new FormData();
    if (this.fileRequired) {
      formData.append("coverage", this.filedata);
    } else {
      formData.append("percentaje", form.get('porcentaje')?.value);
    }
    formData.append("service_id", form.get('service_id')?.value);
    formData.append("type_price_id", form.get('type_price_id')?.value);
    formData.append("profile_id", this.data._id);
    if(this.actionService == 'editService'){
      formData.append("status", (form.get('status')?.value) ? '1' : '0');
    }

    if(this.actionService == 'editService') {
      let id = this.formService.get('service_id')?.value;
      url = this.apiMessenger.updateTypePrice(id, formData);
    }else if (this.actionService == 'createService') {
      url = this.apiMessenger.addProduct(formData);
    }else if(this.actionService == 'deleteService') {
      let id = this.formService.get('service_id')?.value;
      url = this.apiMessenger.deleteProductProfile(id);
    }

    url?.subscribe((e: any) => {
      this.submittedForm = false;
      if (e.result) {
        this.toastr.success(e.message, 'Perfil de servicios', {
          timeOut: 3000,
          enableHtml: true
        });
        this.ngOnInit();
        // this.dialogRef.close();
      } else {
        this.toastr.error(e.message, 'Perfil de servicios', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    },
    (error) => {
      this.loadingUploadFile = false;
      let message = this.utils.getErrorMessage(error);
      this.toastr.warning(message, 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  getFileService(){
    let id = this.service_file;
    var filterServiceFile = this.listServiceContentFile.filter(function(service: any) {
      return service.id === id;
    });
    filterServiceFile.forEach((i: any) =>{
      this.dataPriceService = i;
    });
    /* Precios */
    if (this.dataPriceService.price) {
      this.dataPriceService.price.data = {};
      if (this.dataPriceService.price.file) {
        let headers: string[] = [];
        let body: any = [];
        headers.push(' ');
        this.dataPriceService.price.zones.forEach((item: any) => {
          headers.push(item);
        });
        for (let i = 0; i < this.dataPriceService.price.kg.length; i++) {
          let row: any = [];
          row.push(this.dataPriceService.price.kg[i]);
          let t = 0;
          Object.values(this.dataPriceService.price.file[i]).forEach((file: any) => {
            if (t > 0) {
              row.push(file);
            }
            t++;
          });
          body.push(row);
        }
        this.dataPriceService.price.data.content = body;
        this.dataPriceService.price.data.headers = headers;
      }
    }
  }

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
      this.apiMessenger.importServicePrice(formData, this.service_file).subscribe(
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
}