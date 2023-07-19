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
export class CostsCenterCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCustomers: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CostsCenterCreateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      cost_center: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      customer_id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.apiCustomer.getClients().subscribe((e: any) => {
      this.listCustomers = e.data;
    });
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
      cost_center: this.createForm.get('cost_center')?.value,
      description: this.createForm.get('description')?.value,
      customer_id: this.createForm.get('customer_id')?.value,
    };

    this.apiCustomer.storeCostsCenter(data).subscribe(
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
