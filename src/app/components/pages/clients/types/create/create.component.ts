import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})

export class TypesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listAdditionalChargeTypes: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TypesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      customer_type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      min: new FormControl('', [Validators.required]),
      max: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.createForm;

    if (form.invalid) {
      console.log(form);
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    const data = {
      customer_type: this.createForm.get('customer_type')?.value,
      description: this.createForm.get('description')?.value,
      min: this.createForm.get('min')?.value,
      max: this.createForm.get('max')?.value,
    };

    this.apiCustomer.storeClientsTypes(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Tipo de cliente', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Tipo de cliente', {
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