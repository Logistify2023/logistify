import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { Utils } from 'src/app/common/utils';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: []
})
export class QuoteMassiveCreateComponent implements OnInit {
  urlEndPoint = GlobalConstants.apiURL;
  formGroup: FormGroup;
  errorMessages: string =  '';
  uploadFile: boolean = false;
  submittedForm: boolean = false;
  listCustomers:        any[] = [];
  listServicesClient:   any[] = [];
  customer_id: number;
  num_packages: number    = 0;
  num_envelopes: number   = 0;
  multipieza: number      = 0;

  downloadTemplate = false;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef:    MatDialogRef<QuoteMassiveCreateComponent>,
    private apiCustomer: CustomerService,
    private apiShipment: ShipmentsService,
    private utils:       Utils,
    private toastr:      ToastrService,
  ){ 
    this.formGroup = this.formBuilder.group({
      id_customer: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      file: new FormControl('', []),
      package_quantity: new FormControl('', [Validators.nullValidator]),
      envelope_quantity: new FormControl('', [Validators.nullValidator]),
      package_multipece_quantity: new FormControl('', [Validators.nullValidator]),
    });
  }

  ngOnInit(): void {
    this.apiCustomer.getClients(0, false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false).subscribe((e: any) => {
      this.listCustomers = e.data;
    });
  }

  chageClientSelected(){
    this.downloadTemplate = false;
    this.apiCustomer.getClient(this.customer_id).subscribe((e: any) => {
      this.listServicesClient = e.data.profile_services;
    });
  }

  export(){
    this.errorMessages = '';
    if(this.formGroup.invalid){
      this.errorMessages = 'Verifica los datos';
      return;
    }
  
    if(this.num_packages == 0 && this.num_envelopes == 0){ 
      this.errorMessages = 'Ingresa al menos un paquete o sobre que sea mayor a 0';
      return;
    }else{
      this.toastr.success('Plantilla generada exitosamente');
      this.downloadTemplate = true;
    } 
  }

  fileData: any;
  importAdditional(event: any){
    this.uploadFile = true;
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileData = file;
      this.formGroup.patchValue({
        file: this.fileData,
      });
    }
  }

  onSubmit(){
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.formGroup;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    var formData: any = new FormData();
    form.get('products')?.value.forEach((i: any) => {
      formData.append("products[]", i);
    });
    
    formData.append("file", this.fileData);
    console.log(formData.value);
    this.apiShipment.importQuoteMassive(this.customer_id, formData).subscribe(
      (e: any) => {
        if (e.result) {
          console.log(e.data)
          this.toastr.success(e.message, 'Cotización', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Error', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.toastr.error(message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }

}
