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
export class BranchOfficesTypesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listAdditionalChargeTypes: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<BranchOfficesTypesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      branch_type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

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
      branch_type: form.get('branch_type')?.value,
      description: form.get('description')?.value,
    };

    this.apiCustomer.storeBrandOfficeType(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Tipos de servicios', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Tipos de servicios', {
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
