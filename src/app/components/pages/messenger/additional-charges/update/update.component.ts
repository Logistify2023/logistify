import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './update.component.html'
})

export class AdditionalChargesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string     = '';
  submittedForm: boolean    = false;
  hiddenSelectProduct       = true;
  hiddenSelectCustomer      = true;
  valueAssignAditionalcharge?: string;
  listAdditionalChargeTypes: any[] = [];
  listProducts: any[]   = [];
  listCustomers: any[]  = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AdditionalChargesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private apiCustomer: CustomerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      addition_charge: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      made_by: new FormControl('', [Validators.required]),
      additional_charge_type_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
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
    this.apiMessenger.getAdditionalCharge(this.data._id, true, false, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        if(e.data.type === 'PRODUCT'){
          this.hiddenSelectProduct = false;
          this.hiddenSelectCustomer = true;
        }else if(e.data.type === 'CUSTOMER'){
          this.hiddenSelectCustomer = false;
          this.hiddenSelectProduct = true;
        }else{
          this.hiddenSelectProduct = false;
          this.hiddenSelectCustomer = false;
        }
        let product_ids: any[] = [];
        if (e.data.services) {
          e.data.services.forEach((i: any) => {
            product_ids.push(i.id);
          });
        }
        let customer_ids: any[] = [];
        if (e.data.customers) {
          e.data.customers.forEach((i: any) => {
            customer_ids.push(i.id);
          });
        }
        this.updateForm.setValue({
          id: e.data.id,
          key: e.data.key,
          addition_charge: e.data.addition_charge,
          description: e.data.description,
          type: e.data.type,
          made_by: e.data.made_by,
          product_ids: product_ids,
          customer_ids: customer_ids,
          additional_charge_type_id: e.data.additional_charge_type_id,
          status: (e.data.status == 'DISPONIBLE') ? true : false,
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

  // Cambia de acuerdo al checj de tipo
  changeAssignAditionalcharge() {
    if(this.valueAssignAditionalcharge === 'PRODUCT') {
      this.hiddenSelectProduct = false;
      this.hiddenSelectCustomer = true;
    }else if(this.valueAssignAditionalcharge === 'CUSTOMER') {
      this.hiddenSelectCustomer = false;
      this.hiddenSelectProduct = true;
    }else{
      this.hiddenSelectProduct = false;
      this.hiddenSelectCustomer = false;
    }
  }

  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    let product_ids: any[] = [];
    let customer_ids: any[] = [];
    if(this.valueAssignAditionalcharge === 'PRODUCT'){
      form.get('product_ids')?.value.forEach((i: any) => {
        product_ids.push(i);
      });
    }else if(this.valueAssignAditionalcharge === 'CUSTOMER'){
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
      id: form.get('id')?.value,
      key: form.get('key')?.value,
      addition_charge: form.get('addition_charge')?.value,
      description: form.get('description')?.value,
      type: form.get('type')?.value,
      made_by: form.get('made_by')?.value,
      additional_charge_type_id: form.get('additional_charge_type_id')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
      products: product_ids,
      customers: customer_ids,
    };
    this.apiMessenger.updateAdditionalCharge(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Actualización', {
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