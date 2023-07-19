import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})

export class ContactsCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  listSettlement: any[] = [];

  listCustomers: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ContactsCreateComponent>,
    private formBuilder: FormBuilder,
    private apiCustomer: CustomerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog
  ) {
    this.createForm = formBuilder.group({
      branch_office: new FormControl('', [Validators.required]),
      contact: new FormControl('', [Validators.required]),
      business: new FormControl('', [Validators.required]),
      stall: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      rfc: new FormControl('', [Validators.nullValidator]),
      email: new FormControl('', [Validators.required]),
      customer_id: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.nullValidator]),

      street: new FormControl('', [Validators.required]),
      suburb: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      reference: new FormControl('', [Validators.required]),
      outdoor_number: new FormControl('', [Validators.required]),
      interior_number: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [Validators.required]),
      id_postal_code: new FormControl('', []),
      estado: new FormControl('', []),
      ciudad: new FormControl('', []),
      municipio: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.apiCustomer.getClients().subscribe((e: any) => {
      this.listCustomers = e.data;
    });
  }

  validateCP() {
    this.apiUtils.getAddressByPostalCode(this.createForm.get('postal_code')?.value).subscribe((e: any) => {
      if (e.result) {
        if (e.data.length === 0) {
          this.errorMessages = 'No se encontro el código postal';
        }
        else {
          this.listSettlement = e.data;
          this.createForm.get('estado')?.setValue(this.listSettlement[0].state);
          this.createForm.get('ciudad')?.setValue(this.listSettlement[0].city);
          this.createForm.get('municipio')?.setValue(this.listSettlement[0].municipality);
          this.errorMessages = '';
        }
      }
    })
  }

  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.createForm;
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    const data = {
      branch_office: this.createForm.get('branch_office')?.value,
      business: this.createForm.get('business')?.value,
      contact: this.createForm.get('contact')?.value,
      stall: this.createForm.get('stall')?.value,
      rfc: this.createForm.get('rfc')?.value,
      phone: this.createForm.get('phone')?.value,
      email: this.createForm.get('email')?.value,
      customer_id: this.createForm.get('customer_id')?.value,
      description: this.createForm.get('description')?.value,
      street: this.createForm.get('street')?.value,
      suburb: this.createForm.get('suburb')?.value,
      reference: this.createForm.get('reference')?.value,
      outdoor_number: this.createForm.get('outdoor_number')?.value,
      interior_number: this.createForm.get('interior_number')?.value,
      postal_code: (this.createForm.get('postal_code')?.value)?.toString(),
      id_postal_code: this.listSettlement.find(x => x.settlement == this.createForm.get('suburb')?.value).id,
    };
    this.apiCustomer.storeContact(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Contactos', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Contactos', {
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