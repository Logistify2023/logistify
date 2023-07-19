import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  templateUrl: './update.component.html'
})

export class ContactsUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCustomers: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ContactsUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      branch_office: new FormControl('', [Validators.required]),
      contact: new FormControl('', [Validators.required]),
      business: new FormControl('', [Validators.required]),
      stall: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      rfc: new FormControl('', [Validators.nullValidator]),
      email: new FormControl('', [Validators.required]),
      customer_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiCustomer.getClients().subscribe((e: any) => {
      this.listCustomers = e.data;
    });
    this.apiCustomer.getContacts(this.data._id, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        let customers: any[] = [];
        e.data.customers.forEach((i: any) => {
          customers.push({ id: i.id, business_name: i.business_name });
        });
        this.updateForm.setValue({
          id: e.data.id,
          branch_office: e.data.branch_office,
          contact: e.data.contact,
          business: e.data.business,
          stall: e.data.stall,
          phone: e.data.phone,
          rfc: e.data.rfc,
          email: e.data.email,
          customer_id: (e.data.customers) ? e.data.customers[0].id : 0,
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

  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    const data = {
      id: form.get('id')?.value,
      branch_office: form.get('branch_office')?.value,
      contact: form.get('contact')?.value,
      business: form.get('business')?.value,
      stall: form.get('stall')?.value,
      phone: form.get('phone')?.value,
      rfc: form.get('rfc')?.value,
      email: form.get('email')?.value,
      customer_id: form.get('customer_id')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };
    this.apiCustomer.updateContact(data).subscribe(
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