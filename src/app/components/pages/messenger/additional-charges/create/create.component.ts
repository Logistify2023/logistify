import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})

export class AdditionalChargesCreateComponent {
  
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  hiddenSelectProduct: boolean = true
  hiddenSelectCustomer: boolean = true;
  valueAditionalcharge?: string;
  listAdditionalChargeTypes: any[] = [];
  listProducts: any[] = [];
  listCustomers: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AdditionalChargesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      key: new FormControl('', [Validators.required]),
      addition_charge: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      made_by: new FormControl('', [Validators.required]),
      additional_charge_type_id: new FormControl('', [Validators.required]),
      product_ids: new FormControl('', [Validators.nullValidator]),
      customer_ids: new FormControl('', [Validators.nullValidator]),
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getAdditionalChargeTypes(0, false, false, 'charge_type').subscribe((e: any) => {
      this.listAdditionalChargeTypes = e.data;
    });
    this.apiMessenger.getServices(0).subscribe((e: any) => {
      this.listProducts = e.data;
    });
    this.apiCustomer.getClients(0).subscribe((e: any) => {
      this.listCustomers = e.data;
    });
  }

  // Cambia de acuerdo al checj de tipo
  changeAditionalcharge() {
    if(this.valueAditionalcharge === 'PRODUCT') {
      this.hiddenSelectProduct = false;
      this.hiddenSelectCustomer = true;
    }else if(this.valueAditionalcharge === 'CUSTOMER') {
      this.hiddenSelectCustomer = false;
      this.hiddenSelectProduct = true;
    }else{
      this.hiddenSelectProduct = false;
      this.hiddenSelectCustomer = false;
    }
  }

  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.createForm;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    let product_ids: any[] = [];
    let customer_ids: any[] = [];
    if(this.valueAditionalcharge === 'PRODUCT'){
      form.get('product_ids')?.value.forEach((i: any) => {
        product_ids.push(i);
      });
    }else if(this.valueAditionalcharge === 'CUSTOMER'){
      form.get('customer_ids')?.value.forEach((i: any) => {
        customer_ids.push(i);
      });
    }else{
      form.get('product_ids')?.value.forEach((i: any) => {
        product_ids.push(i);
      });
      form.get('customer_ids')?.value.forEach((i: any) => {
        customer_ids.push(i);
      });
    }
    const data = {
      key: form.get('key')?.value,
      addition_charge: form.get('addition_charge')?.value,
      description: form.get('description')?.value,
      type: form.get('type')?.value,
      made_by: form.get('made_by')?.value,
      additional_charge_type_id: form.get('additional_charge_type_id')?.value,
      products: product_ids,
      customers: customer_ids,
    };
    this.apiMessenger.storeAdditionalCharge(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cargo adicional', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Cargo adicional', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}