import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer.service';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './details.component.html'
})

export class ClientsDetailsComponent implements OnInit {
  urlEndPoint: String = GlobalConstants.apiURL;
  objectDetails: any = {};
  chargesAdditionals: any[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  updatePriceChargeForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  loadingUploadFile: boolean = false;
  id = this.data._id;
  datosUsuario: any;

  columsDetails_AdditionalChanges: string[] = ['key', 'addition_charge', 'type', 'price_default', 'status'];
  columsDetails_Contactsables: string[] = ['branch_office', 'contact', 'state', 'city', 'municipality', 'settlement', 'postal_code', 'phone'];
  columsDetails_Products: string[] = ['name', 'type', 'key', 'existence', 'status'];
  columsDetails_Shipments: string[] = ['guide', 'track', 'generated_date', 'send_date', 'delivered_date', 'type', 'status'];
  columsDetails_AdditionalCharge: string[] = ['charge', 'price', 'service', 'status', 'update'];

  actionService?: string;
  hiddenForm        = true;
  isChangePrice     = false;
  formChargeService: FormGroup;
  listAdditionalCharges: any[] = [];
  listAdditionalChargesAll: any[] = [];
  listServicesAll: any[] = [];
  listServices: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ClientsDetailsComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private apiMessenger: MessengerService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      // Form for update price 
      this.updatePriceChargeForm = formBuilder.group({
        price: new FormControl('', [Validators.required]),
      });
      // Form for update service and price
      this.formChargeService = formBuilder.group({
        additional_charge_id: new FormControl('', [Validators.required]),
        customer_id: new FormControl('', []),
        price: new FormControl('', [Validators.required]),
        service_id: new FormControl('', [Validators.required]),
        delete_id: new FormControl('', []),
      });
    }

  ngOnInit(): void {
    // Ocultamos el formulario
    this.hiddenForm = true;
    // Obtenemos los cargos adicionales del cliente
    this.getChargesForCustomer();
    // Obtenemos todos los cargos adicionales
    this.apiMessenger.getAdditionalCharge(0, false, false).subscribe((e: any) => {
      this.listAdditionalChargesAll = e.data;
    });
    // Obtenemos todos los servicios
    this.apiMessenger.getServices(0, false, false, false, false, false, false, false, false, false, false, false, false).subscribe((e: any) => {
      this.listServicesAll = e.data; 
    });
    // Obtenemos la información del cliente
    this.apiCustomer.getClients(this.data._id, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        this.datosUsuario = e.data.your_account[0];       
        if (this.objectDetails.shipments.length == 0)
          this.objectDetails.shipments = null;
        if (this.objectDetails.products.length == 0)
          this.objectDetails.products = null;
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

  // Se encarga de obtener los cargos adicionales de un cliente
  getChargesForCustomer(){
    this.apiCustomer.showChargeService(this.data._id).subscribe((e: any) => {
      if (e.result) {
        this.chargesAdditionals = e.data;
        for(var item in this.chargesAdditionals) {
          this.chargesAdditionals[item].editPrice = false;
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
    this.apiCustomer.updateChargeCustomer(item.id, data).subscribe((e: any) =>{
      this.submittedForm = false;
      if(e.result){
        this.toastr.success(e.message, 'Actualizado', {
          timeOut: 3000,
          enableHtml: true
        });
        this.getChargesForCustomer();
        this.formChargeService.get('price')?.setValue('');
      }else{
        this.toastr.error(e.message, 'Error al actualizar', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    });
  }

  importAddress(event: any) {
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
      
      this.apiCustomer.importAddressCustomer(this.id, formData).subscribe(
        (e: any) => {
          this.loadingUploadFile = false;
          if (e.result) {
            this.toastr.success(e.message, 'Success', {
              timeOut: 3000,
              enableHtml: true
            });
            this.ngOnInit();
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

  defineActionCharge() {
    this.hiddenForm = false;
    this.formChargeService.get('additional_charge_id')?.setValue('');
    this.formChargeService.get('price')?.setValue('');
    this.formChargeService.get('service_id')?.setValue('');
    if(this.actionService == 'createChargeAditional') {
      this.listAdditionalCharges = this.listAdditionalChargesAll;
    }else{
      this.listAdditionalCharges = this.chargesAdditionals;
      /* this.apiMessenger.getAdditionalCharge(0, false, false, false, false, false).subscribe((e: any) => {
        if (e.result) {
          this.listAdditionalCharges = e.data;
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
      }); */
    }
  }

  changeAdditionalCharge() {
    const additionable_id = this.formChargeService.get('additional_charge_id')?.value;
    let additionableCharges: any[] = [];
    let additionableCharge: any[] = [];
    additionableCharges = this.chargesAdditionals;
    additionableCharge = additionableCharges.filter(function(ac: any) {
      return ac.id === additionable_id;
    });
    
    if(this.actionService == 'editChargeAditional' || this.actionService == 'deleteChargeAditional') {
      this.formChargeService.get('additional_charge_id')?.setValue(additionableCharge[0]?.additional_charge_id);
      this.formChargeService.get('service_id')?.setValue(additionableCharge[0]?.serviceable_id);
      this.formChargeService.get('price')?.setValue(additionableCharge[0]?.price)
      this.formChargeService.get('delete_id')?.setValue(additionable_id)
    }else{
      this.formChargeService.get('service_id')?.setValue('');
    }
  }

  submitChargeService() {
    this.errorMessages = '';
    this.submittedForm = true;
    var form = this.formChargeService;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    let url;
    var data: object = {};
    data = {
      additional_charge_id: form.get('additional_charge_id')?.value,
      service_id: form.get('service_id')?.value,
      price: form.get('price')?.value,
      customer_id: this.data._id,
    }
    if(this.actionService == 'editChargeAditional') {
      let id = this.formChargeService.get('additional_charge_id')?.value;
      url = this.apiCustomer.updateChargeService(id, data);
    }else if (this.actionService == 'createChargeAditional') {
      url = this.apiCustomer.storeChargeService(data);
    }else if(this.actionService == 'deleteChargeAditional') {
      let id = this.formChargeService.get('delete_id')?.value;
      url = this.apiCustomer.deleteChargeService(id);
    }

    url?.subscribe((e: any) => {
      this.submittedForm = false;
      if (e.result) {
        this.toastr.success(e.message, 'Cargo adicional', {
          timeOut: 3000,
          enableHtml: true
        });
        this.getChargesForCustomer();
        this.hiddenForm = true;
        this.formChargeService.get('additional_charge_id')?.setValue('');
        this.formChargeService.get('price')?.setValue('');
        this.formChargeService.get('service_id')?.setValue('');
      } else {
        this.toastr.error(e.message, 'Cargo adicional', {
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
}